import { Color, Vector3, BufferGeometry, Float32BufferAttribute, Line, LineBasicMaterial, AdditiveBlending } from 'three'
import { Tween } from 'svelte/motion'
import { cubicOut } from 'svelte/easing'

export default class {
  tw = new Tween(0, { easing: cubicOut, duration: 250 })
  initialColor = new Color()
  selectedColor = new Color()
  color = $derived(this.initialColor.clone().lerpHSL(this.selectedColor, this.tw.current))

  scaleMultiplier:number = 2
  cluster_geo_res: any[] = $state([3, 2])
  // Make position and velocity properties reactive 
  // shape = $state({radius: 1, wSeg: 3, hSeg: 3})

  positions = $state({x: 0, y: 0, z: 0})
  velocities = $state({vx: 0, vy: 0, vz: 0})
  cluster_initial_position = $state({cx: 0, cy: 0, cz: 0})
  
  // Store original positions for jiggle animation
  originalPositions?: {x: number, y: number, z: number}
  
  // Track if this sphere is currently selected
  selected = $state(false)
  
  // Pulsing state and animation
  isPulsing = $state(false)
  pulseTime = $state(0)
  pulseTween = new Tween(0, { easing: cubicOut, duration: 1000 })
  
  // Pulse configuration - unique for each story
  pulseFrequency = $state(1.0) // Base frequency multiplier
  pulseIntensity = $state(0.2) // Base intensity (0.2 = ±20% scale change)
  pulsePhase = $state(0) // Unique phase offset for each story
  
  // Make curve reactive for time-based animation
  curve: any = $state([])
  
  // Store curve metadata for animation
  curveMetadata: any[] = []
  
  // Store references to closest and furthest stories
  closestStory: any = null
  furthestStory: any = null
  
  // Particle trail system
  characterTrails: Map<number, {
    positions: Vector3[],
    geometry: BufferGeometry,
    line: Line,
    colors: number[]
  }> = $state(new Map())
  
  // Trail configuration
  trailLength: number = 250 // Number of trail points per character
  trailFadeSpeed: number = 0.01 // How fast trails fade
  trailUpdateCounter: number = 0 // Counter to control trail update frequency
  needsTrailInitialization: boolean = false // Flag to initialize trails on next animation frame
  
  get scale() {
    // Add pulsing effect to scale when pulsing
    const pulseScale = this.isPulsing ? 1 + Math.sin(this.pulseTime * Math.PI * 2 + this.pulsePhase) * this.pulseIntensity : 1
    return (this.tw.current * this.scaleMultiplier + this.scale_init) * pulseScale
    // fix this. put a minimum max size for every single point
  }
  
  // Start pulsing animation
  startPulsing(): void {
    this.isPulsing = true
    this.pulseTime = 0
  }
  
  // Stop pulsing animation
  stopPulsing(): void {
    this.isPulsing = false
    this.pulseTime = 0
  }
  
  // Update pulse time (called in animation loop)
  updatePulse(delta: number): void {
    if (this.isPulsing) {
      this.pulseTime += delta * 2 * this.pulseFrequency // Speed of pulse oscillation with frequency multiplier
    }
  }
  
  // Configure pulse parameters
  configurePulse(frequency: number = 1.0, intensity: number = 0.2, phase: number = 0): void {
    this.pulseFrequency = frequency
    this.pulseIntensity = intensity
    this.pulsePhase = phase
  }
  
