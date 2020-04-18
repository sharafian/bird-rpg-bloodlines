import Phaser from 'phaser'
import Npc from './entities/Npc'

export const BIRD_SIZE = 50

export class GameScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private player?: Phaser.Physics.Arcade.Sprite
  private NPCs = [
    new Npc(this, 50, 50, 'assets/bluebird.png'),
    new Npc(this, 100, 50, 'assets/redbird.png'),
  ]
  private flapping = false
  private singing = false
  private facing = -1

  constructor () {
    super('game-scene')
  }

  preload () {
    this.load.spritesheet('notes', 'assets/particles/notes.png', {
      frameWidth: 12,
      frameHeight: 12
    })

    this.load.image('sky', 'assets/sky.png')
    this.load.spritesheet('birb', 'assets/birb4.png', {
      frameWidth: BIRD_SIZE,
      frameHeight: BIRD_SIZE
    })
    this.NPCs.forEach((npc) => npc.preload())
  }

  create () {
    this.add.image(400, 300, 'sky')

    this.cursors = this.input.keyboard.createCursorKeys()
    this.player = this.physics.add.sprite(20, 20, 'birb')
    this.player.setCollideWorldBounds(true)

    const particles = this.add.particles('notes')
    const emitter = particles.createEmitter({
      frame: [ 0, 1, 2, 3, 4, 5, 6, 7 ],
      x: 40,
      y: 0,
      lifespan: 800,
      speed: { min: 100, max: 200 },
      angle: { min: 300, max: 360 },
      radial: true,
      gravityY: 0,
      quantity: 2,
      frequency: 150
    })

    emitter.stop()

    this.anims.create({
      key: 'stand',
      frameRate: 0,
      frames: this.anims.generateFrameNumbers('birb', {
        start: 3,
        end: 2
      })
    })

    this.anims.create({
      key: 'walk',
      frameRate: 10,
      repeat: -1,
      frames: this.anims.generateFrameNumbers('birb', {
        start: 3,
        end: 5
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

    this.NPCs.forEach((npc) => npc.create())

    const singButton = this.input.keyboard.addKey('Z')
    singButton.on('down', () => {
      const vy = this.player?.body.velocity.y
      const vx = this.player?.body.velocity.x
      const stopped = vy === 0 && vx === 0

      if (this.player && stopped) {
        this.singing = true
        console.log('singing')

        emitter.setEmitterAngle({
          min: (this.facing < 0 ? 180 : 300),
          max: (this.facing < 0 ? 240 : 360)
        })

        emitter.setPosition(
          this.player.x + 20 * this.facing,
          this.player.y - 10
        )

        emitter.start()
      }
    })

    singButton.on('up', () => {
      this.singing = false
      emitter.stop()
    })
  }

  update () {
    if (!this.cursors || !this.player) {
      return
    }

    if (this.singing) {
      this.player.setVelocityX(0)
      return
    }


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
    const anim = this.getAnim()
    if (this.player.anims.currentAnim?.key !== anim) {
      this.player.anims.play(anim)
    }
    this.NPCs.forEach((npc) => npc.update())
  }

  getAnim (): string {
    if (!this.player) return 'stand'

    if (this.player.body.velocity.y) return 'fly'
    if (this.player.body.velocity.x) return 'walk'

    return 'stand'
  }
}
