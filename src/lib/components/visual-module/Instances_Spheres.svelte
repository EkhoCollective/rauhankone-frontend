<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import StoryInstance from '$lib/components/visual-module/instances/StoryInstance.svelte';
	import * as THREE from 'three';
	import { SphereGeometry, Color } from 'three';
	import { SimplexNoise } from 'three/examples/jsm/Addons.js';
	import { T, useTask, useThrelte } from '@threlte/core';
	import {
		interactivity,
		Instance,
		InstancedMesh,
		CameraControls,
		type CameraControlsRef,
		FakeGlowMaterial
	} from '@threlte/extras';
	import { tracklist } from '$lib/components/media/audio/tracklist';
	import { soundEffects } from '$lib/utils/soundEffects';

	const worldScale: number = 10;
	let instances: StoryInstance[] = $state([]);
	const startColor = new Color('dimgray');
	const endColor = new Color('white');
	const centroidOffset: number = 25;
	let centroid = $state(new THREE.Vector3());

	let {
		data,
		selectedStory = $bindable(),
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

	// Helper function to get random cluster title
	function getRandomClusterTitle(): string {
		const clusterTracks = tracklist.filter((track) => track.type === 'cluster');
		const randomIndex = Math.floor(Math.random() * clusterTracks.length);
		return clusterTracks[randomIndex].title;
	}

	function createNoisySphereGeometry(
		size: number,
		resolution: number,
		seed: number,
		noiseScale: number,
		noiseStrength: number,
		clusterNoise: SimplexNoise
	) {
		const geometry = new SphereGeometry(size, resolution, resolution);
		const positions = geometry.getAttribute('position');
		const noise = clusterNoise;

		// Apply noise to each vertex with unique parameters
		// for (let i = 0; i < positions.count; i += 1) {
		// 	const x = positions.getX(i);
		// 	const y = positions.getY(i);
		// 	// const z = positions.getZ(i);

		// 	// // Create unique noise using seed offset
		// 	// const noiseValue = noise.noise3d(
		// 	// 	(x + seed) * noiseScale,
		// 	// 	(y + seed * 1.3) * noiseScale,
		// 	// 	(z + seed * 1.7) * noiseScale
		// 	// );

		// 	// // Calculate the original distance from center (radius)
		// 	// const originalRadius = Math.sqrt(x * x + y * y + z * z);

		// 	// // Apply noise to the radius
		// 	// const newRadius = originalRadius + noiseValue * noiseStrength;

		// 	// // Normalize the direction and apply the new radius
		// 	// const length = Math.sqrt(x * x + y * y + z * z);
		// 	// if (length > 0) {
		// 	// positions.setX(i, (x / length) * newRadius);
		// 	// positions.setY(i, (y / length) * newRadius);
		// 	// positions.setZ(i, (z / length) * newRadius);
		// 	// }
		// 	// positions.setX(i, noise.noise(x, y) * noiseStrength);
		// 	// positions.setY(i, noise.noise(x, y) * noiseStrength);
		// 	positions.setZ(i, noise.noise(x, y) * 10);
		// }

		positions.needsUpdate = true;
		// geometry.computeVertexNormals();
		return geometry;
	}

	function populateFromData() {
		if (!data || !data.clusters) return;

		// Clear existing instances to avoid duplicates
		instances.length = 0;

		for (let i = 0; i < data.clusters.length; i += 1) {
			const cluster = data.clusters[i];
			const cluster_audio_id = getRandomClusterTitle();

			const clusterNoiseScale = 0.1;
			const clusterNoiseStrength = 0.1;
			const clusterNoiseSeed = 16;
			const clusterNoiseResolution = 16;
			const clusterNoise = new SimplexNoise();

			for (let j = 0; j < cluster.stories.length; j += 1) {
				const story = cluster.stories[j];
				const text_length = story[0].text.length * 0.005;
				const scale = 1 + text_length;
				const cluster_id = cluster.text;
				const storyObject = story;

				const storyGeometry = createNoisySphereGeometry(
					text_length / 10,
					clusterNoiseResolution,
					clusterNoiseSeed,
					clusterNoiseScale,
					clusterNoiseStrength,
					clusterNoise
				);

				// Get coordinates from the first variant of the story
				let story_positions = {
					x: story[0].coordinates[0] * worldScale,
					y: story[0].coordinates[1] * worldScale,
					z: story[0].coordinates[2] * worldScale
				};
				let story_velocities = {
					vx: (Math.random() - 0.5) * 0.1,
					vy: (Math.random() - 0.5) * 0.1,
					vz: (Math.random() - 0.5) * 0.1
				};

				let cluster_center = {
					cx: cluster.som[0],
					cy: cluster.som[0],
					cz: cluster.som[0]
				};

				instances.push(
					new StoryInstance(
						startColor,
						endColor,
						scale,
						cluster_id,
						cluster_audio_id,
						storyObject,
						text_length,
						storyGeometry,
						story_positions,
						story_velocities,
						cluster_center
					)
				);
			}
		}
		centroid = calculateCentroid();
	}

	function calculateCentroid() {
		const centroidValue = new THREE.Vector3();
		for (let i = 0; i < instances.length; i++) {
			centroidValue.add(instances[i].positions);
		}
		centroidValue.divideScalar(instances.length);
		return centroidValue;
	}

	// Effect to reset selected sphere when modal closes
	$effect(() => {
		if (selectedStory === null) {
			// Modal closed, reset all selected states
			instances.forEach((instance) => {
				if (instance.selected) {
					instance.selected = false;
					instance.tw.set(0);
				}
			});
		}
	});

	$effect(() => {
		for (let i = 0; i < instances.length; i++) {
			instances[i].geometry.computeVertexNormals();
		}
	});

	onMount(() => {
		// Preload sound effects for better performance
		populateFromData();

		// Preload all cluster sounds
		const clusterSounds = tracklist
			.filter((track) => track.type === 'cluster')
			.map((track) => track.title);
		soundEffects.preloadSounds(clusterSounds);

		controls?.setLookAt(
			centroid.x,
			centroid.y,
			centroid.z + centroidOffset,
			centroid.x,
			centroid.y,
			centroid.z,
			true
		);
	});

	onDestroy(() => {
		// Clean up sound cache when component is destroyed
		soundEffects.clearCache();
	});

	$inspect(centroid, data);
</script>

<!-- Only orbit or camera but not both because they control the same camera -->
<T.PerspectiveCamera makeDefault position={[50, 20, 50]}>
	<CameraControls bind:ref={controls} />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.4} />
