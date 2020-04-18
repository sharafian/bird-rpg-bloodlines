import { GameScene, BIRD_SIZE } from '../GameScene'

export default class Npc {
  private scene: GameScene
  private x: number
  private y: number
  private asset: string
  private sprite?: Phaser.Physics.Arcade.Sprite
  private facing = -1

  constructor (scene: GameScene, x: number, y: number, asset: string) {
    this.scene = scene
    this.x = x
    this.y = y
    this.asset = asset
  }

  preload () {
    this.scene.load.spritesheet(`${this.asset}-npc`, this.asset, {
      frameWidth: BIRD_SIZE,
      frameHeight: BIRD_SIZE
    })
  }

  create () {
    this.sprite = this.scene.physics.add.sprite(this.x, this.y, `${this.asset}-npc`)
    this.scene.anims.create({
      key: `${this.asset}-stand`,
      frameRate: 0,
      frames: this.scene.anims.generateFrameNumbers(`${this.asset}-npc`, {
        start: 3,
        end: 3
      })
    })
    this.sprite.anims.play(`${this.asset}-stand`)
    this.sprite.setCollideWorldBounds(true)
  }

  update () {
    if (!this.sprite) {
      return
    }

    const rand = Math.random();
    // small chance to change direction
    // medium chance to move in facing direction
    // large chance to do nothing
    if (rand > 0 && rand <= 0.02) {
      this.facing = this.facing < 0 ? 1 : -1
    } else if (rand > 0.05 && rand <= 0.2) {
      this.sprite.setVelocityX(this.facing * 2 * BIRD_SIZE)
    } else {
      this.sprite.setVelocityX(0)
    }

    this.sprite.setFlipX(this.facing > 0)
  }
}
