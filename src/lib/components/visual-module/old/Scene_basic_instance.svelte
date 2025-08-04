<script lang="ts">
	import { onMount } from 'svelte';
	// import { getLocaleFullName } from '$lib/utils/locale_handler';
	import StoryElement from '../StoryElement.svelte';
	import testData from '$lib/utils/testData.json';
	import { Color } from 'three';
	import { T, useTask, useThrelte } from '@threlte/core';
	import {
		interactivity,
		Instance,
		InstancedMesh,
		OrbitControls,
		CameraControls,
		type CameraControlsRef
	} from '@threlte/extras';

	const storiesNumber = 1000;
	const worldRadius: number = 20;
	const instances: StoryElement[] = [];
	const startColor = new Color('blue');
	const endColor = new Color('white');

	for (let i = 0; i < storiesNumber; i += 1) {
		let r = Math.random() * worldRadius;
		let vx = Math.random() * 2 - 1;
		let vy = Math.random() * 2 - 1;
		let vz = Math.random() * 2 - 1;
		const magnitude = Math.sqrt(vx * vx + vy * vy + vz * vz);

		const scale = Math.random() + 0.1;

		vx = vx / magnitude;
		vy = vy / magnitude;
		vz = vz / magnitude;

		var c = Math.cbrt(r);

		instances.push(
			new StoryElement(
				startColor,
				endColor,
				scale,
				c * vx * worldRadius,
				c * vy * worldRadius,
				c * vz * worldRadius
			)
		);
	}

	interactivity({
		filter(items) {
			// only report the first intersection
			return items.slice(0, 1);
		}
	});

	let {
		controls = $bindable()
	}: {
		controls?: CameraControlsRef;
	} = $props();
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 50]}>
	<CameraControls bind:ref={controls} />
	<!-- <OrbitControls autoRotate={true} autoRotateSpeed={10} /> -->
	<!-- Only orbit or camera but not both because they control the same camera -->
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.4} />
<T.DirectionalLight position={[1, 2, 5]} />

<InstancedMesh {storiesNumber} range={storiesNumber}>
	<T.SphereGeometry />
	<T.MeshToonMaterial />

	{#each instances as instance}
		<Instance
			position.x={instance.x}
			position.y={instance.y}
			position.z={instance.z}
			scale={instance.scale}
			color={instance.color}
			onpointerenter={() => {
				instance.tw.set(1);
			}}
			onpointerleave={() => {
				instance.tw.set(0);
			}}
		/>
	{/each}
</InstancedMesh>
