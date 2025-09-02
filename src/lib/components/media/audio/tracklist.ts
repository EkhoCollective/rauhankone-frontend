// Background
import Drone1 from '$lib/components/media/audio/bg/250812_Drone 1_seamless.mp3';
import Drone2 from '$lib/components/media/audio/bg/250812_Drone 2_seamless.mp3';
// Clusters
import blip1 from '$lib/components/media/audio/clusters/Blip_hi_00001.mp3';
import blip2 from '$lib/components/media/audio/clusters/Blip_hi_00002.mp3';
import blip3 from '$lib/components/media/audio/clusters/Blip_hi_00003.mp3';
import blip4 from '$lib/components/media/audio/clusters/Blip_hi_00004.mp3';
import blip5 from '$lib/components/media/audio/clusters/Blip_low_00001.mp3';
import blip6 from '$lib/components/media/audio/clusters/Blip_low_00002.mp3';
import blip7 from '$lib/components/media/audio/clusters/Blip_low_00003.mp3';
import blip8 from '$lib/components/media/audio/clusters/Blip_low_00004.mp3';
import blip9 from '$lib/components/media/audio/clusters/Blip_mid_00001.mp3';
import blip10 from '$lib/components/media/audio/clusters/Blip_mid_00002.mp3';
import blip11 from '$lib/components/media/audio/clusters/Blip_mid_00003.mp3';
import blip12 from '$lib/components/media/audio/clusters/Blip_mid_00004.mp3';
// UI
import blipUI1 from '$lib/components/media/audio/ui/250829_UI_Click.mp3';
import toMap from '$lib/components/media/audio/ui/250829_ToMapSound.mp3';


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
    title: 'Drone1',
    src: Drone1,
    type: 'song'
  },
  {
    title: 'Drone2',
    src: Drone2,
    type: 'song'
  },
  {
   title: 'Blip_hi_00001',
   src: blip1,
   type: 'cluster'
  },
  {
    title: 'Blip_hi_00002',
    src: blip2,
    type: 'cluster'
  },
  {
    title: 'Blip_hi_00003',
    src: blip3,
    type: 'cluster'
  },
  {
    title: 'Blip_hi_00004',
    src: blip4,
    type: 'cluster'
  },
  {
    title: 'Blip_low_00001',
    src: blip5,
    type: 'cluster'
  },
  {
    title: 'Blip_low_00002',
    src: blip6,
    type: 'cluster'
  },
  {
    title: 'Blip_low_00003',
    src: blip7,
    type: 'cluster'
  },
  {
    title: 'Blip_low_00004',
    src: blip8,
    type: 'cluster'
  },
  {
    title: 'Blip_mid_00001',
    src: blip9,
    type: 'cluster'
  },
  {
    title: 'Blip_mid_00002',
    src: blip10,
    type: 'cluster'
  },
  {
    title: 'Blip_mid_00003',
    src: blip11,
    type: 'cluster'
  },
  {
    title: 'Blip_mid_00004',
    src: blip12,
    type: 'cluster'
  },
  {
    title: 'Blip_UI',
    src: blipUI1,
    type: 'ui'
  },
  {
    title: 'ToMap',
    src: toMap,
    type: 'ui'
  }

  // Add new sounds here following the same pattern
]