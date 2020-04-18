import Phaser from 'phaser'
import Npc from './entities/Npc'

const BIRD_SIZE = 50

export class GameScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private player?: Phaser.Physics.Arcade.Sprite
  private npc = new Npc(this, 25, 20)
  private flapping = false
  private facing = -1

  constructor () {
    super('game-scene')
  }

  preload () {
    this.load.image('sky', 'assets/sky.png')
    this.load.spritesheet('birb', 'assets/birb.png', {
      frameWidth: BIRD_SIZE,
      frameHeight: BIRD_SIZE
    })
    this.npc.preload()
  }

  create () {
    this.add.image(400, 300, 'sky')

    this.cursors = this.input.keyboard.createCursorKeys()
    this.player = this.physics.add.sprite(20, 20, 'birb')
    this.player.setCollideWorldBounds(true)

    this.anims.create({
      key: 'stand',
      frameRate: 0,
      frames: this.anims.generateFrameNumbers('birb', {
        start: 2,
        end: 1
      })
    })

    this.anims.create({
      key: 'fly',
      frameRate: 10,
      frames: this.anims.generateFrameNumbers('birb', {
        start: 0,
        end: 1
      })
    })
    this.npc.create()
  }

  update () {
    if (!this.cursors || !this.player) {
      return
    }

    const flying = this.player.body.velocity.y !== 0

    if (this.cursors.up?.isDown) {
      if (!this.flapping) {
        this.player.anims.play('fly')
        this.player.setVelocityY(-5 * BIRD_SIZE)
      }

      this.flapping = true
    } else {
      this.flapping = false
    }

    if (this.cursors.left?.isDown) {
      this.facing = -1
      this.player.setVelocityX(-2 * BIRD_SIZE)
    } else if (this.cursors.right?.isDown) {
      this.facing = 1
      this.player.setVelocityX(2 * BIRD_SIZE)
    } else {
      this.player.setVelocityX(0)
    }

    this.player.setFlipX(this.facing > 0)
    const anim = flying ? 'fly' : 'stand'
    if (this.player.anims.currentAnim?.key !== anim) {
      this.player.anims.play(anim)
    }
    this.npc.update()
  }
}
