import Phaser from 'phaser'

const AboutText = `
You are a horny finch.

Use the ARROW KEYS to fly around

Press Z to woo your lady

Hit ENTER to return to the 
main menu

Find mates to have better 
stats in each generation

Keep your bloodline alive 
as long as possible!
`

export class AboutMenu extends Phaser.Scene {
  private menuY = 80

  constructor () {
    super('about-menu')
  }

  preload () {
    this.load.image('titlenotext', 'assets/titlenotext.png')
  }

  create () {
    this.add.image(400, 250, 'titlenotext')

    const headerStyle = {
      color: 'black',
      fontSize: '36px'
    }

    const itemStyle = {
      color: 'black',
      fontSize: '20px'
    }

    this.add.text(60, this.menuY - 40, 'How to play', headerStyle)
    this.add.text(60, this.menuY, AboutText, itemStyle)

    const enterKey = this.input.keyboard.addKey('ENTER')

    enterKey.on('up', () => {
      this.scene.start('main-menu')
    })

    this.events.on('shutdown', () => {
      enterKey.removeAllListeners()
    })
  }
}
