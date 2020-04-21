import Phaser from 'phaser'

import { Npc } from './entities/Npc'
import { Player } from './entities/Player'
import { ItemEntity } from './entities/Item'
import { GroundPredator } from './entities/GroundPredator'
import { PhysicsEntity, Entity } from './types/Entity'
import {
  MAP_WIDTH,
  MinimapCamera
} from './components/MinimapCamera'
import { randInt, generateTraits } from './lib/Desirability'
import { ItemTypes } from './types/Item'

export const BIRD_SIZE = 32
export const MATING_RANGE = 150

export const TILE_SIZE = 32

export class GameScene extends Phaser.Scene {
  private nextScene = ''
  private nextSceneData?: object
  private player = new Player(this, 2000, 4000, generateTraits(1))
  private miniCamera = new MinimapCamera(this, 20, 20)
  private NPCs = [
    new Npc({ scene: this, x: 445, y: 4000, asset: 'assets/birb7.png' }),
    new Npc({ scene: this, x: 1200, y: 4000, asset: 'assets/birb7.png' })
  ]
  // generate 10 random items around the map
  private items = [...Array(10)].map(() => {
    return new ItemEntity(
      this,
      randInt(0, MAP_WIDTH),
      4000,
      ItemTypes[randInt(0, ItemTypes.length)]
    )
  })
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
  private entities: PhysicsEntity[] = [
    ...this.NPCs,
    ...this.predators,
    ...this.items,
    this.player
  ]
  private scheduledFadeout = false
  private map?: Phaser.Tilemaps.Tilemap
  private traitsDisplay?: Phaser.GameObjects.Text

  constructor () {
    super('game-scene')
  }

  preload () {
    this.load.tilemapCSV('environment_map', 'assets/map3.csv')
    this.load.image('environment_tiles_extruded', 'assets/environment_extruded.png')

    this.entities.forEach((ent) => ent.preload())
    this.components.forEach((ent) => ent.preload())

    this.load.audio('theme', [
      'assets/audio/bird_trap.mp3'
    ])
  }

  onFade (_: Phaser.Cameras.Scene2D.Camera, progress: number) {
    if (progress === 1) {
      this.scene.start(this.nextScene, this.nextSceneData)
    }
  }

  create () {
    this.entities.forEach((ent) => ent.create())
    this.components.forEach((ent) => ent.create())

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
          this.scheduleFadeout('game-over')
        }, 1000)
      }
    })

    this.player.on('start_singing', (playerTraits, playerInventory) => {
      const mate = this.closestEntity('npc').entity as Npc

      if (mate && mate.desiresFulfilled(playerTraits, playerInventory)) {
        this.player.startLovin()
        mate.startLovin()
        setTimeout(() => {
          this.scheduleFadeout(
            'mating-scene',
            { playerTraits, mateTraits: mate.traits }
          )
        }, 1000)
      }
    })

    this.player.on('pickup', () => {
      // the index of the entity as it appears in a list of only items
      const {
        entity: item = undefined,
        index: itemIndex = 0
      } = this.closestEntity('item') as { entity: ItemEntity, index: number }

      if (item) {
        item.getSprite().setVisible(false)
        this.player.addItem(item.itemType)
        // we remove the item from this.items
        this.items = this.items.filter((_, idx) => idx !== itemIndex)
        // we also need to remove the item from this.entities
        let itemsSeen = 0
        let itemToSplice
        for (const e in this.entities) {
          if (this.entities[e].type === 'item') {
            itemsSeen++
          }
          if (itemsSeen >= itemIndex + 1) {
            itemToSplice = parseInt(e, 10)
            break
          }
        }
        if (itemToSplice) {
          this.entities.splice(itemToSplice, 1)
        }
      }
    })

    this.player.on('drop', (item) => {
      const newItem = new ItemEntity(
        this,
        this.player.getPosition().x,
        this.player.getPosition().y - BIRD_SIZE,
        item
      )
      this.items.push(newItem)
      newItem.create()
    })

    const traits = this.player.getTraits() || { speed: 5, beauty: 5} //yeet
    this.traitsDisplay = this.add.text(400, 440, `Speed: ${traits.speed}   Beauty: ${traits.beauty}`, {fill: '#000'})
    this.traitsDisplay.setScrollFactor(0)
  }

  /** Updates the little line at the bottom that displays player stats */
  private updateTraitsUI() {
    if (!this.traitsDisplay) return
    const traits = this.player.getTraits() 
    this.traitsDisplay.text = `Speed: ${traits?.speed}   Beauty: ${traits?.beauty}`
    this.traitsDisplay.updateText()
  }

  private createEnvironment () {
    this.map = this.make.tilemap({ key: 'environment_map', tileWidth: TILE_SIZE, tileHeight: TILE_SIZE })
    const groundTileset = this.map.addTilesetImage('environment_tiles', 'environment_tiles_extruded', 32, 32, 1, 2)
    const level = this.map.createStaticLayer(0, groundTileset, 0, 0)

    const tileCollisions = [2, 8, 14, 21, 28, 16, 22, 24, 44, 48]
    level.setCollision(tileCollisions)
    level.layer.data.forEach(function (row: any) {
      row.forEach(function (tile: any) {
        if (tileCollisions.includes(tile.index)) {
          tile.collideDown = false
          tile.collideLeft = false
          tile.collideRight = false
          tile.collideUp = true
        }
      })
    })

    this.entities.forEach(ent => {
      this.physics.add.collider(ent.getSprite(), level)
    })

    this.cameras.main.startFollow(this.player.getSprite(), true, 0.1, 0.1)
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
    this.cameras.main.setBackgroundColor('#a6dbed')
  }

  private scheduleFadeout (nextScene: string, data?: object) {
    this.nextScene = nextScene
    this.nextSceneData = data
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

    const closest = this.closestEntity('npc').entity as Npc
    if (closest) {
      closest.setShowOutline()
    }

    this.entities.forEach((ent) => ent.update(time, delta))
    this.components.forEach((ent) => ent.update(time, delta))
  }

  public closestEntity (type?: string):
    { entity: PhysicsEntity, index: number } | { entity: null, index: null } {
    if (!this.player) {
      throw new Error('player does not exist')
    }

    const entitiesToSearch = this.entities
      .filter((ent) => (type ? ent.type === type : true))
    const closest = entitiesToSearch
      .reduce(({ entity: cumE, index: cumI }, ent, idx) => {
        if (!this.player) {
          throw new Error('player does not exist')
        }

        const closestDistance = Phaser.Math.Distance
          .BetweenPoints(this.player.getSprite(), cumE.getSprite())

        const entDistance = Phaser.Math.Distance
          .BetweenPoints(this.player.getSprite(), ent.getSprite())

        return (entDistance < closestDistance) ?
          { entity: ent, index: idx } :
          { entity: cumE, index: cumI }
      }, { entity: entitiesToSearch[0], index: 0 })

    const distance = Phaser.Math.Distance
      .BetweenPoints(this.player.getSprite(), closest.entity.getSprite())

    return distance > MATING_RANGE
      ? { entity: null, index: null }
      : closest
  }

  getPlayer () {
    return this.player
  }
}
