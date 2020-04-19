import Phaser from 'phaser'

import { Npc } from './entities/Npc'
import { Player } from './entities/Player'
import { GroundPredator } from './entities/GroundPredator'
import { PhysicsEntity } from './types/Entity'

export const BIRD_SIZE = 50
export const MATING_RANGE = 150

export const TILE_SIZE = 32

export class GameScene extends Phaser.Scene {
  private player = new Player(this, 20, 20)
  private NPCs = [
    new Npc(this, 650, 550, 'assets/bluebird.png'),
    new Npc(this, 1200, 50, 'assets/redbird.png')
  ]

  private predators = [
    new GroundPredator(this, 800, 100, 'assets/cat.png', 64)
  ]

  private entities: PhysicsEntity[] = [ ...this.NPCs, ...this.predators, this.player ]

  constructor () {
    super('game-scene')
  }

  preload () {
    this.load.tilemapCSV('environment_map', 'assets/environment.csv')
    this.load.image('environment_tiles', 'assets/environment.png')

    this.entities.forEach((ent) => ent.preload())
  }

  onFade (_: Phaser.Cameras.Scene2D.Camera, progress: number) {
    if (progress === 1) {
      this.scene.start('mating-scene')
    }
  }

  create () {
    this.entities.forEach((ent) => ent.create())
    // todo: get this.physics.add.overlap(player, predators) working

    this.createEnvironment()

    this.player.on('start_singing', () => {
      const mate = this.closestBirb()

      if (mate) {
        this.player.startLovin()
        mate.startLovin()

        setTimeout(() => {
          this.cameras.main.fadeOut(3000, 0, 0, 0, this.onFade.bind(this))
        }, 1000)
      }
    })
  }

  createEnvironment () {
    const map = this.make.tilemap({ key: 'environment_map', tileWidth: TILE_SIZE, tileHeight: TILE_SIZE })
    const groundTileset = map.addTilesetImage('environment_tiles')
    const layer = map.createStaticLayer(0, groundTileset, 0, 0)

    layer.setCollisionBetween(0, 0)
    this.entities.forEach(ent => {
      this.physics.add.collider(ent.getSprite(), layer)
    })

    this.cameras.main.startFollow(this.player.getSprite(), true, 0.1, 0.1)
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.cameras.main.setBackgroundColor('#a6dbed')
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

  getPlayer () {
    return this.player
  }
}
