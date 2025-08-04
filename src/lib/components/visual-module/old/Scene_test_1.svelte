<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { interactivity, useCursor } from '@threlte/extras';
	// import { Spring } from 'svelte/motion';
	import { Environment, OrbitControls } from '@threlte/extras';
	import * as THREE from 'three';
	import { onMount } from 'svelte';

	interactivity();

	// Configuration
	let pointCount: number = 1000;
	let distributionWidth: number = 15; // Increased width for more space
	let pointSize: number = 0.5;
	let pointColor: string = 'white';
	let hoverColor: string = '#FF0000'; // Red color for hover
	let hoverSizeMultiplier: number = 2.5; // Multiplier for hovered point size
	let autoRotateCamera: boolean = false;

	// Flocking parameters
	let maxSpeed = 0.05;
	let maxForce = 0.005;
	let cohesionWeight = 1.0;
	let alignmentWeight = 1.0;
	let separationWeight = 1.5;
	let perceptionRadius = 3;
	let separationDistance = 1;

	// Use cursor hook for hover state
	const { hovering, onPointerEnter, onPointerLeave } = useCursor();

	// Define types for point data
	type PointData = {
		positions: Float32Array;
		colors: Float32Array;
		sizes: Float32Array;
		velocities: Float32Array;
	};

	// Generate points with normal distribution
	function generatePoints(count: number, width: number): PointData {
		const positions: number[] = [];
		const colors: number[] = [];
		const sizes: number[] = [];
		const velocities: number[] = [];
		const baseColor = new THREE.Color(pointColor);

		for (let i = 0; i < count; i++) {
			const x = (Math.random() - 0.5) * width * 2;
			const y = (Math.random() - 0.5) * width * 2;
			const z = (Math.random() - 0.5) * width * 2;
			positions.push(x, y, z);
			colors.push(baseColor.r, baseColor.g, baseColor.b);
			sizes.push(1.0); // Use 1.0 as the base multiplier

			// Random initial velocity
			velocities.push(
				(Math.random() - 0.5) * 0.1,
				(Math.random() - 0.5) * 0.1,
				(Math.random() - 0.5) * 0.1
			);
		}

		return {
			positions: new Float32Array(positions),
			colors: new Float32Array(colors),
			sizes: new Float32Array(sizes),
			velocities: new Float32Array(velocities)
		};
	}

	// Generate initial point data
	let pointData: PointData = generatePoints(pointCount, distributionWidth);

	// Create refs for points and geometry
	let pointsRef: THREE.Points | undefined;
	let geometryRef: THREE.BufferGeometry | undefined;
	let hoverSphereRef: THREE.Mesh | undefined;

	onMount(() => {
		if (!geometryRef) return;
		geometryRef.setAttribute('position', new THREE.BufferAttribute(pointData.positions, 3));
		geometryRef.setAttribute('color', new THREE.BufferAttribute(pointData.colors, 3));
		geometryRef.setAttribute('size', new THREE.BufferAttribute(pointData.sizes, 1));
	});

	// Point hovering variables
	let hoveredPoint: number | null = null;
	let previousHoveredPoint: number | null = null;
	let hoverSphereVisible: boolean = false;
	let hoverPosition = { x: 0, y: 0, z: 0 };

	// Scene rotation
	useTask(() => {
		if (!geometryRef || !pointData) return;

		const positions = pointData.positions;
		const velocities = pointData.velocities;

		const boidCount = pointCount;
		const bounds = distributionWidth;

		const currentPosition = new THREE.Vector3();
		const otherPosition = new THREE.Vector3();
		const velocity = new THREE.Vector3();

		const separation = new THREE.Vector3();
		const alignment = new THREE.Vector3();
		const cohesion = new THREE.Vector3();
		const acceleration = new THREE.Vector3();

		for (let i = 0; i < boidCount; i++) {
			const i3 = i * 3;
			currentPosition.fromArray(positions, i3);
			velocity.fromArray(velocities, i3);

			separation.set(0, 0, 0);
			alignment.set(0, 0, 0);
			cohesion.set(0, 0, 0);
			let perceptionCount = 0;

			for (let j = 0; j < boidCount; j++) {
				if (i === j) continue;

				const j3 = j * 3;
				otherPosition.fromArray(positions, j3);
				const distance = currentPosition.distanceTo(otherPosition);

				if (distance > 0 && distance < perceptionRadius) {
					cohesion.add(otherPosition);
					alignment.add(new THREE.Vector3().fromArray(velocities, j3));

					if (distance < separationDistance) {
						const diff = new THREE.Vector3().subVectors(currentPosition, otherPosition);
						diff.divideScalar(distance * distance);
						separation.add(diff);
					}
					perceptionCount++;
				}
			}

			if (perceptionCount > 0) {
				cohesion.divideScalar(perceptionCount);
				cohesion.sub(currentPosition);
				cohesion.normalize().multiplyScalar(maxSpeed);
				cohesion.sub(velocity).clampLength(0, maxForce);

				alignment.divideScalar(perceptionCount);
				alignment.normalize().multiplyScalar(maxSpeed);
				alignment.sub(velocity).clampLength(0, maxForce);

				separation.divideScalar(perceptionCount);
				separation.normalize().multiplyScalar(maxSpeed);
				separation.sub(velocity).clampLength(0, maxForce);

				acceleration
					.add(cohesion.multiplyScalar(cohesionWeight))
					.add(alignment.multiplyScalar(alignmentWeight))
					.add(separation.multiplyScalar(separationWeight));
			}

			velocity.add(acceleration);
			velocity.clampLength(-maxSpeed, maxSpeed);
			velocity.toArray(velocities, i3);

			currentPosition.add(velocity);
			currentPosition.toArray(positions, i3);

			if (currentPosition.x > bounds) positions[i3] = -bounds;
			if (currentPosition.x < -bounds) positions[i3] = bounds;
			if (currentPosition.y > bounds) positions[i3 + 1] = -bounds;
			if (currentPosition.y < -bounds) positions[i3 + 1] = bounds;
			if (currentPosition.z > bounds) positions[i3 + 2] = -bounds;
			if (currentPosition.z < -bounds) positions[i3 + 2] = bounds;

			acceleration.set(0, 0, 0);
		}

		if (geometryRef.attributes.position) {
			geometryRef.attributes.position.needsUpdate = true;
		}
	});

	// Use threlte size
	const { size } = useThrelte();

	// Type definition for the intersection event
	type PointerEvent = {
		intersections: Array<{
			index?: number;
			object: THREE.Object3D;
			distance: number;
			point: THREE.Vector3;
		}>;
	};

	// Function to handle pointer move over points
	function handlePointerMove(event: PointerEvent): void {
		if (event.intersections.length > 0) {
			const intersection = event.intersections[0];

			// Get the index of the point
			const index = intersection.index;

			// Extract the position from the positions array
			if (index !== undefined && geometryRef) {
				const positions = geometryRef.attributes.position.array;

				hoverPosition = {
					x: positions[index * 3],
					y: positions[index * 3 + 1],
					z: positions[index * 3 + 2]
				};

				hoverSphereVisible = true;

				// Store previous hovered point to reset it
				if (hoveredPoint !== index) {
					previousHoveredPoint = hoveredPoint;
					hoveredPoint = index;

					// Update point colors and sizes
					updatePointAttributes();
				}

				// Trigger pointer enter for cursor state
				onPointerEnter();
			}
		} else {
			// No intersection, reset hover state
			previousHoveredPoint = hoveredPoint;
			hoveredPoint = null;

			// Update point attributes to reset the previously hovered point
			updatePointAttributes();

			// Trigger pointer leave for cursor state
			onPointerLeave();
		}
	}

	// Function to update point colors and sizes
	function updatePointAttributes(): void {
		if (!geometryRef) return;

		const colors = geometryRef.attributes.color.array;
		const sizes = geometryRef.attributes.size.array;
		const hoverColorObj = new THREE.Color(hoverColor);
		const baseColorObj = new THREE.Color(pointColor);

		// Reset previous hovered point if it exists
		if (previousHoveredPoint !== null) {
			colors[previousHoveredPoint * 3] = baseColorObj.r;
			colors[previousHoveredPoint * 3 + 1] = baseColorObj.g;
			colors[previousHoveredPoint * 3 + 2] = baseColorObj.b;
			sizes[previousHoveredPoint] = 1.0; // Reset to base multiplier
		}

		// Set hover color and increased size for current hovered point
		if (hoveredPoint !== null) {
			colors[hoveredPoint * 3] = hoverColorObj.r;
			colors[hoveredPoint * 3 + 1] = hoverColorObj.g;
			colors[hoveredPoint * 3 + 2] = hoverColorObj.b;
			sizes[hoveredPoint] = hoverSizeMultiplier; // Use multiplier directly
		}

		geometryRef.attributes.color.needsUpdate = true;
		geometryRef.attributes.size.needsUpdate = true;
	}

	// Reactive color based on hovering state
	$: currentColor = $hovering ? hoverColor : pointColor;

	// Regenerate points when count changes
	function updatePoints(): void {
		pointData = generatePoints(pointCount, distributionWidth);

		if (geometryRef) {
			geometryRef.setAttribute('position', new THREE.BufferAttribute(pointData.positions, 3));
			geometryRef.setAttribute('color', new THREE.BufferAttribute(pointData.colors, 3));
			geometryRef.setAttribute('size', new THREE.BufferAttribute(pointData.sizes, 1));
			geometryRef.attributes.position.needsUpdate = true;
			geometryRef.attributes.color.needsUpdate = true;
			geometryRef.attributes.size.needsUpdate = true;
		}
	}
</script>

<!-- Scene -->
<T.PerspectiveCamera makeDefault position={[0, 0, 50]}>
	<OrbitControls autoRotate autoRotateSpeed={0.1} />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.5} />
<T.DirectionalLight position={[10, 10, 10]} intensity={1} castShadow />

<!-- Points -->
<T.Points
	bind:ref={pointsRef}
	onpointermove={handlePointerMove}
	onpointerleave={() => {
		previousHoveredPoint = hoveredPoint;
		hoveredPoint = null;
		updatePointAttributes();
		onPointerLeave();
	}}
>
	<T.BufferGeometry bind:ref={geometryRef} />
	<T.PointsMaterial
		size={pointSize}
		vertexColors={true}
		sizeAttenuation={true}
		transparent={true}
		alphaTest={0.2}
	/>
</T.Points>
