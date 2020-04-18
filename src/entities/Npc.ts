import { GameScene, BIRD_SIZE } from '../GameScene'

export default class Npc {
  private scene: GameScene
  private x: number
  private y: number
  private asset: string
  private sprite?: Phaser.Physics.Arcade.Sprite
  private heartEmitter?: Phaser.GameObjects.Particles.ParticleEmitter

  private facing = -1
  private lovin = false

  constructor (scene: GameScene, x: number, y: number, asset: string) {
    this.scene = scene
    this.x = x
    this.y = y
    this.asset = asset
  }

  preload () {
    // TODO: will this load the heart several times?
    this.scene.load.image('heart', 'assets/particles/heart.png')
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

    const hearticles = this.scene.add.particles('heart')
    this.heartEmitter = hearticles.createEmitter({
      lifespan: 400,
      speed: { min: 100, max: 200 },
      angle: { min: 180, max: 360 },
      radial: true,
      gravityY: 100,
      frequency: 150,
      quantity: 2
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
      this.sprite.x + BIRD_SIZE / 2,
      this.sprite.y + BIRD_SIZE / 2)
  }

  stopLovin () {
    this.lovin = false
    this.heartEmitter?.stop()
  }

  update () {
    if (!this.sprite) {
      return
    }

    // Don't move while you're gettin it on
    if (this.lovin) {
      this.sprite.setVelocityX(0)
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

  getPosition (): Phaser.Types.Math.Vector2Like {
    if (!this.sprite) {
      throw new Error('sprite does not exist')
    }

    return {
      x: this.sprite.x,
      y: this.sprite.y
    }
  }
}
