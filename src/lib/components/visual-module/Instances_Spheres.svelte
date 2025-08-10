<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import StoryInstance from '$lib/components/visual-module/instances/StoryInstance.svelte';
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
	import { soundEffects, SOUND_EFFECTS } from '$lib/utils/soundEffects';

	// World parameters
	// let storiesNumber = $state(null);
	const worldRadius: number = 20;
	const worldScale: number = 10;
	// let clusters: ClusterInstance[] = $state([]);
	let instances: StoryInstance[] = $state([]);
	const startColor = new Color('dimgray');
	const endColor = new Color('white');

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

	function populateFromData() {
		if (!data || !data.clusters) return;

		// Clear existing instances to avoid duplicates
		instances.length = 0;

		for (let i = 0; i < data.clusters.length; i += 1) {
			const cluster = data.clusters[i];

			for (let j = 0; j < cluster.stories.length; j += 1) {
				const story = cluster.stories[j];

				const scale = 0.2 + story[0].text.length * 0.005;
				const cluster_id = cluster.text;
				const cluster_audio_id = 'test';
				const storyObject = story;

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
						story_positions,
						story_velocities,
						cluster_center
					)
				);
			}
		}
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

	$inspect(data);
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
