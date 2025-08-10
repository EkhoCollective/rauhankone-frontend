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
		type CameraControlsRef
	} from '@threlte/extras';
	import { tracklist } from '$lib/components/media/audio/tracklist';
	import { soundEffects, SOUND_EFFECTS } from '$lib/utils/soundEffects';

	// World parameters
	// let storiesNumber = $state(null);
	// const worldRadius: number = 20;
	const worldScale: number = 10;
	// let clusters: ClusterInstance[] = $state([]);
	let instances: StoryInstance[] = $state([]);
	const startColor = new Color('dimgray');
	const endColor = new Color('white');

	let centroid = $state(new THREE.Vector3());

	// const geometry = new SphereGeometry(10, 16, 16);

	// Flocking parameters
	// let maxSpeed = 0.05; // Increased for more visible movement
	// let maxForce = 0.02; // Increased for more visible movement
	// let cohesionWeight = 1.0;
	// let alignmentWeight = 1.0;
	// let separationWeight = 1.5;
	// let perceptionRadius = 3;
	// let separationDistance = 1;

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

	function populateFromData() {
		if (!data || !data.clusters) return;

		// Clear existing instances to avoid duplicates
		instances.length = 0;

		for (let i = 0; i < data.clusters.length; i += 1) {
			const cluster = data.clusters[i];
			const cluster_audio_id = getRandomClusterTitle();

			for (let j = 0; j < cluster.stories.length; j += 1) {
				const story = cluster.stories[j];
				const text_length = story[0].text.length * 0.005;
				const scale = 1;
				const cluster_id = cluster.text;
				const storyObject = story;

				// Calculate the scale of the sphere based on the text length
				let story_shape = {
					radius: 1,
					wSeg: Math.floor(Math.random() * 10) + 3,
					hSeg: Math.floor(Math.random() * 10) + 3
				};

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
						story_shape,
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
		return centroidValue.multiplyScalar(worldScale);
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

	onMount(() => {
		// Preload sound effects for better performance
		populateFromData();
		soundEffects.preloadSounds([SOUND_EFFECTS.MODAL_OPEN]);
	});

	onDestroy(() => {
		// Clean up sound cache when component is destroyed
		soundEffects.clearCache();
	});

	$inspect(centroid);
</script>

<T.PerspectiveCamera makeDefault position={[50, 20, 50]}>
	<CameraControls bind:ref={controls} setLookAt={centroid} />
	<!-- <OrbitControls autoRotate={true} autoRotateSpeed={10} /> -->
	<!-- Only orbit or camera but not both because they control the same camera -->
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.4} />
<T.DirectionalLight position={[1, 2, 5]} />

<InstancedMesh {instances} range={instances.length}>
	<!-- <T.SphereGeometry radius={instance.scale} /> -->
	<T.MeshToonMaterial />

	{#each instances as instance}
		<T.SphereGeometry args={[instance.shape.radius, instance.shape.wSeg, instance.shape.hSeg]} />
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

				// Play sound effect when modal opens
				soundEffects.playEffect(SOUND_EFFECTS.MODAL_OPEN);
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
		/>
	{/each}
</InstancedMesh>
