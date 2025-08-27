<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import StoryInstance from '$lib/components/visual-module/StoryInstance.svelte';
	import { getLocaleFullName } from '$lib/utils/locale_handler';
	import * as THREE from 'three';
	import {
		Mesh,
		SphereGeometry,
		MeshBasicMaterial,
		CatmullRomCurve3,
		BufferGeometry,
		Vector3,
		Color
	} from 'three';

	import { SimplexNoise } from 'three/examples/jsm/Addons.js';
	import { EffectComposer } from 'threlte-postprocessing';
	import { DepthOfFieldEffect, BloomEffect } from 'threlte-postprocessing/effects';
	import { T, useTask } from '@threlte/core';
	import {
		interactivity,
		InstancedMeshes,
		CameraControls,
		type CameraControlsRef,
		PerfMonitor,
		FakeGlowMaterial,
		MeshLineGeometry,
		MeshLineMaterial
	} from '@threlte/extras';
	import { useAudio } from '$lib/composables/useAudio';

	const { playBlip, playClusterSound } = useAudio();

	// Props
	let {
		data,
		selectedStory = $bindable(),
		isTranslated = $bindable(),
		currentLocale = $bindable(),
		controls = $bindable(),
		onNavigateToStory,
		navigateToClosestStory = $bindable(),
		navigateToFurthestStory = $bindable(),
		navigateToStoryProp = $bindable(),
		findStoryInstanceByStoryIdProp = $bindable()
	}: {
		data: any;
		selectedStory: any;
		isTranslated: boolean;
		currentLocale: string;
		controls?: CameraControlsRef;
		onNavigateToStory?: (story: any) => void;
		navigateToClosestStory?: () => void;
		navigateToFurthestStory?: () => void;
		navigateToStoryProp?: (story: any) => void;
		findStoryInstanceByStoryIdProp?: (storyId: string) => StoryInstance | null;
	} = $props();

	// State
	const worldScale: number = 20;
	const minSphereScale: number = 1;
	const minMapScale: number = 0.075;
	const maxMapScale: number = 1.5;
	const sphereResolution: number = 16;
	const cameraOffset: number = 10;
	const centroidCameraOffset: number = 40;
	let centroid = $state(new THREE.Vector3());
	let instances: StoryInstance[] = $state([]);
	let previousSelectedStory: StoryInstance | null = $state(null);

	const clusterSpread: number = 5;
	const lineThickness: number = 0.025;
	const pointSize: number = 0.05;
	const curviness: number = 0.35;
	const pointCloudShrink: number = 0.5;

	// Jiggle movement variables
	const storyJiggleIntensity: number = 0.25; // How much stories move
	const pointJiggleIntensity: number = 0.1; // How much points move
	const jiggleSpeed: number = 0.001; // Speed of the jiggle animation
	const pointJiggleTime: number = 1000; // Speed of the jiggle animation
	const storyJiggleTime: number = 250; // Speed of the jiggle animation

	// Curve animation variables
	const curveSpeed: number = 200; // Speed of curve animation
	const curveNoiseIntensity: number = 0.05; // Intensity of noise variation

	let noise = new SimplexNoise();
	let time = $state(0);

	const meshes = [
		new Mesh(
			new SphereGeometry(1, sphereResolution, sphereResolution),
			new MeshBasicMaterial({
				color: 'white',
				toneMapped: false,
				transparent: true,
				opacity: 0.002
			})
		) // MeshA - main sphere
	];

	// Interactivity
	interactivity({
		filter(items) {
			// only report the first intersection
			return items.slice(0, 1);
		}
	});
	// Simple optimization: reuse BufferGeometry instead of creating new ones
	const geometryCache = new Map<string, BufferGeometry>();

	// Function to get or create geometry for points
	function getPointGeometry(instance: StoryInstance): BufferGeometry {
		// Calculate scaled points
		const scaledPoints = instance.text_instances.map((point) => {
			// Calculate direction vector from sphere center to point
			const direction = point
				.clone()
				.sub(new Vector3(instance.positions.x, instance.positions.y, instance.positions.z));
			// Scale the direction vector based on tween value and add back to center
			// const scaleFactor = 1 - instance.tw.current * pointCloudShrink; // Scale from 0.5 to 1.0
			return new Vector3(instance.positions.x, instance.positions.y, instance.positions.z).add(
				direction.multiplyScalar(1)
			);
		});

		const cacheKey = `${instance.cluster_id}_${instance.positions.x}_${instance.positions.y}_${instance.positions.z}`;
		let geometry = geometryCache.get(cacheKey);

		if (!geometry) {
			geometry = new BufferGeometry();
			geometryCache.set(cacheKey, geometry);
		}

		geometry.setFromPoints(scaledPoints);
		return geometry;
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
		const minRadius = scale * 0.95; // Minimum distance from story center
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
			const cluster_audio_id = '';

			// Filter stories based on isTranslated flag and current language
			let filteredStories = cluster.stories;
			if (isTranslated) {
				const currentLanguage = getLocaleFullName();
				filteredStories = cluster.stories.filter((story: any) => {
					// Check if any story in the array matches the current language
					return story.some((storyVariant: any) => storyVariant?.language === currentLanguage);
				});

				// If we have matching stories, filter each story to only include the matching language variant
				if (filteredStories.length > 0) {
					filteredStories = filteredStories.map((story: any) => {
						const matchingVariant = story.find(
							(storyVariant: any) => storyVariant?.language === currentLanguage
						);
						return matchingVariant ? [matchingVariant] : story;
					});
				}
			}

			// Filter out any stories that don't have valid coordinates in the first element
			filteredStories = filteredStories.filter((story: any) => {
				return story && story.length > 0 && story[0] && story[0].coordinates;
			});

			// Get the color of the cluster
			const initialColor = new Color(Math.random(), Math.random(), Math.random());
			const selectedColor = new Color('white');

			// Generate random offsets for each story (to be reused consistently)
			const storyOffsets: { x: number; y: number; z: number }[] = [];
			for (let j = 0; j < filteredStories.length; j += 1) {
				storyOffsets.push({
					x: (Math.random() - 0.5) * clusterSpread,
					y: (Math.random() - 0.5) * clusterSpread,
					z: (Math.random() - 0.5) * clusterSpread
				});
			}
			// Only create curves if there are multiple stories in the cluster
			let allStoryPositions: Vector3[] = [];
			if (filteredStories.length > 1) {
				// Collect all story positions in this cluster WITH the same random offsets
				for (let j = 0; j < filteredStories.length; j += 1) {
					const story = filteredStories[j];
					const offset = storyOffsets[j];

					const storyPos = new Vector3(
						story[0].coordinates[0] * worldScale + offset.x,
						story[0].coordinates[1] * worldScale + offset.y,
						story[0].coordinates[2] * worldScale + offset.z
					);
					allStoryPositions.push(storyPos);
				}
			}

			for (let j = 0; j < filteredStories.length; j += 1) {
				const story = filteredStories[j];
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

					// Create a separate curve for each pair (current story to each other story in the same cluster)
					for (let k = 0; k < allStoryPositions.length; k += 1) {
						if (k !== j) {
							// Skip the current story's position
							// Create pair: [current story, other story]
							const startPos = currentStoryPos;
							const endPos = allStoryPositions[k];

							// Calculate distance between the two points
							const distance = startPos.distanceTo(endPos);
							const offsetAmount = distance * curviness; // Initial curviness

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

				// Create the instance first
				const newInstance = new StoryInstance(
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
				);

				// Store curve metadata for animation
				newInstance.curveMetadata = [];
				if (allStoryPositions.length > 1) {
					const currentStoryPos = new Vector3(
						story_positions.x,
						story_positions.y,
						story_positions.z
					);

					for (let k = 0; k < allStoryPositions.length; k += 1) {
						if (k !== j) {
							const startPos = currentStoryPos;
							const endPos = allStoryPositions[k];
							const distance = startPos.distanceTo(endPos);
							const randomAxis = Math.floor(Math.random() * 3);
							const randomDirection = Math.random() < 0.5 ? -1 : 1;

							newInstance.curveMetadata.push({
								startPos: startPos,
								endPos: endPos,
								randomAxis: randomAxis,
								direction: randomDirection,
								distance: distance
							});
						}
					}
				}

				instances.push(newInstance);
			}
		}
		centroid = calculateCentroid();
		lookAtCentroid();
		// console.log(instances);
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

		// Update selected story (this will trigger modal to update)
		selectedStory = targetStory;

		// Call external navigation callback if provided
		if (onNavigateToStory) {
			onNavigateToStory(targetStory);
		}
	}

	// Effect to handle modal closing - show points for previous story
	$effect(() => {
		if (selectedStory === null) {
			// Modal closed, show points for the previous selected story
			if (previousSelectedStory) {
				previousSelectedStory.selected = true;
				previousSelectedStory.tw.set(1);
			}
		}
	});

	onMount(() => {
		// Preload sound effects for better performance
		populateFromData();
	});

	// Function to find StoryInstance by story ID
	function findStoryInstanceByStoryId(storyId: string): StoryInstance | null {
		for (const instance of instances) {
			// Check if any story in the instance's story array has the matching ID
			for (const storyElement of instance.story) {
				if (storyElement?.id === storyId) {
					return instance;
				}
			}
		}
		return null;
	}

	// Bind navigation functions to be accessible from parent
	navigateToClosestStory = navigateToClosest;
	navigateToFurthestStory = navigateToFurthest;
	navigateToStoryProp = navigateToStory;
	findStoryInstanceByStoryIdProp = findStoryInstanceByStoryId;

	// Animation loop for jiggle movement and curve animation
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

					// Add both the story's movement and the point's own jiggle
					point.x = point.originalPosition.x + randomOffsetX + noiseOffsetX;
					point.y = point.originalPosition.y + randomOffsetY + noiseOffsetY;
					point.z = point.originalPosition.z + randomOffsetZ + noiseOffsetZ;
				});
			}

			// Update curves with time-based curviness
			if (instance.curveMetadata && instance.curveMetadata.length > 0) {
				let storyPairCurves: Vector3[][] = [];

				// Update each curve using stored metadata
				instance.curveMetadata.forEach((metadata, curveIndex) => {
					const startPos = new Vector3(
						instance.positions.x,
						instance.positions.y,
						instance.positions.z
					);
					const endPos = metadata.endPos;

					// Calculate distance between the two points
					const distance = startPos.distanceTo(endPos);

					// Time-based curviness with sine function and noise
					const baseCurviness = curviness;
					const timeCurviness = Math.sin(time * curveSpeed + index * 100) * baseCurviness;
					const noiseCurviness =
						noise.noise3d(index * 50, curveIndex * 50, time * curveSpeed) * curveNoiseIntensity;
					const dynamicCurviness = timeCurviness + noiseCurviness;

					const offsetAmount = distance * dynamicCurviness;

					// Create midpoint at 50% between the two points
					const midPoint = startPos.clone().lerp(endPos, 0.5);

					// Apply offset to the stored axis and direction
					switch (metadata.randomAxis) {
						case 0:
							midPoint.x += offsetAmount * metadata.direction;
							break;
						case 1:
							midPoint.y += offsetAmount * metadata.direction;
							break;
						case 2:
							midPoint.z += offsetAmount * metadata.direction;
							break;
					}

					// Create curve with the updated midpoint
					const pairPositions = [startPos, midPoint, endPos];
					const pairCurve = new CatmullRomCurve3(pairPositions);
					const pairPoints = pairCurve.getPoints(100);
					storyPairCurves.push(pairPoints);
				});

				// Update the instance's curves
				instance.curve = storyPairCurves;
			}
		});
	});

	// Cleanup geometry cache on component destroy
	onDestroy(() => {
		geometryCache.forEach((geometry) => {
			geometry.dispose();
		});
		geometryCache.clear();
	});
