import Phaser from 'phaser'
import { GameScene } from '../GameScene'

const BORDER = 1
const WIDTH = 150
const HEIGHT = 80
export const MAP_WIDTH = 300 * 32
export const MAP_HEIGHT = 160 * 32

export class MinimapCamera {
  private camera?: Phaser.Cameras.Scene2D.Camera
  private blip?: Phaser.Cameras.Scene2D.Camera

  constructor (
    private scene: GameScene,
    private x: number,
    private y: number
  ) {}

  preload () {
    return
  }

  create () {
    const rect = this.scene.add.rectangle(
      this.x + WIDTH / 2,
      this.y + HEIGHT / 2,
      WIDTH + BORDER * 2,
      HEIGHT + BORDER * 2,
      0,
      1
    )

    rect.setDepth(151)
    rect.setScrollFactor(0)

    this.camera = this.scene.cameras.add(this.x, this.y, WIDTH, HEIGHT)
    this.camera.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT)
    this.camera.setZoom(WIDTH / MAP_WIDTH)
    this.camera.setName('mini')
    this.camera.setBackgroundColor('#a6dbed')

    // black magic: making the blip a camera lets us render over minimap camera
    this.scene.add.rectangle(-5, -5, 10, 10, 0xff0000)
    this.blip = this.scene.cameras.add(0, 0, 4, 4)
    this.blip.setBounds(-10, -10, 10, 10)
  }

  update () {
    if (!this.blip) return

    const { x: px, y: py } = this.scene.getPlayer().getSprite()
    this.blip.setPosition(
      this.x - 2 + Math.floor(WIDTH * (px / MAP_WIDTH)),
      this.y - 2 + Math.floor(HEIGHT * (py / MAP_HEIGHT))
    )
  }
}
