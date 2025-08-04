<script lang="ts">
	import { onMount } from 'svelte';
	import { apiRequest } from '$lib/utils/api_request';
	import { getLocaleFullName } from '$lib/utils/locale_handler';

	import { T, useTask } from '@threlte/core';
	import { interactivity } from '@threlte/extras';
	import { Spring } from 'svelte/motion';
	import { Environment, OrbitControls } from '@threlte/extras';

	let response_clusters = null;

	const API_CLUSTERS_OPTIONS = {
		API_ENDPOINT: '/get_clusters',
		API_METHOD: 'POST',
		REQUEST_BODY: { language: getLocaleFullName(), max_stories: 100, story: null }
	};

	async function fetchClusters() {
		const result = await apiRequest(API_CLUSTERS_OPTIONS);
		if (result) {
			response_clusters = result;
			console.log(response_clusters);
		}
	}

	onMount(() => {
		// fetchClusters();
	});

	interactivity();

	const scale = new Spring(1);

	let autoRotateCamera = false;
	// let  useEnvironment = true;

	let rotation = 0;
	useTask((delta) => {
		rotation += delta;
	});
</script>

<T.PerspectiveCamera makeDefault position.z={5}>
	<OrbitControls autoRotate={autoRotateCamera} />
</T.PerspectiveCamera>

<T.DirectionalLight position={[0, 10, 10]} castShadow />

<T.Mesh
	rotation.y={rotation}
	position.y={1}
	scale={scale.current}
	onpointerenter={() => {
		scale.target = 1.5;
	}}
	onpointerleave={() => {
		scale.target = 1;
	}}
	castShadow
>
	<T.BoxGeometry args={[1, 2, 1]} />
	<T.MeshStandardMaterial color="hotpink" />
</T.Mesh>

<T.Mesh rotation.x={-Math.PI / 2} receiveShadow>
	<T.CircleGeometry args={[4, 40]} />
	<T.MeshStandardMaterial color="white" />
</T.Mesh>
