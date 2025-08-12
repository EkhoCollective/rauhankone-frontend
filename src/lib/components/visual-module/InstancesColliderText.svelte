<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import StoryInstance from '$lib/components/visual-module/instances/StoryInstance.svelte';
	import * as THREE from 'three';
	import {
		SphereGeometry,
		BoxGeometry,
		ConeGeometry,
		CylinderGeometry,
		DodecahedronGeometry,
		IcosahedronGeometry,
		OctahedronGeometry,
		TetrahedronGeometry,
		TorusGeometry,
		TorusKnotGeometry,
		PlaneGeometry,
		RingGeometry,
		CapsuleGeometry,
		Color
	} from 'three';
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
		BakeShadows
	} from '@threlte/extras';
	import { Attractor, Collider, RigidBody, World } from '@threlte/rapier';
	import { tracklist } from '$lib/components/media/audio/tracklist';
	import { soundEffects } from '$lib/utils/soundEffects';

	const worldScale: number = 10;
	let instances: StoryInstance[] = $state([]);
	const centroidOffset: number = 15;
	let centroid = $state(new THREE.Vector3());

	// const loader = new FontLoader();
	// let loadedFont: Font | null = null;

	// const font = loader.load('/Roboto_Slab_Regular.json', (font) => {
	// 	loadedFont = font;
	// 	// console.log('Font loaded successfully', loadedFont);
	// 	// Repopulate data now that font is loaded to get text geometries
	// 	if (data) {
	// 		populateFromData();
	// 	}
	// });

	// // Array of possible geometries with their creation functions
	// const geometryTypes = [
	// 	{
	// 		name: 'sphere',
	// 		create: (size: number) => new SphereGeometry(size, 16, 16)
	// 	},
	// 	{
	// 		name: 'box',
	// 		create: (size: number) => new BoxGeometry(size, size, size)
	// 	},
	// 	{
	// 		name: 'cone',
	// 		create: (size: number) => new ConeGeometry(size, size * 1.5, 8)
	// 	},
	// 	{
	// 		name: 'cylinder',
	// 		create: (size: number) => new CylinderGeometry(size, size, size * 1.5, 8)
	// 	},
	// 	{
	// 		name: 'dodecahedron',
	// 		create: (size: number) => new DodecahedronGeometry(size)
	// 	},
	// 	{
	// 		name: 'icosahedron',
	// 		create: (size: number) => new IcosahedronGeometry(size)
	// 	},
	// 	{
	// 		name: 'octahedron',
	// 		create: (size: number) => new OctahedronGeometry(size)
	// 	},
	// 	{
	// 		name: 'tetrahedron',
	// 		create: (size: number) => new TetrahedronGeometry(size)
	// 	},
	// 	{
	// 		name: 'torus',
	// 		create: (size: number) => new TorusGeometry(size, size * 0.3, 8, 16)
	// 	},
	// 	{
	// 		name: 'torusKnot',
	// 		create: (size: number) => new TorusKnotGeometry(size, size * 0.3, 64, 8)
	// 	},
	// 	{
	// 		name: 'capsule',
	// 		create: (size: number) => new CapsuleGeometry(size * 0.5, size, 4, 8)
	// 	},
	// 	{
	// 		name: 'text',
	// 		create: (size: number, text: string = 'Default') => {
	// 			if (!loadedFont) {
	// 				// console.warn('Font not loaded yet, falling back to sphere geometry');
	// 				return new SphereGeometry(size, 16, 16);
	// 			}
	// 			try {
	// 				// console.log(
	// 				// 	`Creating TextGeometry with: text="${text}", size=${size}, font:`,
	// 				// 	loadedFont
	// 				// );
	// 				const textGeometry = new TextGeometry(text, {
	// 					font: loadedFont,
	// 					size: size,
	// 					depth: 0.1,
	// 					curveSegments: 2,
	// 					bevelEnabled: false
	// 				});
	// 				// console.log('TextGeometry created successfully:', textGeometry);
	// 				return textGeometry;
	// 			} catch (error) {
	// 				// console.error('Error creating TextGeometry:', error);
	// 				return new SphereGeometry(size, 16, 16);
	// 			}
	// 		}
	// 	}
	// ];

	// // Function to get a random geometry type
	// function getRandomGeometry(size: number) {
	// 	const randomIndex = Math.floor(Math.random() * geometryTypes.length);
	// 	return geometryTypes[randomIndex].create(size);
	// }

	// // Function to get geometry by cluster (consistent shapes per cluster)
	// function getClusterGeometry(clusterIndex: number, size: number, text?: string) {
	// 	const geometryIndex = clusterIndex % geometryTypes.length;
	// 	const selectedGeometry = geometryTypes[geometryIndex];

	// 	// console.log(
	// 	// 	`Cluster ${clusterIndex}: Selected geometry type: ${selectedGeometry.name}, Font loaded: ${!!loadedFont}`
	// 	// );

	// 	// If it's a text geometry and we have text, pass it to the create function
	// 	if (selectedGeometry.name === 'text' && text) {
	// 		// console.log(`Creating text geometry with text: "${text}"`);
	// 		return selectedGeometry.create(size, text);
	// 	}

	// 	return selectedGeometry.create(size);
	// }

	// // Function to add line breaks after periods for better text geometry formatting
	// function processTextForGeometry(text: string): string {
	// 	return text.replace(/\./g, '.\n');
	// }

	// // Function to map text length to a range from 1 to 5
	// function mapTextLengthToRange(textLength: number): number {
	// 	// Define the expected range of text lengths (you may need to adjust these based on your data)
	// 	const minRange = 1;
	// 	const maxRange = 4;
	// 	const minTextLength = 0;
	// 	const maxTextLength = 1000; // Adjust this based on your typical text lengths

	// 	// Clamp the text length to the expected range
	// 	const clampedLength = Math.max(minTextLength, Math.min(maxTextLength, textLength));

	// 	// Map from [minTextLength, maxTextLength] to [1, 5]
	// 	const mappedLength =
	// 		minRange +
	// 		((clampedLength - minTextLength) / (maxTextLength - minTextLength)) * (maxRange - minRange);

	// 	return mappedLength;
	// }

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

	// // Helper function to get random cluster title
	// function getRandomClusterTitle(): string {
	// 	const clusterTracks = tracklist.filter((track) => track.type === 'cluster');
	// 	const randomIndex = Math.floor(Math.random() * clusterTracks.length);
	// 	return clusterTracks[randomIndex].title;
	// }

	// function populateFromData() {
	// 	if (!data || !data.clusters) return;

	// 	// Clear existing instances to avoid duplicates
	// 	instances.length = 0;

	// 	for (let i = 0; i < data.clusters.length; i += 1) {
	// 		const cluster = data.clusters[i];
	// 		const cluster_audio_id = getRandomClusterTitle();

	// 		// Get the color of the cluster
	// 		// const grayValue = Math.random();
	// 		const initialColor = new Color(Math.random(), Math.random(), Math.random());
	// 		const selectedColor = new Color('white');

	// 		for (let j = 0; j < cluster.stories.length; j += 1) {
	// 			const story = cluster.stories[j];
	// 			const text_length = mapTextLengthToRange(story[0].text.length);
	// 			const scale = 1 + text_length;
	// 			const cluster_id = cluster.text;
	// 			const storyObject = story;

	// 			const processedText = processTextForGeometry(story[0].text);
	// 			// Use cluster-based geometry (same shape for all stories in a cluster)
	// 			// Pass processed text with line breaks for text geometry
	// 			const storyGeometry = getClusterGeometry(i, text_length / 10, processedText);

	// 			// Get coordinates from the first variant of the story
	// 			let story_positions = {
	// 				x: story[0].coordinates[0] * worldScale,
	// 				y: story[0].coordinates[1] * worldScale,
	// 				z: story[0].coordinates[2] * worldScale
	// 			};
	// 			let story_velocities = {
	// 				vx: (Math.random() - 0.5) * 0.1,
	// 				vy: (Math.random() - 0.5) * 0.1,
	// 				vz: (Math.random() - 0.5) * 0.1
	// 			};

	// 			let cluster_center = {
	// 				cx: cluster.som[0],
	// 				cy: cluster.som[0],
	// 				cz: cluster.som[0]
	// 			};

	// 			instances.push(
	// 				new StoryInstance(
	// 					initialColor,
	// 					selectedColor,
	// 					scale,
	// 					cluster_id,
	// 					cluster_audio_id,
	// 					storyObject,
	// 					text_length,
	// 					storyGeometry,
	// 					[1, 2, 3],
	// 					story_positions,
	// 					story_velocities,
	// 					cluster_center
	// 				)
	// 			);
	// 		}
	// 	}
	// 	centroid = calculateCentroid();
	// 	lookAtCentroid();
	// }

	// function calculateCentroid() {
	// 	const centroidValue = new THREE.Vector3();
	// 	for (let i = 0; i < instances.length; i++) {
	// 		centroidValue.add(instances[i].positions);
	// 	}
	// 	centroidValue.divideScalar(instances.length);
	// 	return centroidValue;
	// }

	// // Effect to reset selected sphere when modal closes
	// $effect(() => {
	// 	if (selectedStory === null) {
	// 		// Modal closed, reset all selected states
	// 		instances.forEach((instance) => {
	// 			if (instance.selected) {
	// 				instance.selected = false;
	// 				instance.tw.set(0);
	// 			}
	// 		});
	// 	}
	// });

	// $effect(() => {
	// 	for (let i = 0; i < instances.length; i++) {
	// 		instances[i].geometry.computeVertexNormals();
	// 	}
	// });

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
		'Hello World!adskjgbaskjghaslfdkjghsldfjkghsdlfkjghsdflkjghsdfl		kgjshdflgkjdjfdabsdlfkawböuhqrluitho3i45ythy3874tyw3i47urycs74n		tcwyj4t4cnejergregfnskegcseknctgn3i84cutyq3xm4k74itymwskeir7mg		wherrmynsgiwskfxrgmjfsujerfhlgsjkdfhg		Hello World!adskjgbaskjghaslfdkjghsldfjkghsdlfkjghsdflkjghsdfl		kgjshdflgkjdjfdabsdlfkawböuhqrluitho3i45ythy3874tyw3i47urycs74n		tcwyj4t4cnejergregfnskegcseknctgn3i84cutyq3xm4k74itymwskeir7mg		wherrmynsgiwskfxrgmjfsujerfhlgsjkdfhg		Hello World!adskjgbaskjghaslfdkjghsldfjkghsdlfkjghsdflkjghsdfl		kgjshdflgkjdjfdabsdlfkawböuhqrluitho3i45ythy3874tyw3i47urycs74n		tcwyj4t4cnejergregfnskegcseknctgn3i84cutyq3xm4k74itymwskeir7mg		wherrmynsgiwskfxrgmjfsujerfhlgsjkdfhg		Hello World!adskjgbaskjghaslfdkjghsldfjkghsdlfkjghsdflkjghsdfl		kgjshdflgkjdjfdabsdlfkawböuhqrluitho3i45ythy3874tyw3i47urycs74n		tcwyj4t4cnejergregfnskegcseknctgn3i84cutyq3xm4k74itymwskeir7mg		wherrmynsgiwskfxrgmjfsujerfhlgsjkdfhg';
	createTextInstances(sampleText);
</script>

<!-- <PerfMonitor anchorY="bottom" /> -->

<T.PerspectiveCamera makeDefault position={[50, 20, 50]}>
	<CameraControls bind:ref={controls} />
</T.PerspectiveCamera>

<T.DirectionalLight
	position={[1, 2, 5]}
	intensity={1}
	castShadow
	shadow.mapSize.width={1024}
	shadow.mapSize.height={1024}
	shadow.bias={0.0001}
/>

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
	<Attractor range={50} strength={5} position={[0.001, 0, 0]} />
	<Attractor range={6} strength={-5} position={[0.001, 0, 0]} />

	<RigidBody>
		<Collider shape="ball" args={[5]} mass={Infinity} />
		<T.Mesh position={[0, 0, 0]}>
			<!-- <FakeGlowMaterial glowColor="white" /> -->
			<T.SphereGeometry radius={4} />
			<T.MeshBasicMaterial color="#ffffff" toneMapped={false} />
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
						<Text3DGeometry text={character.char} size={0.5} depth={0.1} curveSegments={2} />
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
