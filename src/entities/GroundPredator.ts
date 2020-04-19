import { GameScene } from '../GameScene'
import { Player } from './Player'
import { Entity } from '../types/Entity'
import { Npc } from './Npc'

const CHASE_DISTANCE = 250
const CHASE_SPEED = 240
const JUMP_POWER = 400

export class GroundPredator {
  private scene: GameScene
  private x: number
  private y: number
  private asset: string
  private sprite?: Phaser.Physics.Arcade.Sprite
  private size: number

  private facing = -1

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

  update () {
    const prey = this.scene.getPlayer()

    if (this.isClose(prey, CHASE_DISTANCE)) {
      console.log("prowling")
      this.prowl()
    } else {
      console.log("attacking")
      this.attack(prey)
    }
  }

  isClose (prey: Npc | Player, distance: number) {
    const selfLocation = this.getPosition()
    const playerLocation = prey.getPosition()
    if (
      Phaser.Math.Distance.BetweenPoints(selfLocation, playerLocation) >
      distance
    ) {
      return true
    } else {
      return false
    }
  }

  prowl () {
    // wander around
    const rand = Math.random()
    // small chance to change direction
    // medium chance to move in facing direction
    // large chance to do nothing
    if (rand > 0 && rand <= 0.02) {
      this.facing = this.facing < 0 ? 1 : -1
    } else if (rand > 0.05 && rand <= 0.2) {
      this.sprite!.setVelocityX(this.facing * 2 * this.size)
    } else {
      this.sprite!.setVelocityX(0)
    }

    this.sprite!.setFlipX(this.facing > 0)
  }

  runLeft () {
    this.sprite!.setVelocityX(-CHASE_SPEED)
  }

  runRight () {
    this.sprite!.setVelocityX(CHASE_SPEED)
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
    //   move in the x direction of prey and jump when reached
    // if bird is above
    if (
      Math.abs(preyPosition.x! - predatorPosition.x!) < 10 &&
      predatorPosition.y! > preyPosition.y! + 100 &&
      this.sprite!.body.blocked.down // if the ground is changed to an image change blocked to touching
    ) {
      // && this.sprite.body.touching.down
      console.log('jump triggered')
      this.jump()
      return
    } 
    
    if (preyPosition.x! > predatorPosition.x!) {
      console.log("this.runRight")
      this.runRight()
      return
    } 
    
    if (preyPosition.x! < predatorPosition.x!) {
      console.log("this.runLeft")
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
}
