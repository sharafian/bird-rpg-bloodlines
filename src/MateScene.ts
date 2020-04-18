import Phaser from 'phaser'
import { RouletteSlider } from './components/RouletteSlider'
import { Entity } from './types/Entity'

export class MateScene extends Phaser.Scene {
  private sliders = [
    new RouletteSlider(this, 200, 100, 0.3, 0.4),
    new RouletteSlider(this, 200, 130, 0.5, 0.9)
  ]

  private components: Entity[] = [
    ...this.sliders
  ]

  constructor () {
    super('mating-scene')
  }

  preload () {
    this.components.forEach(c => c.preload())
  }

  create () {
    this.components.forEach(c => c.create())

    const key = this.input.keyboard.addKey('ENTER')
    key.on('up', () => {
      this.sliders.forEach(s => s.stop())
    })
  }

  update () {
    this.components.forEach(c => c.update())
  }
}
