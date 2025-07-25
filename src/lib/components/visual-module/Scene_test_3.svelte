<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { interactivity, useCursor, OrbitControls, Align } from '@threlte/extras';
	import { Spring } from 'svelte/motion';
	import { BufferGeometry, Vector3 } from 'three';

	interactivity();

	const { onPointerEnter, onPointerLeave } = useCursor();

	const notHoveringColor = '#ffffff';
	const hoveringColor = '#fe3d00';

	let color = $state(notHoveringColor);

	const count = 1000;
	const radius = 10;
	const scale = new Spring(1);
	const vectorPositions: Vector3[] = [];

	for (let i = 0; i < count; i++) {
		let r = Math.random() * radius;
		let vx = Math.random() * 2 - 1;
		let vy = Math.random() * 2 - 1;
		let vz = Math.random() * 2 - 1;
		const magnitude = Math.sqrt(vx * vx + vy * vy + vz * vz);

		vx = vx / magnitude;
		vy = vy / magnitude;
		vz = vz / magnitude;

		var c = Math.cbrt(r);

		vectorPositions.push(new Vector3(c * vx * radius, c * vy * radius, c * vz * radius));
	}

	const pointsBufferGeometry = new BufferGeometry().setFromPoints(vectorPositions);
</script>

<!-- Scene -->
<T.PerspectiveCamera makeDefault position={[50, 50, 50]} fov={15}>
	<OrbitControls autoRotate autoRotateSpeed={0.1} />
</T.PerspectiveCamera>

<T.DirectionalLight position.y={10} position.z={10} castShadow />

<Align>
	<T.Points
		onpointerenter={() => {
			onPointerEnter();
			scale.target = 2;
			color = hoveringColor;
		}}
		onpointerleave={() => {
			onPointerLeave();
			scale.target = 1;
			color = notHoveringColor;
		}}
	>
		<T is={pointsBufferGeometry} />
		<T.PointsMaterial size={1} {color} />
	</T.Points>
</Align>
