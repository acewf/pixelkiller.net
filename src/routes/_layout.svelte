<script>
	import { onMount } from 'svelte';
	import Nav from '../components/Nav.svelte';
	import WebGl, { getBin } from '../webgl';
	import { generate } from '../utils/generateNoise';
	import SmokeFrag from '../shaders/smoke.frag';
	import SmokeVert from '../shaders/smoke.vert';

	let smokeAnim = null;
	onMount(() => {
		const mm = window.matchMedia('(max-width: 599px)');
		const canvas = document.getElementById('webcanvas');
		const texture = generate();
		const textures = [texture];

		smokeAnim = new WebGl({
			canvas, textures,
			vertShader: SmokeVert, fragShader: SmokeFrag
		});

		return () => {
		};
	});

	export let segment;
</script>

<style>
	main {
		position: relative;
		max-width: 56em;
		background-color: white;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
	}

	canvas {
		width: 100%;
		position: absolute;
		bottom: 0;
		left: 0;
		height: 400px;
		z-index: 1;
	}
</style>

<Nav {segment} />
<main>
	<slot></slot>
	<canvas id="webcanvas" />
</main>