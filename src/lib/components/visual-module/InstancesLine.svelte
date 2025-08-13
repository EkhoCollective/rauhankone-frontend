<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import StoryInstance from '$lib/components/visual-module/instances/StoryInstance.svelte';
	import * as THREE from 'three';
	import { CatmullRomCurve3, Vector3, Color } from 'three';
	import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
	import { FontLoader, type Font } from 'three/addons/loaders/FontLoader.js';
	// import { SimplexNoise } from 'three/examples/jsm/Addons.js';
	import { T, useTask, useThrelte } from '@threlte/core';
	import {
		interactivity,
		Instance,
		InstancedMesh,
		CameraControls,
		type CameraControlsRef,
		Text3DGeometry,
		PerfMonitor,
		FakeGlowMaterial,
		MeshLineGeometry,
		MeshLineMaterial,
		BakeShadows
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
	let instances: StoryInstance[] = $state([]);
	const centroidOffset: number = 15;
	let centroid = $state(new THREE.Vector3());

	// Interactivity
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

			// Get the color of the cluster
			const initialColor = new Color(Math.random(), Math.random(), Math.random());
			const selectedColor = new Color('white');

			for (let j = 0; j < cluster.stories.length; j += 1) {
				const story = cluster.stories[j];
				const text_length = story[0].text.length;
				const scale = 1;
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

				instances.push(
					new StoryInstance(
						initialColor,
						selectedColor,
						scale,
						cluster_id,
						cluster_audio_id,
						storyObject,
						text_length,
						[1, 2, 3],
						[1, 2, 3],
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
			centroid.z + centroidOffset,
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
		// populateFromData();

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

	$inspect(centroid, data);

	const textInstances: any[] = $state([]);

	// Function to create character instances from input text
	function createTextInstances(inputText: string) {
		// Clear existing instances
		textInstances.length = 0;

		// Convert text to array of characters
		const characters = inputText.split('');

		// Create an instance for each character
		characters.forEach((char, index) => {
			textInstances.push({
				char: char,
				position: [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]
			});
		});

		console.log(textInstances.length);

		return textInstances;
	}

	// Example usage - you can call this with any text
	const sampleText =
		'Hello World! adskjgbaskjghaslfdkjghsldfjkghsdlfkjghsdflkjghsdflkgjshdflgkjdjfdabsdlfkawböuhqrluitho3i45ythy3874tyw3i47urycs74n		tcwyj4t4cnejergregfnskegcseknctgn3i84cutyq3xm4k74itymwskeir7mgwherrmynsgiwskfxrgmjfsujerfhlgsjkdfhg';
	createTextInstances(sampleText);

	// create a smooth curve from 4 points
	const curve = new CatmullRomCurve3([
		new Vector3(0, 0, 0),
		new Vector3(5, -5, 5),
		new Vector3(10, 10, 10),
		new Vector3(15, 15, 15)
	]);

	// convert curve to an array of 100 points
	const points = curve.getPoints(100);
</script>

<!-- <PerfMonitor anchorY="bottom" /> -->

<T.PerspectiveCamera makeDefault position={[10, 0, 0]}>
	<CameraControls bind:ref={controls} />
</T.PerspectiveCamera>

<!-- <T.DirectionalLight
	position={[1, 2, 5]}
	intensity={1}
/> -->

<!-- <T.Mesh position={[0, 0, 0]}>
	<T.SphereGeometry radius={1} />
	<T.MeshToonMaterial color="red" />
</T.Mesh> -->

<World gravity={[0, 0, 0]}>
	<!-- Only orbit or camera but not both because they control the same camera -->

	<!-- Centroid -->
	<!-- <T.Mesh position={[centroid.x, centroid.y, centroid.z]}>
	<T.BoxGeometry />
	<T.MeshBasicMaterial color="red" />
</T.Mesh> -->

	<T.Mesh position={[0, 0, 0]} scale={5}>
		<MeshLineGeometry {points} />

		<MeshLineMaterial color="white" width={0.05} />
	</T.Mesh>

	<Attractor range={50} strength={5} position={[0.001, 0, 0]} />
	<Attractor range={6} strength={-5} position={[0.001, 0, 0]} />

	<RigidBody>
		<Collider shape="ball" args={[5]} mass={Infinity} />
		<T.Mesh position={[0, 0, 0]}>
			<T.SphereGeometry args={[1, 32, 32]} />
			<T.MeshBasicMaterial color="white" toneMapped={false} />
		</T.Mesh>
		<T.Mesh position={[0, 0, 0]}>
			<T.SphereGeometry args={[2, 32, 32]} />
			<FakeGlowMaterial glowColor="white" toneMapped={false} glowInternalRadius={5} />
		</T.Mesh>
		<T.Mesh position={[0, 0, 0]}>
			<T.SphereGeometry args={[10, 32, 32]} />
			<FakeGlowMaterial glowColor="#404040" opacity={0.01} />
		</T.Mesh>
	</RigidBody>

	<!-- Render each character as a separate 3D text instance -->

	<InstancedMesh {textInstances} range={textInstances.length}>
		{#each textInstances as character}
			<Instance>
				<!-- <BakeShadows /> -->
				<RigidBody>
					<Collider shape="ball" args={[0.1]} mass={1} />
					<T.Mesh position={[character.position[0], character.position[1], character.position[2]]}>
						<!-- <FakeGlowMaterial glowColor="white" /> -->
						<Text3DGeometry text={character.char} size={0.25} depth={0.1} curveSegments={2} />
						<T.MeshBasicMaterial color="#ffffff" toneMapped={false} />
						<!-- <T.MeshToonMaterial color="white" /> -->
					</T.Mesh>
					<!-- <T.SphereGeometry radius={0.75} position={[0, 0, 0]} />
			<T.MeshToonMaterial color="red" />
			<T.Mesh position={[0, 0, 0]}>
				<T.MeshToonMaterial color="blue" />
			</T.Mesh> -->
				</RigidBody>
			</Instance>
		{/each}
	</InstancedMesh>
</World>

<!-- <InstancedMesh {instances} range={instances.length}>
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
			<T.Mesh geometry={instance.geometry}>
				<T.MeshToonMaterial color={instance.color} />
			</T.Mesh>
		</Instance>
	{/each}
</InstancedMesh> -->
