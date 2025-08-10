import { get } from 'svelte/store';
import { audioStore, audioActions } from '$lib/stores/audioStore';
import { tracklist } from '$lib/components/media/audio/tracklist';
import { audioFader } from '$lib/utils/audioFader';

export class SoundEffects {
	private static instance: SoundEffects;
	private soundCache: Map<string, HTMLAudioElement> = new Map();
	private playingSounds: Set<HTMLAudioElement> = new Set();

	static getInstance(): SoundEffects {
		if (!SoundEffects.instance) {
			SoundEffects.instance = new SoundEffects();
		}
		return SoundEffects.instance;
	}

	private constructor() {}

	/**
	 * Play a sound effect if audio is not globally muted
	 * @param soundKey - Key from tracklist or direct audio source
	 * @param volume - Volume override (0-1), defaults to global volume * 0.5 for FX
	 */
	async playEffect(soundKey: string, volume?: number): Promise<void> {
		const audioState = get(audioStore);
		
		// Don't play if globally muted
		if (audioState.isGloballyMuted) {
			return;
		}

		try {
			let audioSrc: string;
			
			// Check if soundKey is an index in tracklist
			const trackIndex = tracklist.findIndex(track => track.title === soundKey);
			if (trackIndex !== -1) {
				audioSrc = tracklist[trackIndex].src;
			} else {
				// Assume it's a direct audio source
				audioSrc = soundKey;
			}

			// Get or create audio element
			let audio = this.soundCache.get(soundKey);
			if (!audio) {
				audio = new Audio(audioSrc);
				audio.preload = 'auto';
				this.soundCache.set(soundKey, audio);
			}

			// Set target volume (default to half of global volume for effects)
			const effectVolume = volume !== undefined ? volume : audioState.globalVolume * 0.5;

			// Reset audio to beginning
			audio.currentTime = 0;
			
			// Add to playing sounds set
			this.playingSounds.add(audio);
			
			// Remove from playing sounds when it ends
			audio.addEventListener('ended', () => {
				this.playingSounds.delete(audio);
			}, { once: true });
			
			// Start at volume 0 and fade in
			audio.volume = 0;
			await audio.play();
			await audioFader.fadeIn(audio, effectVolume, audioState.fadeDuration * 0.3); // Shorter fade for effects
		} catch (error) {
			console.warn('Failed to play sound effect:', error);
		}
	}

	/**
	 * Stop a specific sound effect
	 * @param soundKey - Key from tracklist or direct audio source
	 */
	async stopEffect(soundKey: string): Promise<void> {
		const audioState = get(audioStore);
		const audio = this.soundCache.get(soundKey);
		if (audio && this.playingSounds.has(audio)) {
			await audioFader.fadeOut(audio, audioState.fadeDuration * 0.2); // Even faster fade out
			audio.currentTime = 0;
			this.playingSounds.delete(audio);
		}
	}

	/**
	 * Stop all currently playing sound effects
	 */
	stopAllEffects(): void {
		this.playingSounds.forEach(audio => {
			audioFader.cancelFade(audio);
			audio.pause();
			audio.currentTime = 0;
		});
		this.playingSounds.clear();
	}

	/**
	 * Preload sound effects for better performance
	 */
	preloadSounds(soundKeys: string[]): void {
		soundKeys.forEach(key => {
			const trackIndex = tracklist.findIndex(track => track.title === key);
			if (trackIndex !== -1) {
				const audio = new Audio(tracklist[trackIndex].src);
				audio.preload = 'auto';
				this.soundCache.set(key, audio);
			}
		});
	}

	/**
	 * Clear sound cache to free memory
	 */
	clearCache(): void {
		this.stopAllEffects();
		this.soundCache.forEach(audio => {
			audio.pause();
			audio.src = '';
		});
		this.soundCache.clear();
	}
}

// Export singleton instance for easy use
export const soundEffects = SoundEffects.getInstance();

// Predefined sound effects
export const SOUND_EFFECTS = {
	MODAL_OPEN: 'FXecho',
	// Add more sound effect mappings as needed
} as const;

// Fade duration presets
export const FADE_PRESETS = {
	INSTANT: 0,
	FAST: 250,
	NORMAL: 500,
	SLOW: 1000,
	VERY_SLOW: 2000
} as const;

// Audio configuration utilities
export const audioConfig = {
	/**
	 * Set global fade duration for all audio fading
	 * @param duration - Duration in milliseconds or preset name
	 */
	setFadeDuration: (duration: number | keyof typeof FADE_PRESETS) => {
		const actualDuration = typeof duration === 'number' ? duration : FADE_PRESETS[duration];
		audioActions.setFadeDuration(actualDuration);
	},
	
	getFadeDuration: () => get(audioStore).fadeDuration
};