<T.DirectionalLight position={[1, 2, 5]} />

<!-- Centroid -->
<!-- <T.Mesh position={[centroid.x, centroid.y, centroid.z]}>
	<T.BoxGeometry />
	<T.MeshBasicMaterial color="red" />
</T.Mesh> -->

<InstancedMesh {instances} range={instances.length}>
	<T.MeshBasicMaterial />
	<FakeGlowMaterial glowColor="red" />

	{#each instances as instance}
		<Instance
			position.x={instance.positions.x}
			position.y={instance.positions.y}
			position.z={instance.positions.z}
			scale={instance.scale}
			color={instance.color}
			onclick={() => {
				// Reset all other instances' selected state
				instances.forEach((inst) => (inst.selected = false));
				// Set this instance as selected and keep it highlighted
				instance.selected = true;
				instance.tw.set(1);
				selectedStory = instance;

				// Center camera on the selected story
				if (controls) {
					// Move camera to look at the story with smooth transition
					controls.setLookAt(
						instance.positions.x,
						instance.positions.y,
						instance.positions.z + 20, // Camera position (offset from story)
						instance.positions.x,
						instance.positions.y,
						instance.positions.z, // Look at the story position
						true // Enable smooth transition
					);
				}

				// Play sound effect when modal opens using cluster-specific sound
				soundEffects.playEffect(instance.cluster_audio_id);
			}}
			onpointerenter={() => {
				// Only animate if not selected
				if (!instance.selected) {
					instance.tw.set(1);
				}
			}}
			onpointerleave={() => {
				// Only reset if not selected
				if (!instance.selected) {
					instance.tw.set(0);
				}
			}}
		>
			<T.Mesh geometry={instance.geometry} />
		</Instance>
	{/each}
</InstancedMesh>
