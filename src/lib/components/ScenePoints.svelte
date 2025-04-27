<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { interactivity, useCursor } from '@threlte/extras';
	import { Spring } from 'svelte/motion';
	import { Environment, OrbitControls } from '@threlte/extras';
	import * as THREE from 'three';

	interactivity();

	// Configuration
	let pointCount: number = 1000;
	let distributionWidth: number = 5; // Standard deviation for normal distribution
	let pointSize: number = 0.15;
	let pointColor: string = 'white';
	let hoverColor: string = '#FF0000'; // Red color for hover
	let autoRotateCamera: boolean = false;

	// Use cursor hook for hover state
	const { hovering, onPointerEnter, onPointerLeave } = useCursor();

	// Define types for point data
	type PointData = {
		positions: Float32Array;
		colors: Float32Array;
		sizes: Float32Array;
	};

	// Generate points with normal distribution
	function generateNormalDistributionPoints(count: number, width: number): PointData {
		const positions: number[] = [];
		const colors: number[] = [];
		const sizes: number[] = [];
		const baseColor = new THREE.Color(pointColor);

		// Box-Muller transform for normal distribution
		for (let i = 0; i < count; i++) {
			// Generate normal distribution for x, y, z
			const x = normalRandom() * width;
			const y = normalRandom() * width;
			const z = normalRandom() * width;

			positions.push(x, y, z);
			colors.push(baseColor.r, baseColor.g, baseColor.b);
			sizes.push(pointSize);
		}

		return {
			positions: new Float32Array(positions),
			colors: new Float32Array(colors),
			sizes: new Float32Array(sizes)
		};
	}

	// Box-Muller transform for normal distribution
	function normalRandom(): number {
		let u = 0,
			v = 0;
		while (u === 0) u = Math.random();
		while (v === 0) v = Math.random();
		return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
	}

	// Generate initial point data
	let pointData: PointData = generateNormalDistributionPoints(pointCount, distributionWidth);

	// Create refs for points and geometry
	let pointsRef: THREE.Points | undefined;
	let geometryRef: THREE.BufferGeometry | undefined;
	let hoverSphereRef: THREE.Mesh | undefined;

	// Point hovering variables
	let hoveredPoint: number | null = null;
	let hoverSphereVisible: boolean = false;
	let hoverPosition = { x: 0, y: 0, z: 0 };
	const hoverScale = new Spring(1);

	// Scene rotation
	let rotation: number = 0;
	useTask((delta: number) => {
		rotation += delta * 0.1;
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
				hoverScale.target = 1.5;

				// Change color of the hovered point
				hoveredPoint = index;

				// Trigger pointer enter for cursor state
				onPointerEnter();
			}
		} else {
			// No intersection, hide hover sphere with animation
			hoverScale.target = 1;
			hoveredPoint = null;

			// Trigger pointer leave for cursor state
			onPointerLeave();
		}
	}

	// Update point colors when hovering
	$: if (geometryRef && hoveredPoint !== null) {
		const colors = geometryRef.attributes.color.array;
		const hoverColorObj = new THREE.Color(hoverColor);
		const baseColorObj = new THREE.Color(pointColor);

		// Reset all colors
		for (let i = 0; i < pointCount; i++) {
			colors[i * 3] = baseColorObj.r;
			colors[i * 3 + 1] = baseColorObj.g;
			colors[i * 3 + 2] = baseColorObj.b;
		}

		// Set hover color for hovered point
		if (hoveredPoint !== null) {
			colors[hoveredPoint * 3] = hoverColorObj.r;
			colors[hoveredPoint * 3 + 1] = hoverColorObj.g;
			colors[hoveredPoint * 3 + 2] = hoverColorObj.b;

			// Make hovered point larger if we have size attribute
			if (geometryRef.attributes.size) {
				const sizes = geometryRef.attributes.size.array;
				sizes[hoveredPoint] = pointSize * 2;
				geometryRef.attributes.size.needsUpdate = true;
			}
		}

		geometryRef.attributes.color.needsUpdate = true;
	}

	// Reactive color based on hovering state
	$: currentColor = $hovering ? hoverColor : pointColor;

	// Regenerate points when count changes
	function updatePoints(): void {
		pointData = generateNormalDistributionPoints(pointCount, distributionWidth);

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

<!-- Controls
<div class="controls" style="position: absolute; top: 10px; left: 10px; color: white; z-index: 100; background: rgba(0,0,0,0.5); padding: 10px; border-radius: 5px;">
  <label>
    Points: <input type="range" bind:value={pointCount} min="100" max="5000" step="100" on:change={updatePoints} />
    {pointCount}
  </label>
  <br />
  <label>
    Distribution Width: <input type="range" bind:value={distributionWidth} min="1" max="10" step="0.5" on:change={updatePoints} />
    {distributionWidth}
  </label>
  <br />
  <label>
    <input type="checkbox" bind:checked={autoRotateCamera} />
    Auto Rotate Camera
  </label>
</div> -->

<!-- Scene -->
<T.PerspectiveCamera makeDefault position={[0, 0, 15]}>
	<OrbitControls autoRotate={autoRotateCamera} />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.5} />
<T.DirectionalLight position={[10, 10, 10]} intensity={1} castShadow />

<!-- Points -->
<T.Points
	bind:ref={pointsRef}
	onpointermove={handlePointerMove}
	scale={hoverScale.current}
	onpointerenter={() => {
		hoverScale.target = 1.5;
		onPointerEnter();
	}}
	onpointerleave={() => {
		hoverScale.target = 1;
		onPointerLeave();
		// hoveredPoint = null;
	}}
>
	<T.BufferGeometry bind:ref={geometryRef}>
		<T.Float32BufferAttribute attach="attributes.position" args={[pointData.positions, 3]} />
		<T.Float32BufferAttribute attach="attributes.color" args={[pointData.colors, 3]} />
		<T.Float32BufferAttribute attach="attributes.size" args={[pointData.sizes, 1]} />
	</T.BufferGeometry>
	<T.PointsMaterial
		size={pointSize}
		vertexColors={true}
		sizeAttenuation={true}
		transparent={true}
		alphaTest={0.2}
	/>
</T.Points>

<!-- Hover indicator sphere
<T.Mesh
	bind:ref={hoverSphereRef}
	position={[hoverPosition.x, hoverPosition.y, hoverPosition.z]}
	scale={$hovering ? 0.2 : 0}
	visible={hoverSphereVisible}
>
	<T.SphereGeometry args={[1, 16, 16]} />
	<T.MeshStandardMaterial color={currentColor} transparent={true} opacity={0.7} />
</T.Mesh> -->

<!-- // NOTES 
 - the whole "world" scales when hovering bug 
 - points are not scaling when hover (Related
to above) -->
