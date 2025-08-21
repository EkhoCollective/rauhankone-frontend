import { writable, get } from 'svelte/store';
import { Sound } from 'svelte-sound';
import { browser } from '$app/environment';

// Audio file imports
import Drone1 from '$lib/components/media/audio/bg/250812_Drone 1_seamless.mp3';
import Drone2 from '$lib/components/media/audio/bg/250812_Drone 2_seamless.mp3';
import blipUI1 from '$lib/components/media/audio/ui/Blip_UI_click.mp3';
import { tracklist } from '$lib/components/media/audio/tracklist';

export type AudioPage = 'main' | 'submit' | 'explore';

interface GlobalAudioState {
	isGloballyMuted: boolean;
	currentPage: AudioPage | null;
	previousPage: AudioPage | null;
	drone1Sound: Sound | null;
	drone2Sound: Sound | null;
	blipSound: Sound | null;
	clusterSounds: Map<string, Sound>;
	isInitialized: boolean;
	crossFading: boolean;
}

const initialState: GlobalAudioState = {
	isGloballyMuted: true, // Start muted by default
	currentPage: null,
	previousPage: null,
	drone1Sound: null,
	drone2Sound: null,
	blipSound: null,
	clusterSounds: new Map(),
	isInitialized: false,
	crossFading: false
};

export const globalAudioStore = writable<GlobalAudioState>(initialState);

class GlobalAudioManager {
	private static instance: GlobalAudioManager;

	static getInstance(): GlobalAudioManager {
		if (!GlobalAudioManager.instance) {
			GlobalAudioManager.instance = new GlobalAudioManager();
		}
		return GlobalAudioManager.instance;
	}

	private constructor() {
		if (browser) {
			this.initializeAudio();
		}
	}

	private async initializeAudio() {
		const state = get(globalAudioStore);
		if (state.isInitialized) return;

		try {
			// Initialize sounds with svelte-sound (which uses howler.js)
			const drone1 = new Sound(Drone1, {
				loop: true,
				volume: 1,
				html5: false, // Use Web Audio API
				preload: true
			});

			const drone2 = new Sound(Drone2, {
				loop: true,
				volume: 1,
				html5: false, // Use Web Audio API
				preload: true
			});

			const blip = new Sound(blipUI1, {
				loop: false,
				volume: 0.5,
				html5: false, // Use Web Audio API
				preload: true
			});

			// Initialize cluster sounds
			const clusterSounds = new Map<string, Sound>();
			const clusterTracks = tracklist.filter(track => track.type === 'cluster');
			
			for (const track of clusterTracks) {
				const clusterSound = new Sound(track.src, {
					loop: false,
					volume: 0.7,
					html5: false,
					preload: true
				});
				clusterSounds.set(track.title, clusterSound);
			}

			globalAudioStore.update(state => ({
				...state,
				drone1Sound: drone1,
				drone2Sound: drone2,
				blipSound: blip,
				clusterSounds: clusterSounds,
				isInitialized: true
			}));

			console.log('Global audio initialized');
		} catch (error) {
			console.error('Failed to initialize global audio:', error);
		}
	}

	async setGlobalMute(muted: boolean) {
		const state = get(globalAudioStore);
		

		
		globalAudioStore.update(s => ({
			...s,
			isGloballyMuted: muted
		}));

		if (muted) {
			// Stop all playing sounds (no fading since svelte-sound doesn't expose fade methods)
			if (state.drone1Sound) {
				state.drone1Sound.stop();
			}
			if (state.drone2Sound) {
				state.drone2Sound.stop();
			}
		} else {
			// Get the updated state after the mute change
			const updatedState = get(globalAudioStore);
			// Resume playing based on current page
			if (updatedState.currentPage) {
				await this.switchToPage(updatedState.currentPage);
			}
		}
	}

	async switchToPage(page: AudioPage) {
		const state = get(globalAudioStore);
		
		if (!state.isInitialized || state.crossFading) {
			console.log('Skipping page switch - not initialized or currently crossfading');
			return;
		}
		
		const previousPage = state.currentPage;
		
		// Update the current page first
		globalAudioStore.update(s => ({
			...s,
			currentPage: page,
			previousPage: previousPage,
			crossFading: true
		}));

		if (state.isGloballyMuted) {
			globalAudioStore.update(s => ({ ...s, crossFading: false }));
			return;
		}

		try {
			const targetDrone = page === 'explore' ? state.drone2Sound : state.drone1Sound;
			const otherDrone = page === 'explore' ? state.drone1Sound : state.drone2Sound;

			// Fade out the other drone if it's playing
			if (otherDrone && (otherDrone as any).howl.playing()) {
				(otherDrone as any).howl.fade((otherDrone as any).howl.volume(), 0, 1000);
				setTimeout(() => otherDrone.stop(), 1000);
			}

			// Start the target drone and fade it in
			if (targetDrone) {
				(targetDrone as any).howl.volume(0);
				targetDrone.play();
				(targetDrone as any).howl.fade(0, 0.3, 1000);
			}
		} catch (error) {
			console.error('Error switching audio page:', error);
		} finally {
			globalAudioStore.update(s => ({ ...s, crossFading: false }));
		}
	}

	async playBlip() {
		const state = get(globalAudioStore);
		
		if (state.isGloballyMuted || !state.blipSound || !state.isInitialized) {
			return;
		}

		try {
			// Play the blip sound
			state.blipSound.play();
		} catch (error) {
			console.error('Error playing blip:', error);
		}
	}

	async playClusterSound(clusterId: string) {
		const state = get(globalAudioStore);
		
		if (state.isGloballyMuted || !state.isInitialized || state.clusterSounds.size === 0) {
			return;
		}

		try {
			// Map cluster ID to a specific sound consistently
			const clusterKeys = Array.from(state.clusterSounds.keys());
			
			// Use cluster ID hash to always get the same sound for the same cluster
			let hash = 0;
			for (let i = 0; i < clusterId.length; i++) {
				const char = clusterId.charCodeAt(i);
				hash = ((hash << 5) - hash) + char;
				hash = hash & hash; // Convert to 32-bit integer
			}
			
			const soundIndex = Math.abs(hash) % clusterKeys.length;
			const soundKey = clusterKeys[soundIndex];
			const clusterSound = state.clusterSounds.get(soundKey);
			
			if (clusterSound) {
				clusterSound.play();
			}
		} catch (error) {
			console.error('Error playing cluster sound:', error);
		}
	}

	// Get current state
	getState(): GlobalAudioState {
		return get(globalAudioStore);
	}
}

// Export singleton instance
export const globalAudioManager = GlobalAudioManager.getInstance();

// Export convenient action functions
export const globalAudioActions = {
	setMute: (muted: boolean) => globalAudioManager.setGlobalMute(muted),
	switchToPage: (page: AudioPage) => globalAudioManager.switchToPage(page),
	playBlip: () => globalAudioManager.playBlip(),
	playClusterSound: (clusterId: string) => globalAudioManager.playClusterSound(clusterId),
	getState: () => globalAudioManager.getState()
};
