import { GameScene, BIRD_SIZE } from '../GameScene'

const CARD_DISTANCE = 100
const CARD_MARGIN = 15

export class Npc {
  private scene: GameScene
  private x: number
  private y: number
  private asset: string
  private sprite?: Phaser.Physics.Arcade.Sprite
  private outline?: Phaser.GameObjects.Sprite
  private card?: Phaser.GameObjects.Sprite
  private heartEmitter?: Phaser.GameObjects.Particles.ParticleEmitter

  private facing = -1
  private lovin = false
  private showOutline = false

  constructor (scene: GameScene, x: number, y: number, asset: string) {
    this.scene = scene
    this.x = x
    this.y = y
    this.asset = asset
  }

  preload () {
    // TODO: will this load the heart several times?
    this.scene.load.image('heart', 'assets/particles/heart.png')
    this.scene.load.image('card', 'assets/twinderframe.png')
    this.scene.load.spritesheet(`${this.asset}-npc`, this.asset, {
      frameWidth: BIRD_SIZE,
      frameHeight: BIRD_SIZE
    })
  }

  create () {
    this.facing = -1
    this.lovin = false

    this.sprite = this.scene.physics.add.sprite(this.x, this.y, `${this.asset}-npc`)
    this.sprite.setOrigin(0.5)
    this.sprite.setDepth(75)

    this.card = this.scene.add.sprite(this.x, this.y - BIRD_SIZE / 2, 'card')
    this.card.setDepth(150)
    this.card.setVisible(false)

    this.scene.anims.create({
      key: `${this.asset}-stand`,
      frameRate: 0,
      frames: this.scene.anims.generateFrameNumbers(`${this.asset}-npc`, {
        start: 3,
        end: 3
      })
    })

    this.scene.anims.create({
      key: `${this.asset}-outline`,
      frameRate: 0,
      frames: this.scene.anims.generateFrameNumbers(`${this.asset}-npc`, {
        start: 8,
        end: 8
      })
    })

    this.sprite.anims.play(`${this.asset}-stand`)
    // this.sprite.setCollideWorldBounds(true)
    this.sprite.setDebug(true, true, 0x00ff00)

    const hearticles = this.scene.add.particles('heart')
    hearticles.setDepth(76)
    this.heartEmitter = hearticles.createEmitter({
      lifespan: 1000,
      speed: { min: 25, max: 50 },
      angle: { min: 250, max: 290 },
      radial: true,
      gravityY: -50,
      frequency: 250,
      quantity: 1
    })
  }

  startLovin () {
    this.lovin = true
    if (!this.heartEmitter || !this.sprite) {
      console.log('no emitter')
      return
    }

    this.heartEmitter.start()
    this.heartEmitter.setPosition(
      this.sprite.x + BIRD_SIZE + (this.facing > 0 ? BIRD_SIZE / 2 : 0),
      this.sprite.y + BIRD_SIZE / 2)
  }

  stopLovin () {
    this.lovin = false
    this.heartEmitter?.stop()
  }

  setShowOutline () {
    this.showOutline = true
  }

  update () {
    if (!this.sprite || !this.card) {
      return
    }

    if (this.showOutline) {
      this.showOutline = false
      this.card.setPosition(
        this.scene.cameras.main.scrollX + this.scene.cameras.main.width - this.card.width / 2 - CARD_MARGIN,
        this.scene.cameras.main.scrollY + this.card.height / 2 + CARD_MARGIN
      )
      this.card.setVisible(true)
      this.sprite.anims.play(`${this.asset}-outline`)
    } else {
      this.card.setVisible(false)
      this.sprite.anims.play(`${this.asset}-stand`)
    }


    // Don't move while you're gettin it on
    if (this.lovin) {
      this.sprite.setVelocityX(0)
      return
    }

    const rand = Math.random()
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

  getPosition (): Phaser.Types.Math.Vector2Like {
    if (!this.sprite) {
      throw new Error('sprite does not exist')
    }

    return {
      x: this.sprite.x,
      y: this.sprite.y
    }
  }

  getSprite (): Phaser.Physics.Arcade.Sprite {
    if (!this.sprite) {
      throw new Error('sprite does not exist')
    }

    return this.sprite
  }

  die () {
    console.log("npc died")
    // unimplemented
  }
}
