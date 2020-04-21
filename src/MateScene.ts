import Phaser from 'phaser'

import { RouletteSlider } from './components/RouletteSlider'
import { Egg } from './entities/Egg'
import { Entity } from './types/Entity'
import { MAX_VALUE, Traits } from './types/Traits'

export class MateScene extends Phaser.Scene {
  private egg = new Egg(this, 320, 130)
  private sliders: RouletteSlider[] = []
  private playerTraits?: Traits
  private mateTraits?: Traits
  private components?: Entity[]
  private newTraits?: Traits

  constructor () {
    super('mating-scene')
  }

  init ({ playerTraits, mateTraits }:
    { playerTraits: Traits, mateTraits: Traits }) {
    if (playerTraits) {
      this.playerTraits = playerTraits
    } else {
      throw new Error('playerTraits was not passed to mate scene!')
    }
    if (mateTraits) {
      this.mateTraits = mateTraits
    } else {
      throw new Error('mateTraits was not passed to mate scene!')
    }

    const normalizedBeauties = [
      this.playerTraits.beauty / MAX_VALUE,
      this.mateTraits.beauty / MAX_VALUE
    ]
    const normalizedSpeeds = [
      this.playerTraits.speed / MAX_VALUE,
      this.mateTraits.speed / MAX_VALUE
    ]
    this.sliders = [
      new RouletteSlider(
        this,
        320,
        220,
        Math.min(...normalizedBeauties),
        Math.max(...normalizedBeauties)
      ),
      new RouletteSlider(
        this,
        320,
        250,
        Math.min(...normalizedSpeeds),
        Math.max(...normalizedSpeeds)
      )
    ]
    this.components = [
      ...this.sliders,
      this.egg
    ]
  }

  preload () {
    this.components?.forEach(c => c.preload())
  }

  onFade (_: Phaser.Cameras.Scene2D.Camera, progress: number) {
    if (progress === 1) {
      this.scene.start('game-scene', { new: false, ...this.newTraits })
    }
  }

  create () {
    this.components?.forEach(c => c.create())

    const text = this.add.text(175, 300, 'Hit ENTER to select attributes', {
      color: 'white'
    })

    const key = this.input.keyboard.addKey('ENTER')
    key.once('up', () => {
      const [beauty, speed] = this.sliders?.map(s => s.stop())
      this.newTraits = { beauty, speed }
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

  update (time: number, delta: number) {
    this.components?.forEach(c => c.update(time, delta))
  }
}
