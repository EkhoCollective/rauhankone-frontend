<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { interactivity, useCursor } from '@threlte/extras';
	import { OrbitControls } from '@threlte/extras';
	import * as THREE from 'three';
	import { onMount } from 'svelte';

	interactivity();

	// Configuration
	let count = 1000;
	let pointSize = 10;
	let hoverSizeMultiplier = 2.5;

	// Colors
	const white = new THREE.Color('hotpink');
	const orange = new THREE.Color('orange');

	// Generate initial data
	let positions: Float32Array;
	let colors: Float32Array;
	let sizes: Float32Array;

	// Generate particle data
	function generateParticles() {
		const posArray = [...new Array(count * 3)].map(() => 5 - Math.random() * 10);
		const colorArray = [...new Array(count)].flatMap(() => orange.toArray());
		const sizeArray = [...new Array(count)].map(() => pointSize);
		positions = new Float32Array(posArray);
		colors = new Float32Array(colorArray);
		sizes = new Float32Array(sizeArray);
	}

	// Initialize particles
	generateParticles();

	// Refs for Three.js objects
	let pointsRef: THREE.Points | undefined;
	let geometryRef: THREE.BufferGeometry | undefined;
	let materialRef: THREE.PointsMaterial | undefined;

	// Hover state tracking
	let hoveredPoint: number | null = null;
	let previousHoveredPoint: number | null = null;

	onMount(() => {
		// Set up geometry attributes
		if (geometryRef) {
			geometryRef.setAttribute('position', new THREE.BufferAttribute(positions, 3));
			geometryRef.setAttribute('color', new THREE.BufferAttribute(colors, 3));
			geometryRef.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
		}

		// Enable vertex sizes on the material - use a small delay to ensure material is ready
		setTimeout(() => {
			if (materialRef) {
				(materialRef as any).vertexSizes = true;
				materialRef.needsUpdate = true;
			}
		}, 100);
	});

	// Hover handlers
	function handlePointerOver(event: any) {
		event.stopPropagation();
		if (event.intersections.length > 0 && geometryRef) {
			const index = event.intersections[0].index;
			if (index !== undefined && hoveredPoint !== index) {
				previousHoveredPoint = hoveredPoint;
				hoveredPoint = index;
				updatePointAttributes();
			}
		}
	}

	function handlePointerOut(event: any) {
		previousHoveredPoint = hoveredPoint;
		hoveredPoint = null;
		updatePointAttributes();
	}

	// Function to update point colors and sizes
	function updatePointAttributes(): void {
		if (!geometryRef) return;

		const colors = geometryRef.attributes.color.array;
		const pointSizes = geometryRef.attributes.size.array;

		// Reset previous hovered point if it exists
		if (previousHoveredPoint !== null) {
			orange.toArray(colors, previousHoveredPoint * 3);
			pointSizes[previousHoveredPoint] = pointSize;
		}

		// Set hover color and increased size for current hovered point
		if (hoveredPoint !== null) {
			white.toArray(colors, hoveredPoint * 3);
			pointSizes[hoveredPoint] = pointSize * hoverSizeMultiplier;
		}

		geometryRef.attributes.color.needsUpdate = true;
		geometryRef.attributes.size.needsUpdate = true;
	}

	// Animation loop
	let time = 0;
	useTask(() => {
		if (!geometryRef || !positions) return;

		time += 0.016; // Approximate 60fps delta time

		for (let i = 0; i < positions.length; i++) {
			positions[i] += Math[i % 2 ? 'sin' : 'cos'](1000 * i + time) / 300;
		}

		geometryRef.attributes.position.needsUpdate = true;
	});
</script>

<T.PerspectiveCamera
	makeDefault
	position={[100, 100, 100]}
	args={[75, 1, 0.1, 1000]}
	let:ref={camera}
>
	{#if camera}
		{(camera.zoom = 40)}
		{camera.updateProjectionMatrix()}
	{/if}
	<OrbitControls autoRotate autoRotateSpeed={0.1} />
</T.PerspectiveCamera>

<T.Points bind:ref={pointsRef} onpointermove={handlePointerOver} onpointerleave={handlePointerOut}>
	<T.BufferGeometry bind:ref={geometryRef} />
	<T.PointsMaterial
		bind:ref={materialRef}
		transparent={true}
		vertexColors={true}
		size={pointSize}
		sizeAttenuation={true}
		depthWrite={false}
		toneMapped={false}
	/>
</T.Points>