</script>

<!-- <PerfMonitor anchorY="bottom" /> -->

<T.PerspectiveCamera makeDefault position={[10, 0, 0]}>
	<CameraControls bind:ref={controls} />
</T.PerspectiveCamera>

<!-- Centroid -->
<!-- <T.Mesh position={[centroid.x, centroid.y, centroid.z]}>
	<T.BoxGeometry />
	<T.MeshBasicMaterial color="red" />
</T.Mesh> -->

<EffectComposer>
	<DepthOfFieldEffect focusDistance={0} focalLength={0.15} bokehScale={5} height={512} />
	<BloomEffect luminanceThreshold={0.5} luminanceSmoothing={0.6} height={256} radius={0.75} />
	<!-- <NoiseEffect opacity={0.02} /> -->
	<!-- <VignetteEffect eskil={false} offset={0.1} darkness={1.1} /> -->

	<InstancedMeshes {meshes}>
		{#snippet children({ components: [MeshA, MeshB, MeshC, MeshD] })}
			{#each instances as instance}
				<MeshA
					position.y={instance.positions.y}
					position.x={instance.positions.x}
					position.z={instance.positions.z}
					scale={instance.scale}
					onclick={() => {
						// Store the previous selected story before changing
						if (selectedStory) {
							previousSelectedStory = selectedStory;
						}

						// Reset all other instances' selected state (including previous story)
						instances.forEach((inst) => {
							inst.selected = false;
							inst.tw.set(0);
						});

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
					<!-- <T.SphereGeometry /> -->
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

				<!-- Text instance points - outside MeshA for proper radial scaling -->
				{#if instance.text_instances && instance.text_instances.length > 0 && instance.selected}
					<T.Points>
						<T is={getPointGeometry(instance)} />
						<T.PointsMaterial size={pointSize} color="white" />
					</T.Points>
				{/if}
			{/each}
		{/snippet}
	</InstancedMeshes>
</EffectComposer>
