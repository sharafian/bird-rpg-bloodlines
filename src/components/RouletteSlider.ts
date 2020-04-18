import Phaser from 'phaser'

export class RouletteSlider {
  private selectangle?: Phaser.GameObjects.GameObject
  private width = 300
  private height = 25
  private speed = 200
  private stopped = false

  constructor (
    private scene: Phaser.Scene,
    private x: number,
    private y: number,
    private lowerBound: number,
    private upperBound: number
  ) {}

  preload () {}

  private positionToX (position: number) {
    return this.x - (this.width / 2) + this.width * position
  }

  private addMark (position: number, color: number): Phaser.GameObjects.Rectangle {
    return this.scene.add.rectangle(
      this.positionToX(position),
      this.y,
      6,
      this.height,
      color
    )
  }

  getBody () {
    if (!this.selectangle) {
      throw new Error('no selection')
    }

    return this.selectangle.body as Phaser.Physics.Arcade.Body
  }

  create () {
    this.scene.add.rectangle(this.x, this.y, this.width, this.height, 0xffffff)

    const startingPos = this.lowerBound + Math.random() * (this.upperBound - this.lowerBound)
    const rect = this.addMark(startingPos, 0x00ff00)
    this.selectangle = this.scene.physics.add.existing(rect, false)
    this.getBody().setAllowGravity(false)
    this.getBody().setVelocityX((Math.random() < 0.5) ? -this.speed : this.speed)

    this.addMark(this.lowerBound, 0xff44444)
    this.addMark(this.upperBound, 0x44444ff)
  }

  update () {
    if (!this.selectangle) {
      return
    } else if (this.stopped) {
      this.getBody().setVelocityX(0)
    } else if (this.getBody().x <= this.positionToX(this.lowerBound)) {
      this.getBody().setVelocityX(this.speed)
    } else if (this.getBody().x >= this.positionToX(this.upperBound)) {
      this.getBody().setVelocityX(-this.speed)
    }
  }

  getPosition () {
    return { x: this.x, y: this.y }
  }

  stop () {
    this.stopped = true
  }
}
