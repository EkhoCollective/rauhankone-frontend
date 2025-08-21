<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import StoryInstance from '$lib/components/visual-module/StoryInstance.svelte';
	import * as THREE from 'three';
	import {
		Mesh,
		BoxGeometry,
		SphereGeometry,
		MeshBasicMaterial,
		CatmullRomCurve3,
		BufferGeometry,
		Vector3,
		Color
	} from 'three';
	// import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
	// import { FontLoader, type Font } from 'three/addons/loaders/FontLoader.js';
	import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
	import { SimplexNoise } from 'three/examples/jsm/Addons.js';
	import { T, useTask, useThrelte } from '@threlte/core';
	import {
		interactivity,
		Instance,
		InstancedMeshes,
		CameraControls,
		type CameraControlsRef,
		Text3DGeometry,
		PerfMonitor,
		FakeGlowMaterial,
		MeshLineGeometry,
		MeshLineMaterial
	} from '@threlte/extras';
	import { Attractor, Collider, RigidBody, World } from '@threlte/rapier';
	// TODO: Implement cluster sounds with new audio system if needed
	// import { tracklist } from '$lib/components/media/audio/tracklist';
	import { useAudio } from '$lib/composables/useAudio';

	const { playBlip, playClusterSound } = useAudio();

	// Props
	let {
		data,
		selectedStory = $bindable(),
		controls = $bindable(),
		onNavigateToStory,
		navigateToClosestStory = $bindable(),
		navigateToFurthestStory = $bindable()
	}: {
		data: any;
		selectedStory: any;
		controls?: CameraControlsRef;
		onNavigateToStory?: (story: any) => void;
		navigateToClosestStory?: () => void;
		navigateToFurthestStory?: () => void;
	} = $props();

	// State
	const worldScale: number = 20;
	const minSphereScale: number = 1;
	const minMapScale: number = 0.1;
	const maxMapScale: number = 1.5;
	const sphereResolution: number = 12;
	const cameraOffset: number = 10;
	const centroidCameraOffset: number = 40;
	let centroid = $state(new THREE.Vector3());
	let instances: StoryInstance[] = $state([]);

	const clusterSpread: number = 4;
	const lineThickness: number = 0.035;
	const pointSize: number = 0.025;
	const curviness: number = 0.35;
	const pointCloudShrink: number = 0.5;

	// Jiggle movement variables
	const storyJiggleIntensity: number = 0.02; // How much stories move
	const pointJiggleIntensity: number = 0.1; // How much points move
	const jiggleSpeed: number = 0.001; // Speed of the jiggle animation
	const pointJiggleTime: number = 1000; // Speed of the jiggle animation
	const storyJiggleTime: number = 250; // Speed of the jiggle animation

	let noise = new SimplexNoise();
	let time = $state(0);

	const meshes = [
		new Mesh(
			new SphereGeometry(1, sphereResolution, sphereResolution),
			new MeshBasicMaterial({ color: 'white', toneMapped: false, transparent: true, opacity: 0.1 })
		) // MeshA - main sphere
	];

	// Interactivity
	interactivity({
		filter(items) {
			// only report the first intersection
			return items.slice(0, 1);
		}
	});

	// Helper function to get random song for cluster
	function getRandomSongForCluster(): string {
		// TODO: Implement with new audio system if cluster sounds are needed
		// const clusterTracks = tracklist.filter((track) => track.type === 'cluster');
		// const randomIndex = Math.floor(Math.random() * clusterTracks.length);
		// return clusterTracks[randomIndex].title;
		return 'placeholder';
	}

	// Function to map text length to a range from 1 to 5
	function mapTextLengthToRange(textLength: number): number {
		// Define the expected range of text lengths (you may need to adjust these based on your data)
		const minRange = minMapScale;
		const maxRange = maxMapScale;
		const minTextLength = 0;
		const maxTextLength = 1000; // Adjust this based on your typical text lengths

		// Clamp the text length to the expected range
		const clampedLength = Math.max(minTextLength, Math.min(maxTextLength, textLength));

		// Map from [minTextLength, maxTextLength] to [1, 5]
		const mappedLength =
			minRange +
			((clampedLength - minTextLength) / (maxTextLength - minTextLength)) * (maxRange - minRange);

		return mappedLength;
	}

	// Function to create character instances from input text
	function createTextInstances(inputText: string, scale: number, storyPosition: Vector3) {
		const textInstances: any[] = [];

		// Convert text to array of characters
		const characters = inputText.split('');

		// Define spherical distribution parameters
		const minRadius = scale * 0.85; // Minimum distance from story center
		const maxRadius = scale; // Maximum distance from story center

		// Create an instance for each character with spherical distribution
		characters.forEach((char, index) => {
			// Generate random spherical coordinates
			const radius = minRadius + Math.random() * (maxRadius - minRadius);
			const theta = Math.random() * Math.PI * 2; // Azimuthal angle (0 to 2π)
			const phi = Math.acos(2 * Math.random() - 1); // Polar angle (0 to π) - uniform distribution

			// Convert spherical to cartesian coordinates
			const x = radius * Math.sin(phi) * Math.cos(theta);
			const y = radius * Math.sin(phi) * Math.sin(theta);
			const z = radius * Math.cos(phi);

			textInstances.push(
				new Vector3(storyPosition.x + x, storyPosition.y + y, storyPosition.z + z)
			);
		});

		return textInstances;
	}

	function populateFromData() {
		if (!data || !data.clusters) return;

		// Clear existing instances to avoid duplicates
		instances.length = 0;

		for (let i = 0; i < data.clusters.length; i += 1) {
			const cluster = data.clusters[i];
			const cluster_audio_id = getRandomSongForCluster();

			// Get the color of the cluster
			const initialColor = new Color(Math.random(), Math.random(), Math.random());
			const selectedColor = new Color('white');

			// let clusterNoise = noise.noise3d(i, 0, 0);
			// console.log(clusterNoise);

			// Generate random offsets for each story (to be reused consistently)
			const storyOffsets: { x: number; y: number; z: number }[] = [];
			for (let j = 0; j < cluster.stories.length; j += 1) {
				storyOffsets.push({
					x: (Math.random() - 0.5) * clusterSpread,
					y: (Math.random() - 0.5) * clusterSpread,
					z: (Math.random() - 0.5) * clusterSpread
				});
			}

			// Only create curves if there are multiple stories in the cluster
			let allStoryPositions: Vector3[] = [];
			if (cluster.stories.length > 1) {
				// Collect all story positions in this cluster WITH the same random offsets
				for (let j = 0; j < cluster.stories.length; j += 1) {
					const story = cluster.stories[j];
					const offset = storyOffsets[j];

					const storyPos = new Vector3(
						story[0].coordinates[0] * worldScale + offset.x,
						story[0].coordinates[1] * worldScale + offset.y,
						story[0].coordinates[2] * worldScale + offset.z
					);
					allStoryPositions.push(storyPos);
				}
			}

			for (let j = 0; j < cluster.stories.length; j += 1) {
				const story = cluster.stories[j];
				const text_length = story[0].text.length;
				const scale = minSphereScale + mapTextLengthToRange(text_length);
				const cluster_id = cluster.text;
				const storyObject = story;

				// Use the same offset that was generated earlier for this story
				const offset = storyOffsets[j];

				// Get coordinates from the first variant of the story
				let story_positions = {
					x: story[0].coordinates[0] * worldScale + offset.x,
					y: story[0].coordinates[1] * worldScale + offset.y,
					z: story[0].coordinates[2] * worldScale + offset.z
				};
				let story_velocities = {
					vx: (Math.random() - 0.5) * 0.1,
					vy: (Math.random() - 0.5) * 0.1,
					vz: (Math.random() - 0.5) * 0.1
				};

				let text_instances = createTextInstances(
					story[0].text,
					scale,
					new Vector3(story_positions.x, story_positions.y, story_positions.z)
				);

				// Create pairs: each story connects to every other story individually
				let storyPairCurves: Vector3[][] = [];
				if (allStoryPositions.length > 1) {
					// Current story position
					const currentStoryPos = new Vector3(
						story_positions.x,
						story_positions.y,
						story_positions.z
					);

					//
					// console.log(currentStoryPos);

					// Create a separate curve for each pair (current story to each other story)
					for (let k = 0; k < allStoryPositions.length; k += 1) {
						if (k !== j) {
							// Skip the current story's position
							// Create pair: [current story, other story]
							const startPos = currentStoryPos;
							const endPos = allStoryPositions[k];

							// Calculate distance between the two points
							const distance = startPos.distanceTo(endPos);
							const offsetAmount = distance * curviness; // 25% of the distance

							// Create midpoint at 50% between the two points
							const midPoint = startPos.clone().lerp(endPos, 0.5);

							// Randomly choose x, y, or z axis for offset and direction (up/down)
							const randomAxis = Math.floor(Math.random() * 3);
							const randomDirection = Math.random() < 0.5 ? -1 : 1;

							// Apply offset to the chosen axis
							switch (randomAxis) {
								case 0:
									midPoint.x += offsetAmount * randomDirection;
									break;
								case 1:
									midPoint.y += offsetAmount * randomDirection;
									break;
								case 2:
									midPoint.z += offsetAmount * randomDirection;
									break;
							}

							// Create curve with the offset midpoint
							const pairPositions = [startPos, midPoint, endPos];
							const pairCurve = new CatmullRomCurve3(pairPositions);
							const pairPoints = pairCurve.getPoints(100);
							storyPairCurves.push(pairPoints);
						}
					}
				}

				instances.push(
					new StoryInstance(
						initialColor,
						selectedColor,
						scale,
						cluster_id,
						cluster_audio_id,
						storyObject,
						text_length,
						text_instances,
						storyPairCurves, // Pass the array of pair curves
						story_positions,
						story_velocities
					)
				);
			}
		}
		centroid = calculateCentroid();
		lookAtCentroid();
	}

	// Calculate centroid
	function calculateCentroid() {
		const centroidValue = new THREE.Vector3();
		for (let i = 0; i < instances.length; i++) {
			centroidValue.add(instances[i].positions);
		}
		centroidValue.divideScalar(instances.length);
		return centroidValue;
	}

	// Look at centroid
	function lookAtCentroid() {
		controls?.setLookAt(
			centroid.x,
			centroid.y,
			centroid.z + centroidCameraOffset,
			centroid.x,
			centroid.y,
			centroid.z,
			true
		);
	}

	// Navigate to closest story
	function navigateToClosest() {
		if (selectedStory && selectedStory.closestStory) {
			navigateToStory(selectedStory.closestStory);
		}
	}

	// Navigate to furthest story
	function navigateToFurthest() {
		if (selectedStory && selectedStory.furthestStory) {
			navigateToStory(selectedStory.furthestStory);
		}
	}

	// Navigate to a specific story with camera transition
	function navigateToStory(targetStory: any) {
		if (!targetStory || !controls) return;

		// Reset all instances' selected state
		instances.forEach((inst) => (inst.selected = false));

		// Set target story as selected
		targetStory.selected = true;
		targetStory.tw.set(1);

		// Calculate distances for the new selected story
		targetStory.calculateNearestAndFurthest(instances);

		// Move camera to target story with smooth transition
		controls.setLookAt(
			targetStory.positions.x,
			targetStory.positions.y,
			targetStory.positions.z + cameraOffset,
			targetStory.positions.x,
			targetStory.positions.y,
			targetStory.positions.z,
			true
		);

		// TODO: Play cluster sound effect with new audio system
		// soundEffects.playEffect(targetStory.cluster_audio_id);

		// Update selected story (this will trigger modal to update)
		selectedStory = targetStory;

		// Call external navigation callback if provided
		if (onNavigateToStory) {
			onNavigateToStory(targetStory);
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

		// TODO: Preload cluster sounds with new audio system if needed
		// const clusterSounds = tracklist
		// 	.filter((track) => track.type === 'cluster')
		// 	.map((track) => track.title);
		// soundEffects.preloadSounds(clusterSounds);
	});

	onDestroy(() => {
		// TODO: Clean up audio resources with new audio system if needed
		// soundEffects.clearCache();
	});

	// Bind navigation functions to be accessible from parent
	navigateToClosestStory = navigateToClosest;
	navigateToFurthestStory = navigateToFurthest;

	// Animation loop for jiggle movement
	useTask((delta) => {
		time += delta * jiggleSpeed;

		// Update story positions with SimplexNoise jiggle
		instances.forEach((instance, index) => {
			// Use different noise seeds for each instance and axis
			const noiseOffsetX =
				noise.noise3d(index * 100, time * storyJiggleTime, 0) * storyJiggleIntensity;
			const noiseOffsetY =
				noise.noise3d(index * 100, time * storyJiggleTime, 100) * storyJiggleIntensity;
			const noiseOffsetZ =
				noise.noise3d(index * 100, time * storyJiggleTime, 200) * storyJiggleIntensity;

			// Store original positions if not already stored
			if (!instance.originalPositions) {
				instance.originalPositions = {
					x: instance.positions.x,
					y: instance.positions.y,
					z: instance.positions.z
				};
			}

			// Apply jiggle to positions
			instance.positions.x = instance.originalPositions.x + noiseOffsetX;
			instance.positions.y = instance.originalPositions.y + noiseOffsetY;
			instance.positions.z = instance.originalPositions.z + noiseOffsetZ;

			// Generate random jiggle for text points
			if (instance.text_instances && instance.text_instances.length > 0) {
				instance.text_instances.forEach((point, pointIndex) => {
					// Store original positions if not already stored
					if (!point.originalPosition) {
						point.originalPosition = point.clone();
					}

					// Apply random jiggle to each point
					const randomOffsetX =
						noise.noise3d(
							pointIndex * 100,
							time * pointJiggleTime * mapTextLengthToRange(instance.text_instances.length),
							0
						) * pointJiggleIntensity;
					const randomOffsetY =
						noise.noise3d(
							pointIndex * 100,
							time * pointJiggleTime * mapTextLengthToRange(instance.text_instances.length),
							100
						) * pointJiggleIntensity;
					const randomOffsetZ =
						noise.noise3d(
							pointIndex * 100,
							time * pointJiggleTime * mapTextLengthToRange(instance.text_instances.length),
							200
						) * pointJiggleIntensity;

					point.x = point.originalPosition.x + randomOffsetX;
					point.y = point.originalPosition.y + randomOffsetY;
					point.z = point.originalPosition.z + randomOffsetZ;
				});
			}
		});
	});

	// $inspect(time);
