<script lang="ts">
	import { onMount } from 'svelte';
	import { apiRequest } from '$lib/utils/api_request';
	import { getLocaleFullName } from '$lib/utils/locale_handler';

	import StoryElement from './StoryElement.svelte';

	import { T, useTask, useThrelte } from '@threlte/core';
	import { Color } from 'three';

	// import type { Vector2Tuple } from 'three';
	import {
		useCursor,
		interactivity,
		Instance,
		InstancedMesh,
		OrbitControls,
		CameraControls,
		type CameraControlsRef
	} from '@threlte/extras';

	// import { Spring } from 'svelte/motion';

	const storiesNumber = 1000;

	const startColor = new Color('blue');
	const endColor = new Color('yellow');

	const instances: StoryElement[] = [];

	let radius: number = 20;

	for (let i = 0; i < storiesNumber; i += 1) {
		let r = Math.random() * radius;
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
				c * vx * radius,
				c * vy * radius,
				c * vz * radius
			)
		);
	}

	// const { size } = useThrelte();
	// const zoom = $derived($size.width / 1.5);

	interactivity({
		filter(items) {
			// only report the first intersection
			return items.slice(0, 1);
		}
	});

	// const boxPosition = new Spring<Vector2Tuple>([0, 0]);
	// const random = () => 10 * Math.random() - 5;
	// const scale = new Spring(1);
	// const boxSize = 1;
	// const positionY = $derived(0.5 * boxSize * scale.current);

	// const { onPointerEnter, onPointerLeave } = useCursor();

	let {
		controls = $bindable()
	}: {
		controls?: CameraControlsRef;
	} = $props();
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 50]}>
	<OrbitControls autoRotate autoRotateSpeed={0.1} />
	<CameraControls bind:ref={controls} />
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
