import { Color } from 'three'
import { Tween } from 'svelte/motion'
import { cubicOut } from 'svelte/easing'

export default class {
  tw = new Tween(0, { easing: cubicOut, duration: 250 })
  initialColor = new Color()
  selectedColor = new Color()
  color = $derived(this.initialColor.clone().lerpHSL(this.selectedColor, this.tw.current))
  
  // Make position and velocity properties reactive 
  // shape = $state({radius: 1, wSeg: 3, hSeg: 3})
  positions = $state({x: 0, y: 0, z: 0})
  velocities = $state({vx: 0, vy: 0, vz: 0})
  cluster_initial_position = $state({cx: 0, cy: 0, cz: 0})
  
  // Track if this sphere is currently selected
  selected = $state(false)
  
  get scale() {
    return this.tw.current/5 + this.scale_init
    // fix this. put a minimum max size for every single point
  }
  constructor(
    initialColor: Color,
    selectedColor: Color,
    public scale_init: number,
    public cluster_id: string,
    public cluster_audio_id: string,
    public story: any[], 
    public story_text_length: number,
    public text_instances: any[],
    public curve: any,
    positions: {x: number, y: number, z: number},
    velocities: {vx: number, vy: number, vz: number},
    // cluster_initial_position: {cx: number, cy: number, cz: number},
  ) {
    this.initialColor.set(initialColor)
    this.selectedColor.set(selectedColor)
    
    // Set initial positions and velocities
    this.curve = curve
    this.text_instances = text_instances
    this.positions = positions
    this.velocities = velocities
    // this.cluster_initial_position = cluster_initial_position
  }
}