</script>

<PerfMonitor anchorY="bottom" />

<T.PerspectiveCamera makeDefault position={[10, 0, 0]}>
	<CameraControls bind:ref={controls} />
</T.PerspectiveCamera>

<!-- Centroid -->
<T.Mesh position={[centroid.x, centroid.y, centroid.z]}>
	<T.BoxGeometry />
	<T.MeshBasicMaterial color="red" />
</T.Mesh>

<InstancedMeshes {meshes}>
	{#snippet children({ components: [MeshA, MeshB, MeshC, MeshD] })}
		{#each instances as instance}
			<MeshA
				position.y={instance.positions.y}
				position.x={instance.positions.x}
				position.z={instance.positions.z}
				scale={instance.scale}
				onclick={() => {
					// Reset all other instances' selected state
					instances.forEach((inst) => (inst.selected = false));
					// Set this instance as selected and keep it highlighted
					instance.selected = true;
					instance.tw.set(1);

					// Calculate nearest and furthest stories for this instance
					instance.calculateNearestAndFurthest(instances);

					selectedStory = instance;

					// Play blip sound for UI interaction
					playBlip();
					// Play cluster-specific sound for the story
					playClusterSound(instance.cluster_id);

					// Center camera on the selected story
					if (controls) {
						// Move camera to look at the story with smooth transition
						controls.setLookAt(
							instance.positions.x,
							instance.positions.y,
							instance.positions.z + cameraOffset, // Camera position (offset from story)
							instance.positions.x,
							instance.positions.y,
							instance.positions.z, // Look at the story position
							true // Enable smooth transition
						);
					}
					// TODO: Play cluster sound effect with new audio system
					// soundEffects.playEffect(instance.cluster_audio_id);
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
				<T.Mesh>
					<T.SphereGeometry args={[instance.scale * 0.375]} />
					<FakeGlowMaterial glowColor="white" toneMapped={false} opacity={0.5} />
				</T.Mesh>
			</MeshA>

			<!-- Lines outside of MeshA so they don't get scaled/moved on hover -->
			{#if instance.curve && instance.curve.length > 0 && instance.tw.current > 0}
				{#each instance.curve as pairCurvePoints}
					<T.Mesh>
						<MeshLineGeometry points={pairCurvePoints} />
						<MeshLineMaterial color="white" width={lineThickness} />
					</T.Mesh>
				{/each}
			{/if}

			<!-- Text instance points - outside MeshA for proper radial scaling
			{#if instance.text_instances && instance.text_instances.length > 0}
				<T.Points>
					{@const scaledPoints = instance.text_instances.map((point) => {
						// Calculate direction vector from sphere center to point
						const direction = point
							.clone()
							.sub(new Vector3(instance.positions.x, instance.positions.y, instance.positions.z));
						// Scale the direction vector based on tween value and add back to center
						const scaleFactor = 1 - instance.tw.current * pointCloudShrink; // Scale from 0.5 to 1.0
						return new Vector3(
							instance.positions.x,
							instance.positions.y,
							instance.positions.z
						).add(direction.multiplyScalar(scaleFactor));
					})}
					{@const geometry = new BufferGeometry().setFromPoints(scaledPoints)}
					<T is={geometry} />
					<T.PointsMaterial size={pointSize} color="white" />
				</T.Points>
			{/if} -->
		{/each}
	{/snippet}
</InstancedMeshes>
