import { Color } from 'three'
import { Tween } from 'svelte/motion'
import { cubicOut } from 'svelte/easing'

export default class {
  tw = new Tween(0, { easing: cubicOut, duration: 250 })
  startColor = new Color()
  endColor = new Color()
  color = $derived(this.startColor.clone().lerpHSL(this.endColor, this.tw.current))
  
  // Make position and velocity properties reactive 
  shape = $state({radius: 1, wSeg: 3, hSeg: 3})
  positions = $state({x: 0, y: 0, z: 0})
  velocities = $state({vx: 0, vy: 0, vz: 0})
  cluster_initial_position = $state({cx: 0, cy: 0, cz: 0})
  
  // Track if this sphere is currently selected
  selected = $state(false)
  
  get scale() {
    return this.tw.current + this.scale_init
    // fix this. put a minimum max size for every single point
  }
  constructor(
    startColor: Color,
    endColor: Color,
    public scale_init: number,
    public cluster_id: string,
    public cluster_audio_id: string,
    public story: any[], 
    public story_text_length: number,
    shape:{radius: number, wSeg: number, hSeg: number},
    positions: {x: number, y: number, z: number},
    velocities: {vx: number, vy: number, vz: number},
    cluster_initial_position: {cx: number, cy: number, cz: number},
  ) {
    this.startColor.set(startColor)
    this.endColor.set(endColor)
    
    // Set initial positions and velocities
    this.shape = shape
    this.positions = positions
    this.velocities = velocities
    this.cluster_initial_position = cluster_initial_position
  }
}