  // Initialize trails for all characters
  initializeCharacterTrails(): void {
    if (!this.text_instances) return
    
    this.text_instances.forEach((character, index) => {
      // Create initial trail positions (all at current character position)
      const positions: Vector3[] = []
      const colors: number[] = []
      
      // No longer need unique hue - using white trails
      
      for (let i = 0; i < this.trailLength; i++) {
        positions.push(new Vector3(
          character.position.x,
          character.position.y,
          character.position.z
        ))
        
        // Create fading white color
        const intensity = (1 - i / (this.trailLength - 1)) ** 4 // Exponential fade
        colors.push(intensity, intensity, intensity) // White RGB with fade
      }
      
      // Create geometry and line
      const geometry = new BufferGeometry()
      const positionArray = new Float32Array(positions.length * 3)
      const colorArray = new Float32Array(colors)
      
      positions.forEach((pos, i) => {
        positionArray[i * 3] = pos.x
        positionArray[i * 3 + 1] = pos.y
        positionArray[i * 3 + 2] = pos.z
      })
      
      geometry.setAttribute('position', new Float32BufferAttribute(positionArray, 3))
      geometry.setAttribute('color', new Float32BufferAttribute(colorArray, 3))
      
      const material = new LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 1.0,
        blending: AdditiveBlending
      })
      
      const line = new Line(geometry, material)
      
      this.characterTrails.set(index, {
        positions,
        geometry,
        line,
        colors
      })
    })
  }
  
  // Initialize trails with animated positions to prevent visual jumps
  initializeCharacterTrailsWithAnimatedPositions(animatedPositions: Vector3[]): void {
    if (!this.text_instances || animatedPositions.length !== this.text_instances.length) return
    
    // Clear existing trails first
    this.disposeTrails()
    
    this.text_instances.forEach((character, index) => {
      // Create initial trail positions (all at current animated position)
      const positions: Vector3[] = []
      const colors: number[] = []
      
      const currentAnimatedPos = animatedPositions[index]
      
      for (let i = 0; i < this.trailLength; i++) {
        positions.push(new Vector3(
          currentAnimatedPos.x,
          currentAnimatedPos.y,
          currentAnimatedPos.z
        ))
        
        // Create fading white color
        const intensity = (1 - i / (this.trailLength - 1)) ** 4 // Exponential fade
        colors.push(intensity, intensity, intensity) // White RGB with fade
      }
      
      // Create geometry and line
      const geometry = new BufferGeometry()
      const positionArray = new Float32Array(positions.length * 3)
      const colorArray = new Float32Array(colors)
      
      positions.forEach((pos, i) => {
        positionArray[i * 3] = pos.x
        positionArray[i * 3 + 1] = pos.y
        positionArray[i * 3 + 2] = pos.z
      })
      
      geometry.setAttribute('position', new Float32BufferAttribute(positionArray, 3))
      geometry.setAttribute('color', new Float32BufferAttribute(colorArray, 3))
      
      const material = new LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 1.0,
        blending: AdditiveBlending
      })
      
      const line = new Line(geometry, material)
      
      this.characterTrails.set(index, {
        positions,
        geometry,
        line,
        colors
      })
    })
    
    this.needsTrailInitialization = false
  }
  
  // Update character trail positions
  updateCharacterTrails(characterIndex: number, newPosition: Vector3): void {
    const trail = this.characterTrails.get(characterIndex)
    if (!trail) return
    
    // Only update trail every few frames to create gaps (like in the example)
    this.trailUpdateCounter++
    if (this.trailUpdateCounter % 2 !== 0) return // Update every 2 frames
    
    // Shift existing positions back
    for (let i = trail.positions.length - 1; i > 0; i--) {
      trail.positions[i].copy(trail.positions[i - 1])
    }
    
    // Add new position at the front
    trail.positions[0].copy(newPosition)
    
    // Update geometry
    const positionArray = trail.geometry.getAttribute('position') as Float32BufferAttribute
    trail.positions.forEach((pos, i) => {
      positionArray.setXYZ(i, pos.x, pos.y, pos.z)
    })
    positionArray.needsUpdate = true
    
    // Update colors for fading white effect
    const colorArray = trail.geometry.getAttribute('color') as Float32BufferAttribute
    for (let i = 0; i < this.trailLength; i++) {
      const intensity = (1 - i / (this.trailLength - 1)) ** 4
      colorArray.setXYZ(i, intensity, intensity, intensity) // White RGB with fade
    }
    colorArray.needsUpdate = true
  }
  
  // Get all trail lines for rendering
  getTrailLines(): Line[] {
    const lines: Line[] = []
    this.characterTrails.forEach(trail => {
      lines.push(trail.line)
    })
    return lines
  }
  
  // Clean up trails when story is deselected
  disposeTrails(): void {
    this.characterTrails.forEach(trail => {
      trail.geometry.dispose()
      if (trail.line.material instanceof LineBasicMaterial) {
        trail.line.material.dispose()
      }
    })
    this.characterTrails.clear()
  }
  
  // Calculate distance to another story instance
  getDistanceTo(otherStory: any): number {
    const dx = this.positions.x - otherStory.positions.x
    const dy = this.positions.y - otherStory.positions.y
    const dz = this.positions.z - otherStory.positions.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }
  
  // Find closest and furthest stories from all available instances
  calculateNearestAndFurthest(allInstances: any[]): void {
    if (allInstances.length <= 1) {
      this.closestStory = null
      this.furthestStory = null
      return
    }
    
    let minDistance = Infinity
    let maxDistance = -1
    let closest = null
    let furthest = null
    
    for (const instance of allInstances) {
      if (instance === this) continue // Skip self
      
      const distance = this.getDistanceTo(instance)
      
      if (distance < minDistance) {
        minDistance = distance
        closest = instance
      }
      
      if (distance > maxDistance) {
        maxDistance = distance
        furthest = instance
      }
    }
    
    this.closestStory = closest
    this.furthestStory = furthest
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
    cluster_geo_res: any[],
    curve: any,
    positions: {x: number, y: number, z: number},
    velocities: {vx: number, vy: number, vz: number},
    // cluster_initial_position: {cx: number, cy: number, cz: number},
  ) {
    this.initialColor.set(initialColor)
    this.selectedColor.set(selectedColor)
    
    // Set initial positions and velocities
    this.curve = curve
    this.text_instances = text_instances
    this.cluster_geo_res = cluster_geo_res
    this.positions = positions
    this.velocities = velocities
    // this.cluster_initial_position = cluster_initial_position
  }
}