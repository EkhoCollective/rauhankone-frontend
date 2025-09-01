import { globalAudioActions, type AudioPage } from '$lib/stores/globalAudioStore';

/**
 * Composable for easy audio integration
 * Use this in components that need audio functionality
 */
export function useAudio() {
	
	/**
	 * Play the UI blip sound
	 * This replaces the old soundEffects.playEffect('Blip_UI') calls
	 */
	const playBlip = () => {
		globalAudioActions.playBlip();
	};

	const playtoMap = () => {
		globalAudioActions.playtoMap();
	};

	/**
	 * Play a cluster sound based on cluster ID
	 * Used when opening modals or story interactions
	 * Same cluster ID will always play the same sound
	 */
	const playClusterSound = (clusterId: string) => {
		globalAudioActions.playClusterSound(clusterId);
	};

	/**
	 * Switch to a specific page's audio context
	 * This handles drone switching automatically
	 */
	const switchToPage = (page: AudioPage) => {
		globalAudioActions.switchToPage(page);
	};

	/**
	 * Toggle global mute state
	 */
	const toggleMute = async (muted: boolean) => {
		await globalAudioActions.setMute(muted);
	};

	/**
	 * Get current audio state
	 */
	const getAudioState = () => {
		return globalAudioActions.getState();
	};

	return {
		playBlip,
		playClusterSound,
		playtoMap,
		switchToPage,
		toggleMute,
		getAudioState
	};
}

/**
 * Simple function to play blip sound
 * Use this for quick imports in components that only need blip functionality
 */
export const playBlip = () => globalAudioActions.playBlip();
