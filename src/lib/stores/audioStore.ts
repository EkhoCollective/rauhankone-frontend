import { writable } from 'svelte/store';

interface AudioState {
	isGloballyMuted: boolean;
	playingState: 'playing' | 'paused';
	currentSong: HTMLAudioElement | null;
	globalVolume: number;
	fadeDuration: number;
}

const initialState: AudioState = {
	isGloballyMuted: true,
	playingState: 'paused',
	currentSong: null,
	globalVolume: 0.3,
	fadeDuration: 500
};

export const audioStore = writable<AudioState>(initialState);

// Helper functions to manage audio state
export const audioActions = {
	setMuted: (muted: boolean) => {
		audioStore.update(state => ({
			...state,
			isGloballyMuted: muted
		}));
	},
	
	setPlayingState: (playingState: 'playing' | 'paused') => {
		audioStore.update(state => ({
			...state,
			playingState
		}));
	},
	
	setCurrentSong: (song: HTMLAudioElement | null) => {
		audioStore.update(state => ({
			...state,
			currentSong: song
		}));
	},
	
	setVolume: (volume: number) => {
		audioStore.update(state => ({
			...state,
			globalVolume: Math.max(0, Math.min(1, volume))
		}));
	},
	
	setFadeDuration: (duration: number) => {
		audioStore.update(state => ({
			...state,
			fadeDuration: Math.max(100, duration)
		}));
	}
};