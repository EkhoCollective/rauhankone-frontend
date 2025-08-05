<script lang="ts">
	import { onMount } from 'svelte';
	// import { getLocaleFullName } from '$lib/utils/locale_handler';
	import StoryElement from '../StoryElementFlock.svelte';
	import * as THREE from 'three';
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

	// World parameters
	// let storiesNumber = $state(null);
	const worldRadius: number = 20;
	let instances: StoryElement[] = $state([]);
	const startColor = new Color('blue');
	const endColor = new Color('white');

	// Flocking parameters
	let maxSpeed = 0.05; // Increased for more visible movement
	let maxForce = 0.02; // Increased for more visible movement
	let cohesionWeight = 1.0;
	let alignmentWeight = 1.0;
	let separationWeight = 1.5;
	let perceptionRadius = 3;
	let separationDistance = 1;

	let {
		data,
		selectedStory,
		controls = $bindable()
	}: {
		data: any;
		selectedStory: any;
		controls?: CameraControlsRef;
	} = $props();

	interactivity({
		filter(items) {
			// only report the first intersection
			return items.slice(0, 1);
		}
	});

	// function populateSphere() {
	// 	for (let i = 0; i < storiesNumber; i += 1) {
	// 		let r = Math.random() * worldRadius;
	// 		let vx = Math.random() * 2 - 1;
	// 		let vy = Math.random() * 2 - 1;
	// 		let vz = Math.random() * 2 - 1;
	// 		const magnitude = Math.sqrt(vx * vx + vy * vy + vz * vz);

	// 		const scale = Math.random() + 0.1;

	// 		vx = vx / magnitude;
	// 		vy = vy / magnitude;
	// 		vz = vz / magnitude;

	// 		var c = Math.cbrt(r);

	// 		instances.push(
	// 			new StoryElement(
	// 				startColor,
	// 				endColor,
	// 				scale,
	// 				c * vx * worldRadius,
	// 				c * vy * worldRadius,
	// 				c * vz * worldRadius,
	// 				(Math.random() - 0.5) * 0.1,
	// 				(Math.random() - 0.5) * 0.1,
	// 				(Math.random() - 0.5) * 0.1
	// 			)
	// 		);
	// 	}
	// }

	function populateFromData() {
		for (let i = 0; i < data.clusters.length; i += 1) {
			const cluster = data.clusters[i];

			for (let j = 0; j < cluster.stories.length; j += 1) {}

			const cluster_id = cluster.id;
			const cluster_text = cluster.text;
			const cluster_x = cluster.x;
			const cluster_y = cluster.y;
			const cluster_z = cluster.z;
		}
	}

	// useTask(() => {
	// 	const positions = instances.map((instance) => [instance.x, instance.y, instance.z]);
	// 	const velocities = instances.map((instance) => [instance.vx, instance.vy, instance.vz]);

	// 	const boidCount = storiesNumber;
	// 	const bounds = worldRadius;

	// 	const currentPosition = new THREE.Vector3();
	// 	const otherPosition = new THREE.Vector3();
	// 	const velocity = new THREE.Vector3();

	// 	const separation = new THREE.Vector3();
	// 	const alignment = new THREE.Vector3();
	// 	const cohesion = new THREE.Vector3();
	// 	const acceleration = new THREE.Vector3();

	// 	for (let i = 0; i < boidCount; i++) {
	// 		const i3 = i * 3;
	// 		currentPosition.fromArray(positions[i]);
	// 		velocity.fromArray(velocities[i]);

	// 		separation.set(0, 0, 0);
	// 		alignment.set(0, 0, 0);
	// 		cohesion.set(0, 0, 0);
	// 		let perceptionCount = 0;

	// 		for (let j = 0; j < boidCount; j++) {
	// 			if (i === j) continue;

	// 			const j3 = j * 3;
	// 			otherPosition.fromArray(positions[j]);
	// 			const distance = currentPosition.distanceTo(otherPosition);

	// 			if (distance > 0 && distance < perceptionRadius) {
	// 				cohesion.add(otherPosition);
	// 				alignment.add(new THREE.Vector3().fromArray(velocities[j]));

	// 				if (distance < separationDistance) {
	// 					const diff = new THREE.Vector3().subVectors(currentPosition, otherPosition);
	// 					diff.divideScalar(distance * distance);
	// 					separation.add(diff);
	// 				}
	// 				perceptionCount++;
	// 			}
	// 		}

	// 		if (perceptionCount > 0) {
	// 			cohesion.divideScalar(perceptionCount);
	// 			cohesion.sub(currentPosition);
	// 			cohesion.normalize().multiplyScalar(maxSpeed);
	// 			cohesion.sub(velocity).clampLength(0, maxForce);

	// 			alignment.divideScalar(perceptionCount);
	// 			alignment.normalize().multiplyScalar(maxSpeed);
	// 			alignment.sub(velocity).clampLength(0, maxForce);

	// 			separation.divideScalar(perceptionCount);
	// 			separation.normalize().multiplyScalar(maxSpeed);
	// 			separation.sub(velocity).clampLength(0, maxForce);

	// 			acceleration
	// 				.add(cohesion.multiplyScalar(cohesionWeight))
	// 				.add(alignment.multiplyScalar(alignmentWeight))
	// 				.add(separation.multiplyScalar(separationWeight));
	// 		}

	// 		velocity.add(acceleration);
	// 		velocity.clampLength(-maxSpeed, maxSpeed);
	// 		velocity.toArray(velocities[i]);

	// 		currentPosition.add(velocity);
	// 		currentPosition.toArray(positions[i]);

	// 		if (currentPosition.x > bounds) positions[i][0] = -bounds;
	// 		if (currentPosition.x < -bounds) positions[i][0] = bounds;
	// 		if (currentPosition.y > bounds) positions[i][1] = -bounds;
	// 		if (currentPosition.y < -bounds) positions[i][1] = bounds;
	// 		if (currentPosition.z > bounds) positions[i][2] = -bounds;
	// 		if (currentPosition.z < -bounds) positions[i][2] = bounds;

	// 		acceleration.set(0, 0, 0);
	// 	}

	// 	// Apply the updated positions and velocities back to the instances
	// 	for (let i = 0; i < boidCount; i++) {
	// 		instances[i].x = positions[i][0];
	// 		instances[i].y = positions[i][1];
	// 		instances[i].z = positions[i][2];
	// 		instances[i].vx = velocities[i][0];
	// 		instances[i].vy = velocities[i][1];
	// 		instances[i].vz = velocities[i][2];
	// 	}

	// 	// // Debug: Log first instance position every 60 frames (roughly once per second)
	// 	// if (Math.floor(Date.now() / 16) % 60 === 0) {
	// 	// 	console.log(
	// 	// 		'Boid 0 position:',
	// 	// 		instances[0].x.toFixed(2),
	// 	// 		instances[0].y.toFixed(2),
	// 	// 		instances[0].z.toFixed(2)
	// 	// 	);
	// 	// }
	// });

	onMount(() => {
		console.log(data);
		populateFromData();
	});
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 50]}>
	<CameraControls bind:ref={controls} />
	<!-- <OrbitControls autoRotate={true} autoRotateSpeed={10} /> -->
	<!-- Only orbit or camera but not both because they control the same camera -->
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.4} />
<T.DirectionalLight position={[1, 2, 5]} />

<InstancedMesh {instances} range={instances.length}>
	<T.SphereGeometry />
	<T.MeshToonMaterial />

	{#each instances as instance}
		<Instance
			position.x={instance.x}
			position.y={instance.y}
			position.z={instance.z}
			scale={instance.scale}
			color={instance.color}
			onclick={() => {
				console.log(instance.x, instance.y, instance.z);
			}}
			onpointerenter={() => {
				instance.tw.set(1);
			}}
			onpointerleave={() => {
				instance.tw.set(0);
			}}
		/>
	{/each}
</InstancedMesh>
