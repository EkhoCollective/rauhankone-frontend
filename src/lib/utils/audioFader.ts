interface FadeOptions {
	duration?: number;
	onComplete?: () => void;
}

class AudioFader {
	private activeFades = new Map<HTMLAudioElement, number>();

	/**
	 * Fade an audio element to a target volume
	 */
	async fadeTo(audio: HTMLAudioElement, targetVolume: number, options: FadeOptions = {}): Promise<void> {
		const { duration = 500, onComplete } = options;
		
		// Cancel any existing fade for this element
		this.cancelFade(audio);
		
		// Validate inputs
		if (!isFinite(targetVolume)) {
			console.warn('Invalid target volume:', targetVolume, 'defaulting to 0');
			targetVolume = 0;
		}
		if (!isFinite(duration) || duration <= 0) {
			console.warn('Invalid duration:', duration, 'defaulting to 500');
			options.duration = 500;
		}
		
		// Clamp target volume
		targetVolume = Math.max(0, Math.min(1, targetVolume));
		
		const startVolume = isFinite(audio.volume) ? audio.volume : 0;
		const volumeDiff = targetVolume - startVolume;
		
		// If already at target volume, resolve immediately
		if (Math.abs(volumeDiff) < 0.001) {
			onComplete?.();
			return;
		}
		
		const startTime = performance.now();
		
		return new Promise((resolve) => {
			const fade = (currentTime: number) => {
				const elapsed = currentTime - startTime;
				const progress = Math.min(elapsed / duration, 1);
				
				// Use exponential easing for natural audio fading
				let easedProgress: number;
				if (targetVolume > startVolume) {
					// Fade in: slow start, fast end
					easedProgress = Math.pow(progress, 0.5);
				} else {
					// Fade out: fast start, slow end
					easedProgress = 1 - Math.pow(1 - progress, 2);
				}
				
				const currentVolume = startVolume + (volumeDiff * easedProgress);
				
				// Ensure volume is a valid finite number between 0 and 1
				const safeVolume = Math.max(0, Math.min(1, isFinite(currentVolume) ? currentVolume : 0));
				audio.volume = safeVolume;
				
				if (progress < 1) {
					const animationId = requestAnimationFrame(fade);
					this.activeFades.set(audio, animationId);
				} else {
					// Fade complete
					audio.volume = targetVolume;
					this.activeFades.delete(audio);
					onComplete?.();
					resolve();
				}
			};
			
			const animationId = requestAnimationFrame(fade);
			this.activeFades.set(audio, animationId);
		});
	}

	/**
	 * Fade in from 0 to target volume
	 */
	async fadeIn(audio: HTMLAudioElement, targetVolume: number = 0.3, duration: number = 500): Promise<void> {
		// Validate inputs
		if (!isFinite(targetVolume)) targetVolume = 0.3;
		if (!isFinite(duration) || duration <= 0) duration = 500;
		
		audio.volume = 0;
		return this.fadeTo(audio, targetVolume, { duration });
	}

	/**
	 * Fade out to 0 volume
	 */
	async fadeOut(audio: HTMLAudioElement, duration: number = 500): Promise<void> {
		// Validate input
		if (!isFinite(duration) || duration <= 0) duration = 500;
		
		return this.fadeTo(audio, 0, { 
			duration,
			onComplete: () => {
				audio.pause();
			}
		});
	}

	/**
	 * Cancel any active fade for an audio element
	 */
	cancelFade(audio: HTMLAudioElement): void {
		const animationId = this.activeFades.get(audio);
		if (animationId) {
			cancelAnimationFrame(animationId);
			this.activeFades.delete(audio);
		}
	}

	/**
	 * Cancel all active fades
	 */
	cancelAllFades(): void {
		this.activeFades.forEach((animationId) => {
			cancelAnimationFrame(animationId);
		});
		this.activeFades.clear();
	}
}

// Export singleton instance
export const audioFader = new AudioFader();
