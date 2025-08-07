import { get } from 'svelte/store';
import { audioStore } from '$lib/stores/audioStore';
import { tracklist } from '$lib/components/media/audio/tracklist';

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

			// Set volume (default to half of global volume for effects)
			const effectVolume = volume !== undefined ? volume : audioState.globalVolume * 0.5;
			audio.volume = effectVolume;

			// Reset audio to beginning and play
			audio.currentTime = 0;
			
			// Add to playing sounds set
			this.playingSounds.add(audio);
			
			// Remove from playing sounds when it ends
			audio.addEventListener('ended', () => {
				this.playingSounds.delete(audio);
			}, { once: true });
			
			await audio.play();
		} catch (error) {
			console.warn('Failed to play sound effect:', error);
		}
	}

	/**
	 * Stop a specific sound effect
	 * @param soundKey - Key from tracklist or direct audio source
	 */
	stopEffect(soundKey: string): void {
		const audio = this.soundCache.get(soundKey);
		if (audio && this.playingSounds.has(audio)) {
			audio.pause();
			audio.currentTime = 0;
			this.playingSounds.delete(audio);
		}
	}

	/**
	 * Stop all currently playing sound effects
	 */
	stopAllEffects(): void {
		this.playingSounds.forEach(audio => {
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