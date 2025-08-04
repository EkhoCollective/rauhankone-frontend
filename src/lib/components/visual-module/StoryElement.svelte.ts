import { Color } from 'three'
import { Tween } from 'svelte/motion'
import { cubicOut } from 'svelte/easing'

export default class {
  tw = new Tween(0, { easing: cubicOut, duration: 250 })
  startColor = new Color()
  endColor = new Color()
  color = $derived(this.startColor.clone().lerpHSL(this.endColor, this.tw.current))
  get scale() {
    return this.tw.current + this.scale_init
  }
  constructor(
    startColor: Color,
    endColor: Color,
    public scale_init: number,
    public x: number,
    public y: number,
    public z: number
  ) {
    this.startColor.set(startColor)
    this.endColor.set(endColor)
  }
}