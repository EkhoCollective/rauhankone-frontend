/**
 * Mobile Audio Handler
 * Handles mobile-specific audio requirements and limitations
 */

class MobileAudioHandler {
	private static instance: MobileAudioHandler;
	private audioContext: AudioContext | null = null;
	private isAudioEnabled = false;

	static getInstance(): MobileAudioHandler {
		if (!MobileAudioHandler.instance) {
			MobileAudioHandler.instance = new MobileAudioHandler();
		}
		return MobileAudioHandler.instance;
	}

	private constructor() {}

	/**
	 * Check if the current device is mobile
	 */
	isMobileDevice(): boolean {
		if (typeof window === 'undefined') return false;
		
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
			(!!navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
	}

	/**
	 * Check if audio context is ready for playback
	 */
	isAudioContextReady(): boolean {
		return this.isAudioEnabled && this.audioContext?.state === 'running';
	}

	/**
	 * Enable audio context (must be called from user interaction)
	 */
	async enableAudio(): Promise<boolean> {
		try {
			if (!this.audioContext) {
				this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
			}

			if (this.audioContext.state === 'suspended') {
				await this.audioContext.resume();
			}

			this.isAudioEnabled = true;
			return this.audioContext.state === 'running';
		} catch (error) {
			console.warn('Failed to enable audio context:', error);
			return false;
		}
	}

	/**
	 * Get optimized fade duration for mobile
	 */
	getOptimizedFadeDuration(baseDuration: number, isFadeOut = false): number {
		if (!this.isMobileDevice()) {
			return baseDuration;
		}

		// Mobile optimizations: shorter fades for better performance
		if (isFadeOut) {
			return Math.max(100, baseDuration * 0.2); // Very fast fade out
		} else {
			return Math.max(200, baseDuration * 0.4); // Faster fade in
		}
	}

	/**
	 * Prepare audio element for mobile playback
	 */
	prepareAudioElement(audio: HTMLAudioElement): void {
		if (!this.isMobileDevice()) return;

		// Mobile-specific optimizations
		audio.preload = 'metadata'; // Less aggressive preloading on mobile
		
		// Set up mobile-friendly event handlers
		audio.addEventListener('canplaythrough', () => {
			// Audio is ready to play through
		}, { once: true });

		audio.addEventListener('stalled', () => {
			// Handle network stalls on mobile
			console.warn('Audio stalled on mobile, attempting to continue...');
		});
	}

	/**
	 * Check if multiple audio streams are supported
	 */
	supportsMultipleAudioStreams(): boolean {
		return !this.isMobileDevice();
	}
}

// Export singleton instance
export const mobileAudioHandler = MobileAudioHandler.getInstance();

// Export helper function for easy mobile detection
export const isMobileDevice = (): boolean => mobileAudioHandler.isMobileDevice();
