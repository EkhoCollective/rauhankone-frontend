<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import StoryInstance from '$lib/components/visual-module/instances/StoryInstance.svelte';
	import * as THREE from 'three';
	import { Mesh, SphereGeometry, MeshBasicMaterial, CatmullRomCurve3, Vector3, Color } from 'three';
	// import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
	// import { FontLoader, type Font } from 'three/addons/loaders/FontLoader.js';
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
	import { tracklist } from '$lib/components/media/audio/tracklist';
	import { soundEffects } from '$lib/utils/soundEffects';

	// Props
	let {
		data,
		selectedStory = $bindable(),
		controls = $bindable()
	}: {
		data: any;
		selectedStory: any;
		controls?: CameraControlsRef;
	} = $props();

	// State
	const worldScale: number = 10;
	const minSphereScale: number = 1;
	const minMapScale: number = 0.1;
	const maxMapScale: number = 0.5;
	const sphereResolution: number = 16;
	const centroidCameraOffset: number = 15;
	let centroid = $state(new THREE.Vector3());
	let instances: StoryInstance[] = $state([]);

	let noise = new SimplexNoise();

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
		const clusterTracks = tracklist.filter((track) => track.type === 'cluster');
		const randomIndex = Math.floor(Math.random() * clusterTracks.length);
		return clusterTracks[randomIndex].title;
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
	function createTextInstances(inputText: string, storyPosition: Vector3) {
		const textInstances: any[] = [];

		// Convert text to array of characters
		const characters = inputText.split('');

		// Create an instance for each character
		characters.forEach((char, index) => {
			textInstances.push({
				char: char,
				position: [
					storyPosition.x + (Math.random() - 0.5) * 2,
					storyPosition.y + (Math.random() - 0.5) * 2,
					storyPosition.z + (Math.random() - 0.5) * 2
				]
			});
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

			// Only create curves if there are multiple stories in the cluster
			let allStoryPositions: Vector3[] = [];
			if (cluster.stories.length > 1) {
				// Collect all story positions in this cluster
				for (let j = 0; j < cluster.stories.length; j += 1) {
					const story = cluster.stories[j];
					const storyPos = new Vector3(
						story[0].coordinates[0] * worldScale,
						story[0].coordinates[1] * worldScale,
						story[0].coordinates[2] * worldScale
					);
					allStoryPositions.push(storyPos);
				}
			}

			console.log(allStoryPositions);

			// Create curve from cluster positions (need at least 2 points)
			// let points: Vector3[] = [];
			// if (clusterPositions.length >= 2) {
			// 	// If only 2 points, add intermediate points for better curve
			// 	if (clusterPositions.length === 2) {
			// 		const midPoint = clusterPositions[0].clone().lerp(clusterPositions[1], 0.5);
			// 		const curve = new CatmullRomCurve3([clusterPositions[0], midPoint, clusterPositions[1]]);
			// 		points = curve.getPoints(100);
			// 	} else {
			// 		const curve = new CatmullRomCurve3(clusterPositions);
			// 		points = curve.getPoints(100);
			// 	}
			// }

			for (let j = 0; j < cluster.stories.length; j += 1) {
				const story = cluster.stories[j];
				const text_length = story[0].text.length;
				const scale = minSphereScale + mapTextLengthToRange(text_length);
				const cluster_id = cluster.text;
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

				let text_instances = createTextInstances(
					story[0].text,
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

					// Create a separate curve for each pair (current story to each other story)
					for (let k = 0; k < allStoryPositions.length; k += 1) {
						if (k !== j) {
							// Skip the current story's position
							// Create pair: [current story, other story]
							const pairPositions = [currentStoryPos, allStoryPositions[k]];
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

		// Preload all cluster sounds
		const clusterSounds = tracklist
			.filter((track) => track.type === 'cluster')
			.map((track) => track.title);
		soundEffects.preloadSounds(clusterSounds);
	});

	onDestroy(() => {
		// Clean up sound cache when component is destroyed
		soundEffects.clearCache();
	});

	// $inspect(instances[0]);
</script>

<PerfMonitor anchorY="bottom" />

<T.PerspectiveCamera makeDefault position={[10, 0, 0]}>
	<CameraControls bind:ref={controls} />
</T.PerspectiveCamera>

<!-- Centroid -->
<!-- <T.Mesh position={[centroid.x, centroid.y, centroid.z]}>
	<T.BoxGeometry />
	<T.MeshBasicMaterial color="red" />
</T.Mesh> -->

<!-- <World gravity={[0, 0, 0]}> -->
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
				<T.Mesh>
					<T.SphereGeometry args={[instance.scale * 0.375]} />
					<FakeGlowMaterial glowColor="white" toneMapped={false} opacity={0.5} />
				</T.Mesh>

				{#if instance.curve && instance.curve.length > 0}
					{#each instance.curve as pairCurvePoints}
						<T.Mesh>
							<MeshLineGeometry points={pairCurvePoints} />
							<MeshLineMaterial color="white" width={0.1} />
						</T.Mesh>
					{/each}
				{/if}
			</MeshA>
		{/each}
	{/snippet}
</InstancedMeshes>
<!-- </World> -->

<!-- <World gravity={[0, 0, 0]}>
<InstancedMesh {instances} range={instances.length}>
	<T.Mesh>
	<T.SphereGeometry />
	<T.MeshBasicMaterial color="white" toneMapped={false} />

	</T.Mesh>
	{#each instances as instance}
		<T.Mesh position={[instance.positions.x, instance.positions.y, instance.positions.z]}>
			<T.SphereGeometry args={[instance.scale, sphereResolution, sphereResolution]} />
			<T.MeshBasicMaterial color="white" toneMapped={false} />
		</T.Mesh>
		<T.Mesh position={[instance.positions.x, instance.positions.y, instance.positions.z]}>
			<T.SphereGeometry args={[instance.scale * 2, sphereResolution, sphereResolution]} />
			<FakeGlowMaterial glowColor="white" toneMapped={false} glowInternalRadius={5} />
		</T.Mesh>
		<T.Mesh position={[instance.positions.x, instance.positions.y, instance.positions.z]}>
			<T.SphereGeometry args={[instance.scale * 10, sphereResolution, sphereResolution]} />
			<FakeGlowMaterial glowColor="#404040" opacity={0.01} />
		</T.Mesh>

		<Instance
			position.x={instance.positions.x}
			position.y={instance.positions.y}
			position.z={instance.positions.z}
			scale={instance.scale}
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
		/>
		<Attractor
					range={50}
					strength={5}
					position={[
						instance.positions.x + (Math.random() - 0.5) * 0.001,
						instance.positions.y + (Math.random() - 0.5) * 0.001,
						instance.positions.z + (Math.random() - 0.5) * 0.001
					]}
				/>
				<Attractor
					range={6}
					strength={-5}
					position={[
						instance.positions.x + (Math.random() - 0.5) * 0.001,
						instance.positions.y + (Math.random() - 0.5) * 0.001,
						instance.positions.z + (Math.random() - 0.5) * 0.001
					]}
				/>
				<Collider shape="ball" args={[5]} mass={Infinity} />
		<T.Mesh>
					<T.SphereGeometry args={[instance.scale, sphereResolution, sphereResolution]} />
					<T.MeshBasicMaterial color="white" toneMapped={false} />
				</T.Mesh>
		<T.Mesh>
					<T.SphereGeometry args={[instance.scale * 2, sphereResolution, sphereResolution]} />
					<FakeGlowMaterial glowColor="white" toneMapped={false} glowInternalRadius={5} />
				</T.Mesh>
				<T.Mesh>
					<T.SphereGeometry args={[instance.scale * 10, sphereResolution, sphereResolution]} />
					<FakeGlowMaterial glowColor="#404040" opacity={0.01} />
				</T.Mesh>
		{#if instance.text_instances && instance.text_instances.length > 0}
					<InstancedMesh instances={instance.text_instances} range={instance.text_instances.length}>
						{#each instance.text_instances as text_instance}
							{#if text_instance && text_instance.char && text_instance.position}
								<Instance>
									<RigidBody>
										<Collider shape="ball" args={[0.1]} mass={1} />
										<T.Mesh position={text_instance.position}>
											<Text3DGeometry text="a" size={0.25} depth={0.1} curveSegments={2} />
											<T.MeshBasicMaterial color="#ff0000" toneMapped={false} />
										</T.Mesh>
									</RigidBody>
								</Instance>
							{/if}
						{/each}
					</InstancedMesh>
				{/if}
		</Instance>
	{/each}
</InstancedMesh>
</World> -->
