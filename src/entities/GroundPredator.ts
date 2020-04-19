import { GameScene } from '../GameScene'
import { Player } from './Player'
import { Npc } from './Npc'

const CHASE_DISTANCE = 250
const CHASE_SPEED = 240
const JUMP_POWER = 400
const BEHAVIOR_TICK = 200

export class GroundPredator {
  private scene: GameScene
  private x: number
  private y: number
  private asset: string
  private sprite?: Phaser.Physics.Arcade.Sprite
  private size: number

  private facing = -1
  private timeCounter = 0

  constructor (
    scene: GameScene,
    x: number,
    y: number,
    asset: string,
    size: number
  ) {
    this.scene = scene
    this.x = x
    this.y = y
    this.asset = asset
    this.size = size
  }

  preload () {
    this.scene.load.spritesheet(`${this.asset}-ground-predator`, this.asset, {
      frameWidth: this.size,
      frameHeight: this.size
    })
  }

  create () {
    this.sprite = this.scene.physics.add.sprite(
      this.x,
      this.y,
      `${this.asset}-ground-predator`
    )
    this.sprite.setDepth(50)

    this.scene.anims.create({
      key: `${this.asset}-stand`,
      frameRate: 0,
      frames: this.scene.anims.generateFrameNumbers(
        `${this.asset}-ground-predator`,
        {
          start: 3,
          end: 3
        }
      )
    })

    this.scene.anims.create({
      key: `${this.asset}-walk`,
      frameRate: 2,
      repeat: -1,
      frames: this.scene.anims.generateFrameNumbers(
        `${this.asset}-ground-predator`,
        {
          start: 0,
          end: 3
        }
      )
    })

    this.scene.anims.create({
      key: `${this.asset}-run`,
      frameRate: 10,
      repeat: -1,
      frames: this.scene.anims.generateFrameNumbers(
        `${this.asset}-ground-predator`,
        {
          start: 0,
          end: 3
        }
      )
    })

    this.scene.anims.create({
      key: `${this.asset}-jump`,
      frameRate: 0,
      frames: this.scene.anims.generateFrameNumbers(
        `${this.asset}-ground-predator`,
        {
          start: 1,
          end: 2
        }
      )
    })

    this.sprite.anims.play(`${this.asset}-stand`)
    // this.sprite.setCollideWorldBounds(true)
    this.sprite.setDebug(true, true, 0x00ff00)

    // todo: get overlap working
    // const playerSprite = this.scene.getPlayer().getSprite()
    // this.scene.physics.add.overlap(
    //   playerSprite,
    //   this.getSprite(),
    //   this.kill,
    //   null,
    //   this
    // )
  }

  update (_: number, delta: number) {
    const prey = this.scene.getPlayer()

    this.timeCounter += delta
    if (this.timeCounter > BEHAVIOR_TICK) {
      this.timeCounter = 0

      if (this.isFarther(prey, CHASE_DISTANCE)) {
        this.prowl()
      } else {
        this.attack(prey)
      }
    }

    const anim = this.getAnim()
    if (anim !== this.sprite!.anims.getCurrentKey()) {
      this.sprite!.anims.play(anim)
    }

    this.sprite!.setFlipX(this.facing < 0)
  }

  isFarther (prey: Npc | Player, distance: number) {
    const selfLocation = this.getPosition()
    const playerLocation = prey.getPosition()
    return Phaser.Math.Distance.BetweenPoints(selfLocation, playerLocation) > distance
  }

  prowl () {
    // wander around
    const rand = Math.random()
    // small chance to change direction
    // medium chance to move in facing direction
    // large chance to do nothing
    if (rand > 0 && rand <= 0.02) {
      this.facing = this.facing < 0 ? 1 : -1
    } else {
      this.sprite!.setVelocityX(this.facing * 0.25 * this.size)
    }
  }

  runLeft () {
    this.sprite!.setVelocityX(-CHASE_SPEED)
    this.facing = -1
  }

  runRight () {
    this.sprite!.setVelocityX(CHASE_SPEED)
    this.facing = 1
  }

  jump () {
    this.sprite!.setVelocityY(-JUMP_POWER)
  }

  stop () {
    this.sprite!.setVelocity(0)
  }

  attack (prey: Npc | Player) {
    const preyPosition = prey.getPosition()
    const predatorPosition = this.getPosition()
    const onGround = this.sprite!.body.blocked.down

    //   move in the x direction of prey and jump when reached
    // if bird is above
    if (
      Math.abs(preyPosition.x! - predatorPosition.x!) < 100 &&
      predatorPosition.y! > preyPosition.y! + 100 &&
      onGround // if the ground is changed to an image change blocked to touching
    ) {
      // && this.sprite.body.touching.down
      this.jump()
      return
    } 
    
    if (preyPosition.x! > predatorPosition.x! && onGround) {
      this.runRight()
      return
    } 
    
    if (preyPosition.x! < predatorPosition.x! && onGround) {
      this.runLeft()
      return
    }
  }

  kill (prey: Npc | Player) {
    prey.die()
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

  getAnim () {
    const onGround = this.sprite!.body.blocked.down
    const vx = Math.abs(this.sprite!.body.velocity.x)

    if (!onGround) return `${this.asset}-jump`
    if (vx === CHASE_SPEED) return `${this.asset}-run`
    if (vx) return `${this.asset}-walk`
    else return `${this.asset}-stand`
  }
}
