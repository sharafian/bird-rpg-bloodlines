import Phaser from 'phaser'

import { Npc } from './entities/Npc'
import { Player } from './entities/Player'
import { GroundPredator } from './entities/GroundPredator'
import { PhysicsEntity, Entity } from './types/Entity'
import { MinimapCamera } from './components/MinimapCamera'

export const BIRD_SIZE = 32
export const MATING_RANGE = 150

export const TILE_SIZE = 32

export class GameScene extends Phaser.Scene {
  private nextScene = ''
  private player = new Player(this, 2000, 4000)
  private miniCamera = new MinimapCamera(this, 20, 20)
  private NPCs = [
    new Npc({ scene: this, x: 445, y: 4000, asset: 'assets/birb7.png' }),
    new Npc({ scene: this, x: 1200, y: 4000, asset: 'assets/birb7.png' })
  ]
  private predators = [
    new GroundPredator({
      scene: this,
      x: 1400,
      y: 4000,
      asset: 'assets/cat2.png',
      size: 64
    })
  ]

  private components: Entity[] = [ this.miniCamera ]
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
    this.components.forEach((ent) => ent.preload())

    this.load.audio('theme', [
      'assets/audio/bird_trap_wip.mp3'
    ])
  }

  onFade (_: Phaser.Cameras.Scene2D.Camera, progress: number) {
    if (progress === 1) {
      this.scene.start(this.nextScene)
    }
  }

  create () {
    this.entities.forEach((ent) => ent.create())
    this.components.forEach((ent) => ent.create())
    // todo: get this.physics.add.overlap(player, predators) working

    this.createEnvironment()

    const music = this.sound.add('theme')

    music.play()
    this.events.on('shutdown', () => {
      music.stop()
    })

    const enemies = this.physics.add.group()
    this.predators.forEach(p => p.addToGroup(enemies))
    this.physics.add.collider(this.player.getSprite(), enemies, () => {
      if (!this.player.dead) {
        this.player.die()
        setTimeout(() => {
          this.scheduleFadeout('main-menu')
        }, 1000)
      }
    })

    this.player.on('start_singing', () => {
      const mate = this.closestBirb()

      if (mate) {
        this.player.startLovin()
        mate.startLovin()
        setTimeout(() => {
          this.scheduleFadeout('mating-scene')
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

  private scheduleFadeout (nextScene: string) {
    this.nextScene = nextScene
    this.scheduledFadeout = true
  }

  update (time: number, delta: number) {
    if (this.scheduledFadeout && this.map) {
      this.scheduledFadeout = false

      // don't try this at home, kids
      ;(this.cameras.main as any)._cw = this.map.widthInPixels
      ;(this.cameras.main as any)._ch = this.map.heightInPixels

      this.cameras.main.fadeOut(1000, 0, 0, 0, this.onFade.bind(this))
    }

    const closest = this.closestBirb()
    if (closest) {
      closest.setShowOutline()
    }

    this.entities.forEach((ent) => ent.update(time, delta))
    this.components.forEach((ent) => ent.update(time, delta))
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
