import { GameScene, BIRD_SIZE } from '../GameScene'

export default class Npc {
  private scene: GameScene
  private x: number
  private y: number

  constructor (scene: GameScene, x: number, y: number) {
    this.scene = scene
    this.x = x
    this.y = y
  }

  preload () {
    this.scene.load.spritesheet('npc', 'assets/birb.png', {
      frameWidth: BIRD_SIZE,
      frameHeight: BIRD_SIZE
    })
  }

  create () {
    this.scene.physics.add.sprite(this.x, this.y, 'npc')
  }

  update () {
    // no-op
  }
}
