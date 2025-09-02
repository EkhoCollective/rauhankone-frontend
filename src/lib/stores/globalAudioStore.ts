import { writable, get } from 'svelte/store';
import {Howl, Howler} from 'howler';
import { browser } from '$app/environment';

// Audio file imports
import Drone1 from '$lib/components/media/audio/bg/250812_Drone 1_seamless.mp3';
import Drone2 from '$lib/components/media/audio/bg/250812_Drone 2_seamless.mp3';
import blipUI1 from '$lib/components/media/audio/ui/250829_UI_Click.mp3';
import toMap from '$lib/components/media/audio/ui/250829_ToMapSound.mp3';
import { tracklist } from '$lib/components/media/audio/tracklist';

export type AudioPage = 'main' | 'submit' | 'explore';

interface GlobalAudioState {
	isGloballyMuted: boolean;
	currentPage: AudioPage | null;
	previousPage: AudioPage | null;
	drone1Sound: Howl | null;
	drone2Sound: Howl | null;
	blipSound: Howl | null;
	toMapSound: Howl | null;
	clusterSounds: Map<string, Howl>;
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
	toMapSound: null,
	clusterSounds: new Map<string, Howl>(),
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
			// Initialize sounds with howler.js directly
			const drone1 = new Howl({
				src: [Drone1],
				loop: true,
				volume: 1,
				html5: false, // Use Web Audio API
				preload: true
			});

			const drone2 = new Howl({
				src: [Drone2],
				loop: true,
				volume: 1,
				html5: false, // Use Web Audio API
				preload: true
			});

			const blip = new Howl({
				src: [blipUI1],
				loop: false,
				volume: 0.5,
				html5: false, // Use Web Audio API
				preload: true
			});

			const toMapSound = new Howl({
				src: [toMap],
				loop: false,
				volume: 0.5,
				html5: false, // Use Web Audio API
				preload: true
			});

			// Initialize cluster sounds
			const clusterSounds = new Map<string, Howl>();
			const clusterTracks = tracklist.filter(track => track.type === 'cluster');
			
			for (const track of clusterTracks) {
				const clusterSound = new Howl({
					src: [track.src],
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
				toMapSound: toMapSound,
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
			if (otherDrone && otherDrone.playing()) {
				otherDrone.fade(otherDrone.volume(), 0, 1000);
				setTimeout(() => otherDrone.stop(), 1000);
			}

			// Start the target drone and fade it in
			if (targetDrone) {
				targetDrone.volume(0);
				targetDrone.play();
				targetDrone.fade(0, 0.3, 1000);
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

	async playClusterSound() {
		const state = get(globalAudioStore);
		
		if (state.isGloballyMuted || !state.isInitialized || state.clusterSounds.size === 0) {
			return;
		}

		try {
			// Pick a random sound from cluster tracks
			const clusterKeys = Array.from(state.clusterSounds.keys());
			const randomIndex = Math.floor(Math.random() * clusterKeys.length);
			const soundKey = clusterKeys[randomIndex];
			const clusterSound = state.clusterSounds.get(soundKey);
			
			if (clusterSound) {
				clusterSound.play();
			}
		} catch (error) {
			console.error('Error playing cluster sound:', error);
		}
	}

	async playtoMap() {
		const state = get(globalAudioStore);
		
		if (state.isGloballyMuted || !state.toMapSound || !state.isInitialized) {
			return;
		}

		try {
			// Play the blip sound
			state.toMapSound.play();
		} catch (error) {
			console.error('Error playing to map:', error);
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
	playtoMap: () => globalAudioManager.playtoMap(),
	playClusterSound: () => globalAudioManager.playClusterSound(),
	getState: () => globalAudioManager.getState()
};
