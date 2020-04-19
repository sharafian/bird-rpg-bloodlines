import Phaser from 'phaser'

import { RouletteSlider } from './components/RouletteSlider'
import { Egg } from './entities/Egg'
import { Entity } from './types/Entity'

export class MateScene extends Phaser.Scene {
  private egg = new Egg(this, 320, 130)
  private sliders = [
    new RouletteSlider(this, 320, 220, 0.3, 0.4),
    new RouletteSlider(this, 320, 250, 0.5, 0.9)
  ]

  private components: Entity[] = [
    ...this.sliders,
    this.egg
  ]

  constructor () {
    super('mating-scene')
  }

  preload () {
    this.components.forEach(c => c.preload())
  }

  onFade (_: Phaser.Cameras.Scene2D.Camera, progress: number) {
    if (progress === 1) {
      this.scene.start('game-scene')
    }
  }

  create () {
    this.components.forEach(c => c.create())

    const text = this.add.text(175, 300, 'Hit ENTER to select attributes', {
      color: 'white'
    })

    const key = this.input.keyboard.addKey('ENTER')
    key.once('up', () => {
      this.sliders.forEach(s => s.stop())
      text.setText('')

      this.egg.hatch()
      this.egg.once('hatched', () => {
        this.cameras.main.fadeOut(2000, 0, 0, 0, this.onFade.bind(this))
      })
    })

    this.events.on('shutdown', () => {
      key.removeAllListeners()
    })
  }

  update () {
    this.components.forEach(c => c.update())
  }
}
