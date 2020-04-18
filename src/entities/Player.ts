import Phaser from 'phaser'
import { BIRD_SIZE } from '../GameScene'
import { EventEmitter } from 'events' 

export class Player extends EventEmitter {
  private sprite?: Phaser.Physics.Arcade.Sprite
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys

  private flapping = false
  private singing = false
  private lovin = false
  private facing = 1

  constructor (
    private scene: Phaser.Scene,
    private x: number,
    private y: number
  ) {
    super()
  }

  preload () {
    this.scene.load.spritesheet('notes', 'assets/particles/notes.png', {
      frameWidth: 12,
      frameHeight: 12
    })

    this.scene.load.spritesheet('birb', 'assets/birb4.png', {
      frameWidth: BIRD_SIZE,
      frameHeight: BIRD_SIZE
    })
  }

  create () {
    const noteParticles = this.scene.add.particles('notes')
    const emitter = noteParticles.createEmitter({
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

    this.sprite = this.scene.physics.add.sprite(this.x, this.y, 'birb')
    // this.sprite.setCollideWorldBounds(true)

    this.scene.anims.create({
      key: 'stand',
      frameRate: 0,
      frames: this.scene.anims.generateFrameNumbers('birb', {
        start: 3,
        end: 2
      })
    })

    this.scene.anims.create({
      key: 'walk',
      frameRate: 10,
      repeat: -1,
      frames: this.scene.anims.generateFrameNumbers('birb', {
        start: 3,
        end: 5
      })
    })

    this.scene.anims.create({
      key: 'fly',
      frameRate: 10,
      frames: this.scene.anims.generateFrameNumbers('birb', {
        start: 0,
        end: 2
      })
    })

    this.cursors = this.scene.input.keyboard.createCursorKeys()
    const singButton = this.scene.input.keyboard.addKey('Z')

    singButton.on('down', () => {
      if (this.lovin) {
        return
      }

      const vy = this.sprite?.body.velocity.y
      const vx = this.sprite?.body.velocity.x
      const stopped = vy === 0 && vx === 0

      if (this.sprite && stopped) {
        this.singing = true
        console.log('singing')

        emitter.setEmitterAngle({
          min: (this.facing < 0 ? 180 : 300),
          max: (this.facing < 0 ? 240 : 360)
        })

        emitter.setPosition(
          this.sprite.x + 20 * this.facing,
          this.sprite.y - 10
        )

        this.emit('start_singing')
        emitter.start()
      }
    })

    singButton.on('up', () => {
      if (this.lovin) {
        return
      }

      this.emit('stop_singing')
      this.singing = false
      emitter.stop()
    })
  }

  startLovin () {
    this.lovin = true
  }

  stopLovin () {
    this.lovin = false
  }

  update () {
    if (!this.cursors || !this.sprite) {
      return
    }

    if (this.singing) {
      this.sprite.setVelocityX(0)
      return
    }

    if (this.cursors.up?.isDown) {
      if (!this.flapping) {
        if (!this.sprite.anims.isPlaying) {
          this.sprite.anims.play('fly')
        }

        this.sprite.setVelocityY(-5 * BIRD_SIZE)
      }

      this.flapping = true
    } else {
      this.flapping = false
    }

    if (this.cursors.left?.isDown) {
      this.facing = -1
      this.sprite.setVelocityX(-2 * BIRD_SIZE)
    } else if (this.cursors.right?.isDown) {
      this.facing = 1
      this.sprite.setVelocityX(2 * BIRD_SIZE)
    } else {
      this.sprite.setVelocityX(0)
    }

    if (this.isFlying()) {
      this.sprite.setVelocityX(2 * this.facing * BIRD_SIZE)
    }

    this.sprite.setFlipX(this.facing > 0)
    const anim = this.getAnim()
    if (this.sprite.anims.currentAnim?.key !== anim) {
      this.sprite.anims.play(anim)
    }
  }

  private isFlying (): boolean {
    if (!this.sprite) throw new Error('no player')
    return !!this.sprite.body.velocity.y
  }

  private getAnim (): string {
    if (!this.sprite) return 'stand'

    if (this.isFlying()) return 'fly'
    if (this.sprite.body.velocity.x) return 'walk'

    return 'stand'
  }

  getPosition () {
    if (!this.sprite) throw new Error('no player')
    return this.sprite
  }

  getSprite () {
    if (!this.sprite) { 
      throw new Error("Player object has no sprite.") 
    } else {
    return this.sprite
    }
  }
} 
