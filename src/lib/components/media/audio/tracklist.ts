import SatellliteMelody from '$lib/components/media/audio/bg/02_SatelliteMelody.mp3';
import PrinterDroneLow from '$lib/components/media/audio/bg/01_PrinterDroneLow.mp3';
import clusterSound1 from '$lib/components/media/audio/clusters/NODE_Bubbling.mp3';
import clusterSound2 from '$lib/components/media/audio/clusters/NODE_Darkish.mp3';
import clusterSound3 from '$lib/components/media/audio/clusters/NODE_arcade.mp3';
import clusterSound4 from '$lib/components/media/audio/clusters/NODE_birds.mp3';
import clusterSound5 from '$lib/components/media/audio/clusters/NODE_brighter.mp3';
import clusterSound6 from '$lib/components/media/audio/clusters/NODE_data1.mp3';
import clusterSound7 from '$lib/components/media/audio/clusters/NODE_glitching.mp3';
import clusterSound8 from '$lib/components/media/audio/clusters/NODE_gritty.mp3';
import clusterSound9 from '$lib/components/media/audio/clusters/NODE_hollow.mp3';
import clusterSound10 from '$lib/components/media/audio/clusters/NODE_hollowLOW.mp3';
import clusterSound11 from '$lib/components/media/audio/clusters/NODE_malletdata.mp3';
import clusterSound12 from '$lib/components/media/audio/clusters/NODE_pingpong.mp3';
import clusterSound13 from '$lib/components/media/audio/clusters/NODE_pointillist.mp3';
import clusterSound14 from '$lib/components/media/audio/clusters/NODE_pulsing.mp3';
import clusterSound15 from '$lib/components/media/audio/clusters/NODE_resonance.mp3';
import clusterSound16 from '$lib/components/media/audio/clusters/NODE_riser.mp3';
import clusterSound17 from '$lib/components/media/audio/clusters/NODE_spaceship.mp3';
import clusterSound18 from '$lib/components/media/audio/clusters/NODE_stutterchords.mp3';
import clusterSound19 from '$lib/components/media/audio/clusters/NODE_wildlife.mp3';

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
    src: SatellliteMelody,
    type: 'song'
  },
  {
    title: 'PrinterDroneLow',
    src: PrinterDroneLow,
    type: 'song'
  },
  {
   title: 'NODE_Bubbling',
   src: clusterSound1,
   type: 'cluster'
  },
  {
    title: 'NODE_Darkish',
    src: clusterSound2,
    type: 'cluster'
  },
  {
    title: 'NODE_arcade',
    src: clusterSound3,
    type: 'cluster'
  },
  {
    title: 'NODE_birds',
    src: clusterSound4,
    type: 'cluster'
  },
  {
    title: 'NODE_brighter',
    src: clusterSound5,
    type: 'cluster'
  },
  {
    title: 'NODE_data1',
    src: clusterSound6,
    type: 'cluster'
  },
  {
    title: 'NODE_glitching',
    src: clusterSound7,
    type: 'cluster'
  },
  {
    title: 'NODE_gritty',
    src: clusterSound8,
    type: 'cluster'
  },
  {
    title: 'NODE_hollow',
    src: clusterSound9,
    type: 'cluster'
  },
  {
    title: 'NODE_hollowLOW',
    src: clusterSound10,
    type: 'cluster'
  },
  {
    title: 'NODE_malletdata',
    src: clusterSound11,
    type: 'cluster'
  },
  {
    title: 'NODE_pingpong',
    src: clusterSound12,
    type: 'cluster'
  },
  {
    title: 'NODE_pointillist',
    src: clusterSound13,
    type: 'cluster'
  },
  {
    title: 'NODE_pulsing',
    src: clusterSound14,
    type: 'cluster'
  },
  {
    title: 'NODE_resonance',
    src: clusterSound15,
    type: 'cluster'
  },
  {
    title: 'NODE_riser',
    src: clusterSound16,
    type: 'cluster'
  },
  {
    title: 'NODE_spaceship',
    src: clusterSound17,
    type: 'cluster'
  },
  {
    title: 'NODE_stutterchords',
    src: clusterSound18,
    type: 'cluster'
  },
  {
    title: 'NODE_wildlife',
    src: clusterSound19,
    type: 'cluster'
  }
  // Add new sounds here following the same pattern
]