import Phaser from 'phaser'

export class GameScene extends Phaser.Scene {
  constructor () {
    super('game-scene')
  }

  preload (this: Phaser.Scene) {
    this.load.image('sky', 'assets/sky.png')
  }

  create (this: Phaser.Scene) {
    this.add.image(400, 300, 'sky')
    this.add.text(0, 150, 'Hello Typescript', {
      color: 'red',
      fontSize: '30px',
      align: 'center'
    })
  }
}
