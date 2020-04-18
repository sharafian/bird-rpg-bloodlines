import Phaser from 'phaser'

const TILE_SIZE = 16
const BIRD_SIZE = 50

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
    this.load.spritesheet('birb', 'assets/birb3.png', {
      frameWidth: BIRD_SIZE,
      frameHeight: BIRD_SIZE
    })

    this.load.tilemapTiledJSON('map', 'assets/tilemap.json')
    this.load.spritesheet('grass', 'assets/grass.png', {
      frameWidth: TILE_SIZE,
      frameHeight: TILE_SIZE
    })
  }

  create () {
    this.add.image(400, 300, 'sky')

    this.cursors = this.input.keyboard.createCursorKeys()
    this.player = this.physics.add.sprite(50, 50, 'birb')
    this.player.setCollideWorldBounds(true)

    this.anims.create({
      key: 'stand',
      frameRate: 0,
      frames: this.anims.generateFrameNumbers('birb', {
        start: 3,
        end: 2
      })
    })

    this.anims.create({
      key: 'fly',
      frameRate: 10,
      frames: this.anims.generateFrameNumbers('birb', {
        start: 0,
        end: 2
      })
    })

    // Environment
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)

    const map = this.make.tilemap({ key: 'map' })
    const tileset = map.addTilesetImage('tiles')
    map.createStaticLayer(0, tileset, 0, 0)
  }

  update () {
    if (!this.cursors || !this.player) {
      return
    }

    const flying = this.player.body.velocity.y !== 0

    if (this.cursors.up?.isDown) {
      if (!this.flapping) {
        if (!this.player.anims.isPlaying) {
          this.player.anims.play('fly')
        }

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
  }
}
