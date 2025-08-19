/**
 * Mobile Audio Context Handler
 * Handles mobile-specific audio limitations and autoplay policies
 */

let audioContext: AudioContext | null = null;
let isInitialized = false;

export class MobileAudioHandler {
	private static instance: MobileAudioHandler;
	private callbacks: Array<() => void> = [];

	static getInstance(): MobileAudioHandler {
		if (!MobileAudioHandler.instance) {
			MobileAudioHandler.instance = new MobileAudioHandler();
		}
		return MobileAudioHandler.instance;
	}

	private constructor() {
		this.initializeAudioContext();
	}

	/**
	 * Initialize audio context and handle mobile limitations
	 */
	private initializeAudioContext() {
		if (typeof window === 'undefined') return;

		try {
			audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
			isInitialized = true;

			// Handle audio context state changes
			if (audioContext.state === 'suspended') {
				this.handleSuspendedContext();
			}

			// Listen for state changes
			audioContext.addEventListener('statechange', () => {
				if (audioContext?.state === 'running') {
					this.notifyCallbacks();
				}
			});
		} catch (error) {
			console.warn('Failed to initialize audio context:', error);
		}
	}

	/**
	 * Handle suspended audio context (common on mobile)
	 */
	private handleSuspendedContext() {
		console.log('Audio context suspended - user interaction required');
	}

	/**
	 * Resume audio context (call this on user interaction)
	 */
	async resumeAudioContext(): Promise<boolean> {
		if (!audioContext) return false;

		try {
			if (audioContext.state === 'suspended') {
				await audioContext.resume();
				console.log('Audio context resumed');
				return true;
			}
			return audioContext.state === 'running';
		} catch (error) {
			console.warn('Failed to resume audio context:', error);
			return false;
		}
	}

	/**
	 * Check if audio context is ready
	 */
	isAudioContextReady(): boolean {
		return audioContext?.state === 'running' || false;
	}

	/**
	 * Get audio context state
	 */
	getAudioContextState(): AudioContextState | 'unavailable' {
		return audioContext?.state || 'unavailable';
	}

	/**
	 * Register callback for when audio context becomes ready
	 */
	onAudioReady(callback: () => void) {
		if (this.isAudioContextReady()) {
			callback();
		} else {
			this.callbacks.push(callback);
		}
	}

	/**
	 * Notify all registered callbacks
	 */
	private notifyCallbacks() {
		this.callbacks.forEach(callback => callback());
		this.callbacks = [];
	}

	/**
	 * Attempt to enable audio through user interaction
	 * Call this from click handlers
	 */
	async enableAudio(): Promise<boolean> {
		const resumed = await this.resumeAudioContext();
		
		// Also try to play a silent audio to unlock mobile audio
		if (resumed) {
			try {
				const silentAudio = new Audio();
				silentAudio.volume = 0;
				silentAudio.muted = true;
				await silentAudio.play();
				silentAudio.pause();
			} catch (error) {
				// Silent failure is okay
			}
		}
		
		return resumed;
	}
}

// Export singleton instance
export const mobileAudioHandler = MobileAudioHandler.getInstance();

/**
 * Mobile detection utility
 */
export function isMobileDevice(): boolean {
	if (typeof window === 'undefined') return false;
	
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
		(navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
}

/**
 * Check if device likely has autoplay restrictions
 */
export function hasAutoplayRestrictions(): boolean {
	return isMobileDevice() || 
		/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
}
