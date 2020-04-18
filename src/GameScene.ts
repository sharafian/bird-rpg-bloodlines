import Phaser from 'phaser'

const TILE_SIZE = 12

export class GameScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private player?: Phaser.Physics.Arcade.Sprite
  private flapping = false
  private facing = -1

  constructor () {
    super('game-scene')
  }

  preload () {
    this.load.image('sky', 'assets/sky.png')
    this.load.spritesheet('birb', 'assets/birb.png', {
      frameWidth: TILE_SIZE,
      frameHeight: TILE_SIZE
    })
  }

  create () {
    this.add.image(400, 300, 'sky')

    this.cursors = this.input.keyboard.createCursorKeys()
    this.player = this.physics.add.sprite(20, 20, 'birb')
    this.player.setCollideWorldBounds(true)

    this.anims.create({
      key: 'right',
      frameRate: 0,
      frames: this.anims.generateFrameNumbers('birb', {
        start: 1,
        end: 2
      })
    })

    this.anims.create({
      key: 'left',
      frameRate: 0,
      frames: this.anims.generateFrameNumbers('birb', {
        start: 0,
        end: 1
      })
    })

    this.anims.create({
      key: 'fly-left',
      frameRate: 10,
      repeat: -1,
      frames: this.anims.generateFrameNumbers('birb', {
        start: 2,
        end: 3
      })
    })

    this.anims.create({
      key: 'fly-right',
      frameRate: 10,
      repeat: -1,
      frames: this.anims.generateFrameNumbers('birb', {
        start: 4,
        end: 5
      })
    })
  }

  update () {
    if (!this.cursors || !this.player) {
      return
    }

    const flying = this.player.body.velocity.y !== 0

    if (this.cursors.up?.isDown) {
      if (!this.flapping) {
        this.player.setVelocityY(-5 * TILE_SIZE)
      }

      this.flapping = true
    } else {
      this.flapping = false
    }

    if (this.cursors.left?.isDown) {
      this.facing = -1
      this.player.setVelocityX(-2 * TILE_SIZE)
    } else if (this.cursors.right?.isDown) {
      this.facing = 1
      this.player.setVelocityX(2 * TILE_SIZE)
    } else {
      this.player.setVelocityX(0)
    }

    const anim = (flying ? 'fly-' : '') + (this.facing < 0 ? 'left' : 'right')
    if (this.player.anims.currentAnim?.key !== anim) {
      this.player.anims.play(anim)
    }
  }
}
