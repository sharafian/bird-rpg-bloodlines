import Phaser from 'phaser'

const AboutText = `
Here is some text about the game and how
to play it.

Use the arrow keys to move, and hit up to
fly. You need to find your mate to keep
your bloodline alive

Hit ENTER to return to the main menu`

export class AboutMenu extends Phaser.Scene {
  private menuY = 150

  constructor () {
    super('about-menu')
  }

  create () {
    const headerStyle = {
      color: 'white',
      fontSize: '36px'
    }

    const itemStyle = {
      color: 'white',
      fontSize: '16px'
    }

    this.add.text(100, 100, 'About', headerStyle)
    this.add.text(100, this.menuY, AboutText, itemStyle)

    const enterKey = this.input.keyboard.addKey('ENTER')

    enterKey.on('up', () => {
      this.scene.start('main-menu')
    })

    this.events.on('shutdown', () => {
      enterKey.destroy()
    })
  }
}
