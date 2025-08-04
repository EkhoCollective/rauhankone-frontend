import { Color } from 'three'
import { Tween } from 'svelte/motion'
import { cubicOut } from 'svelte/easing'

export default class {
  tw = new Tween(0, { easing: cubicOut, duration: 250 })
  startColor = new Color()
  endColor = new Color()
  color = $derived(this.startColor.clone().lerpHSL(this.endColor, this.tw.current))
  
  // Make position and velocity properties reactive
  x = $state(0)
  y = $state(0)
  z = $state(0)
  vx = $state(0)
  vy = $state(0)
  vz = $state(0)
  
  get scale() {
    return this.tw.current + this.scale_init
    // fix this. put a minimum max size for every single point
  }
  constructor(
    startColor: Color,
    endColor: Color,
    public scale_init: number,
    x: number,
    y: number,
    z: number,
    vx: number,
    vy: number,
    vz: number
  ) {
    this.startColor.set(startColor)
    this.endColor.set(endColor)
    
    // Set initial positions and velocities
    this.x = x
    this.y = y
    this.z = z
    this.vx = vx
    this.vy = vy
    this.vz = vz
  }
}