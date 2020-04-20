import Phaser from 'phaser'

import { Item } from '../types/Item'

export class ItemEntity {
  public type = 'item'
  private sprite?: Phaser.Physics.Arcade.Sprite

  constructor (
    private scene: Phaser.Scene,
    private x: number,
    private y: number,
    public itemType: Item
  ) { }

  preload () {
    this.scene.load.spritesheet(
      this.itemType.name,
      this.itemType.asset,
      {
        frameWidth: 32,
        frameHeight: 32
      }
    )
  }

  create () {
    this.sprite = this.scene.physics.add.sprite(
      this.x,
      this.y,
      this.itemType.name
    )
    this.sprite.setOrigin(0.5)
    this.sprite.setDepth(75)
  }

  update () {
    // no-op
  }

  getSprite () {
    if (!this.sprite) {
      throw new Error('Item entity has no sprite.')
    } else {
      return this.sprite
    }
  }
}
