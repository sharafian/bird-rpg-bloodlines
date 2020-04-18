import Phaser from 'phaser'

import { RouletteSlider } from './components/RouletteSlider'
import { Egg } from './entities/Egg'
import { Entity } from './types/Entity'

export class MateScene extends Phaser.Scene {
  private egg = new Egg(this, 400, 130)
  private sliders = [
    new RouletteSlider(this, 400, 220, 0.3, 0.4),
    new RouletteSlider(this, 400, 250, 0.5, 0.9)
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

  create () {
    this.components.forEach(c => c.create())

    const text = this.add.text(250, 300, 'Hit ENTER to select attributes', {
      color: 'white'
    })

    const key = this.input.keyboard.addKey('ENTER')
    key.on('up', () => {
      text.setText('')
      setTimeout(() => {
        text.setText('Hit ENTER to start next mating season')
      }, 1000)
      this.sliders.forEach(s => s.stop())
      this.egg.hatch()
    })

  }

  update () {
    this.components.forEach(c => c.update())
  }
}
