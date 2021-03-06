import Phaser from 'phaser'
import { BIRD_SIZE } from '../GameScene'
import { EventEmitter } from 'events'
import { Traits } from '../types/Traits'
import { ITEM_WEIGHT, Item } from '../types/Item'

export class Player extends EventEmitter {
  public type = 'player'
  private sprite?: Phaser.Physics.Arcade.Sprite
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
  private bloodEmitter?: Phaser.GameObjects.Particles.ParticleEmitter

  private flapping = false
  private singing = false
  private lovin = false
  public dead = false
  private facing = 1
  private inventory = [] as Item[]

  constructor (
    private scene: Phaser.Scene,
    private x: number,
    private y: number,
    private traits: Traits
  ) {
    super()
  }

  preload () {
    this.scene.load.spritesheet('blood', 'assets/particles/blood.png', {
      frameWidth: 12,
      frameHeight: 12
    })

    this.scene.load.spritesheet('notes', 'assets/particles/notes.png', {
      frameWidth: 12,
      frameHeight: 12
    })

    this.scene.load.spritesheet('birb', 'assets/birb5.png', {
      frameWidth: BIRD_SIZE,
      frameHeight: BIRD_SIZE
    })
  }

  create () {
    this.flapping = false
    this.singing = false
    this.lovin = false
    this.facing = 1
    this.dead = false
    this.inventory = []

    const noteParticles = this.scene.add.particles('notes')
    noteParticles.setDepth(100)
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

    const bloodParticles = this.scene.add.particles('blood')
    bloodParticles.setDepth(100)
    this.bloodEmitter = bloodParticles.createEmitter({
      frame: [ 5 ],
      x: 0,
      y: 0,
      lifespan: 1000,
      rotate: { min: 0, max: 360 },
      speed: { min: 100, max: 200 },
      angle: { min: 0, max: 360 },
      gravityY: 500,
      quantity: 5,
      frequency: 100
    })

    this.bloodEmitter.stop()
    emitter.stop()

    this.sprite = this.scene.physics.add.sprite(this.x, this.y, 'birb')
    this.sprite.setDepth(100)
    this.sprite.setMaxVelocity(1000, 250)
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

    this.scene.anims.create({
      key: 'pickup',
      frameRate: 10,
      frames: this.scene.anims.generateFrameNumbers('birb', {
        frames: [ 5, 6, 7, 6, 5 ]
      })
    })

    this.cursors = this.scene.input.keyboard.createCursorKeys()
    const singButton = this.scene.input.keyboard.addKey('Z')
    const pickupButton = this.scene.input.keyboard.addKey('X')

    pickupButton.on('down', () => {
      const onGround = this.sprite?.body.blocked.down
      const isPickingUp = this.sprite?.anims.getCurrentKey() === 'pickup'
      const isPlaying = this.sprite?.anims.isPlaying

      if (!this.dead && onGround && (!isPickingUp || !isPlaying)) {
        this.emit('pickup')
        this.sprite!.anims.play('pickup')
      }
    })

    singButton.on('down', () => {
      if (this.lovin) {
        return
      }

      const vy = this.sprite?.body.velocity.y
      const vx = this.sprite?.body.velocity.x
      const stopped = vy === 0 && vx === 0

      if (!this.dead && this.sprite && stopped) {
        this.singing = true

        emitter.setEmitterAngle({
          min: (this.facing < 0 ? 180 : 300),
          max: (this.facing < 0 ? 240 : 360)
        })

        emitter.setPosition(
          this.sprite.x + 20 * this.facing,
          this.sprite.y - 10
        )

        this.emit('start_singing', this.traits, this.inventory)
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

    this.scene.events.on('shutdown', () => {
      singButton.removeAllListeners()
      pickupButton.removeAllListeners()
      this.cursors?.up?.removeAllListeners()
      this.cursors?.down?.removeAllListeners()
      this.cursors?.left?.removeAllListeners()
      this.cursors?.right?.removeAllListeners()
    })
  }

  startLovin () {
    this.lovin = true
  }

  stopLovin () {
    this.lovin = false
  }

  private deathAnimation () {
    if (!this.sprite || !this.bloodEmitter) return

    const { x, y } = this.sprite.getCenter()
    this.bloodEmitter.explode(20, x, y)
    this.sprite.setVisible(false)
  }

  update () {
    if (!this.cursors || !this.sprite) {
      return
    }

    if (this.singing || this.dead) {
      this.sprite.setVelocityX(0)
      return
    }

    if (this.cursors.up?.isDown) {
      if (!this.flapping) {
        if (!this.sprite.anims.isPlaying) {
          this.sprite.anims.play('fly')
        }

        this.sprite.setVelocityY(-7 * BIRD_SIZE)
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
      this.sprite.setVelocityX(6 * this.facing * BIRD_SIZE)
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
    if (
      this.sprite.anims.getCurrentKey() === 'pickup' &&
      !this.sprite.anims.isPaused
    ) {
      return 'pickup'
    }

    if (this.isFlying()) return 'fly'
    if (this.sprite.body.velocity.x) return 'walk'

    return 'stand'
  }

  getPosition () {
    if (!this.sprite) throw new Error('no player')
    return this.sprite
  }

  die () {
    if (!this.dead) {
      this.deathAnimation()
    }

    this.dead = true
  }

  addItem (item: Item) {
    if (this.inventory.length >= Math.floor(this.traits.speed / ITEM_WEIGHT)) {
      this.emit('drop', this.inventory.shift())
    }
    this.inventory.push(item)
  }

  getSprite () {
    if (!this.sprite) {
      throw new Error('Player object has no sprite.')
    } else {
      return this.sprite
    }
  }

  getTraits () {
    if (!this.traits) return
    return this.traits
  }

  getInventory () {
    return this.inventory
  }
}
