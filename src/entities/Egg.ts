import Phaser from 'phaser'

export class Egg {
  private sprite?: Phaser.GameObjects.Sprite

  constructor (
    private scene: Phaser.Scene,
    private x: number,
    private y: number
  ) {}

  preload () {
    this.scene.load.spritesheet('hatch', 'assets/hatch.png', {
      frameWidth: 16,
      frameHeight: 16
    })
  }

  create () {
    this.scene.anims.create({
      key: 'hatch',
      frameRate: 10,
      frames: this.scene.anims.generateFrameNumbers('hatch', {
        start: 0,
        end: 16
      })
    })

    this.sprite = this.scene.add.sprite(this.x, this.y, 'hatch')
    this.sprite.setScale(4, 4)
  }

  update () {
  }

  hatch () {
    this.sprite?.anims.play('hatch')
  }

  getPosition () {
    if (!this.sprite) {
      throw new Error('no sprite')
    }

    return this.sprite
  }
}
