import Phaser from 'phaser'

import { Npc } from './entities/Npc'
import { Player } from './entities/Player'
import { Entity } from './types/Entity'

export const BIRD_SIZE = 50
export const MATING_RANGE = 150

export class GameScene extends Phaser.Scene {
  private player = new Player(this, 20, 20)
  private NPCs = [
    new Npc(this, 50, 50, 'assets/bluebird.png'),
    new Npc(this, 100, 50, 'assets/redbird.png'),
  ]

  private entities: Entity[] = [ ...this.NPCs, this.player ]

  constructor () {
    super('game-scene')
  }

  preload () {
    this.load.image('sky', 'assets/sky.png')
    this.entities.forEach((ent) => ent.preload())
  }

  create () {
    this.add.image(400, 300, 'sky')
    this.entities.forEach((ent) => ent.create())

    this.player.on('start_singing', () => {
      const mate = this.closestBirb()

      if (mate) {
        this.player.startLovin()
        mate.startLovin()
      }
    })
  }

  update () {
    this.entities.forEach((ent) => ent.update())
  }

  public closestBirb (): Npc | void {
    if (!this.player) {
      throw new Error('player does not exist')
    }

    const closest = this.NPCs.reduce((closest, npc) => {
      if (!this.player) {
        throw new Error('player does not exist')
      }

      const closestDistance = Phaser.Math.Distance
        .BetweenPoints(this.player.getPosition(), closest.getPosition())

      const npcDistance = Phaser.Math.Distance
        .BetweenPoints(this.player.getPosition(), npc.getPosition())

      return (npcDistance < closestDistance) ? npc : closest
    })

    const distance = Phaser.Math.Distance
      .BetweenPoints(this.player.getPosition(), closest.getPosition())

    return distance > MATING_RANGE
      ? undefined
      : closest
  }
}
