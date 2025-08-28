import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import pc from 'picocolors';

export default defineConfig(({ mode }) => {
	if (mode === 'development') {
		console.log(pc.green('\nDevelopment build - including console and debugger statements\n'));
		return {
			plugins: [tailwindcss(), sveltekit()],
			esbuild: {
				drop: [],
				exclude: ['node_modules/**', "testing/**"]
			},
			test: {
				workspace: [
					{
						extends: './vite.config.ts',
						plugins: [svelteTesting()],
						test: {
							name: 'client',
							environment: 'jsdom',
							clearMocks: true,
							include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
							exclude: ['src/lib/server/**'],
							setupFiles: ['./vitest-setup-client.ts']
						}
					},
					{
						extends: './vite.config.ts',
						test: {
							name: 'server',
							environment: 'node',
							include: ['src/**/*.{test,spec}.{js,ts}'],
							exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
						}
					}
				]
			}
		}
	}
	else {
		pc.bgBlueBright('Production build - optimizing for performance');
		return {
			plugins: [tailwindcss(), sveltekit()],
			esbuild: {
				drop: ['console', 'debugger'],
				exclude: ['node_modules/**', "testing/**"]
			},
			test: {
				workspace: [
					{
						extends: './vite.config.ts',
						plugins: [svelteTesting()],
						test: {
							name: 'client',
							environment: 'jsdom',
							clearMocks: true,
							include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
							exclude: ['src/lib/server/**'],
							setupFiles: ['./vitest-setup-client.ts']
						}
					},
					{
						extends: './vite.config.ts',
						test: {
							name: 'server',
							environment: 'node',
							include: ['src/**/*.{test,spec}.{js,ts}'],
							exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
						}
					}
				]
			}
		}
	}
});

