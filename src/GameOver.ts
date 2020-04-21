import Phaser from 'phaser'

export class GameOver extends Phaser.Scene {

  constructor () {
    super('game-over')
  }

  preload () {
      this.load.image('game-over', 'assets/gameover.png')

      this.load.audio('loss', [
        'assets/audio/bird_loss.mp3'
      ])
  }

  create () {
    const music = this.sound.add('loss')

    music.play()
    this.events.on('shutdown', () => {
      music.stop()
    })
    

    this.add.image(320, 240, 'game-over')

    const style = {
        color: 'white',
        fontSize: '20px',
        align: 'center'
      }
    this.add.text(250, 400, "Press ENTER", style)

    const enterKey = this.input.keyboard.addKey('ENTER')

    enterKey.on('up', () => {
      this.scene.start('main-menu')
    })

    this.events.on('shutdown', () => {
      enterKey.removeAllListeners()
    })
  }
}
