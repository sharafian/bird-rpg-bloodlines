import Phaser from 'phaser'

import { Npc } from './entities/Npc'
import { Player } from './entities/Player'
import { GroundPredator } from './entities/GroundPredator'
import { PhysicsEntity } from './types/Entity'

export const BIRD_SIZE = 32
export const MATING_RANGE = 150

export const TILE_SIZE = 32

export class GameScene extends Phaser.Scene {
  private player = new Player(this, 2000, 4000)
  private NPCs = [
    new Npc(this, 445, 425, 'assets/birb7.png'),
    new Npc(this, 1200, 50, 'assets/birb7.png')
  ]

  private predators = [
    new GroundPredator(this, 1400, 700, 'assets/cat2.png', 64)
  ]

  private entities: PhysicsEntity[] = [ ...this.NPCs, ...this.predators, this.player ]
  private scheduledFadeout = false
  private map?: Phaser.Tilemaps.Tilemap

  constructor () {
    super('game-scene')
  }

  preload () {
    this.load.tilemapCSV('environment_map', 'assets/map3.csv')
    this.load.image('environment_tiles_extruded', 'assets/environment_extruded.png')

    this.entities.forEach((ent) => ent.preload())

    this.load.audio('theme', [
      'assets/audio/bird_trap_wip.mp3'
  ]);
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
    
    var music = this.sound.add('theme');

    music.play()
    this.events.on('shutdown', () => {
      music.stop()
    })

    this.player.on('start_singing', () => {
      const mate = this.closestBirb()

      if (mate) {
        this.player.startLovin()
        mate.startLovin()
        setTimeout(() => {
          this.scheduleFadeout()
        }, 1000)
      }
    })
  }

  createEnvironment () {
    this.map = this.make.tilemap({ key: 'environment_map', tileWidth: TILE_SIZE, tileHeight: TILE_SIZE })
    const groundTileset = this.map.addTilesetImage('environment_tiles', 'environment_tiles_extruded', 32, 32, 1, 2)
    const layer = this.map.createStaticLayer(0, groundTileset, 0, 0)

    layer.setCollision([2, 8, 16, 22, 24, 44, 48])
    this.entities.forEach(ent => {
      this.physics.add.collider(ent.getSprite(), layer)
    })

    this.cameras.main.startFollow(this.player.getSprite(), true, 0.1, 0.1)
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
    this.cameras.main.setBackgroundColor('#a6dbed')
  }

  private scheduleFadeout () {
    this.scheduledFadeout = true
  }

  update (time: number, delta: number) {
    if (this.scheduledFadeout && this.map) {
      this.scheduledFadeout = false

      // don't try this at home, kids
      ;(this.cameras.main as any)._cw = this.map.widthInPixels
      ;(this.cameras.main as any)._ch = this.map.heightInPixels

      this.cameras.main.fadeOut(3000, 0, 0, 0, this.onFade.bind(this))
    }

    const closest = this.closestBirb()
    if (closest) {
      closest.setShowOutline()
    }

    this.entities.forEach((ent) => ent.update(time, delta))
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
