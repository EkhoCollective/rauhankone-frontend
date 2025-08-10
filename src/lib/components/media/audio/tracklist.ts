import SatellliteMelody from '$lib/components/media/audio/02_SatelliteMelody.mp3';
import PrinterDroneLow from '$lib/components/media/audio/01_PrinterDroneLow.mp3';
import FXecho from '$lib/components/media/audio/FX_EchoBlips.mp3';

/**
 * Audio tracklist - All audio files with global fade support
 * 
 * To add new sounds:
 * 1. Import your audio file
 * 2. Add to tracklist with a unique title
 * 3. Use with soundEffects.playEffect('YourTitle') - will automatically fade in/out
 * 
 * Fade configuration:
 * - Use audioConfig.setFadeDuration('FAST') for quick fades (250ms)
 * - Use audioConfig.setFadeDuration('SLOW') for slow fades (1000ms)
 * - Use audioConfig.setFadeDuration(750) for custom duration
 */
export const tracklist = [
  {
    title: 'SatellliteMelody',
    src: SatellliteMelody
  },
  {
    title: 'PrinterDroneLow',
    src: PrinterDroneLow
  },
  {
    title: 'FXecho',
    src: FXecho
  }
  // Add new sounds here following the same pattern
]