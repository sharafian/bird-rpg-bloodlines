import Phaser from 'phaser'

const TILE_SIZE = 12

export class GameScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private player?: Phaser.Physics.Arcade.Sprite

  private flapping = false

  constructor () {
    super('game-scene')
  }

  preload (this: Phaser.Scene) {
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
        end: 1
      })
    })

    this.anims.create({
      key: 'left',
      frameRate: 0,
      frames: this.anims.generateFrameNumbers('birb', {
        start: 0,
        end: 0
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

    const flying = !this.player.body.touching.down

    if (this.cursors.up?.isDown) {
      if (!this.flapping) {
        this.player.setVelocityY(-5 * TILE_SIZE)
      }

      this.flapping = true
    } else {
      this.flapping = false
    }

    if (this.cursors.left?.isDown) {
      // this.player.anims.play(flying ? 'fly-left' : 'left', true)
      this.player.setVelocityX(-2 * TILE_SIZE)
    } else if (this.cursors.right?.isDown) {
      // this.player.anims.play(flying ? 'fly-right' : 'right', true)
      this.player.setVelocityX(2 * TILE_SIZE)
    } else {
      this.player.setVelocityX(0)
    }
  }
}
