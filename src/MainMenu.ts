import Phaser from 'phaser'

export class MainMenu extends Phaser.Scene {
  private selection = 0

  private menuY = 380
  private menuRowHeight = 30
  private menuItems = [
    { title: 'Start', scene: 'game-scene' },
    { title: 'Controls', scene: 'about-menu' }
  ]

  constructor () {
    super('main-menu')
  }

  preload () {
    this.load.image('title', 'assets/title.png')
    this.load.audio('menu', [
      'assets/audio/bird_rave.mp3'
    ])
  }

  create () {

    const itemStyle = {
      color: 'white',
      fontSize: '24px'
    }

    const music = this.sound.add('menu')

    music.play()
    this.events.on('shutdown', () => {
      music.stop()
    })

    // this.add.text(100, 100, 'Bird RPG: Bloodlines', headerStyle)
    this.add.image(400, 250, 'title')

    for (let i = 0; i < this.menuItems.length; ++i) {
      const item = this.menuItems[i]
      this.add.text(100, this.menuY + i * this.menuRowHeight, item.title, itemStyle)
    }

    const cursors = this.input.keyboard.createCursorKeys()
    const selectangle = this.add.rectangle(
      250,
      this.menuY + this.selection * this.menuRowHeight + 15,
      300,
      27,
      0xffffff,
      0.5
    )

    const updateSelect = () => {
      selectangle.setY(this.menuY + this.selection * this.menuRowHeight + 15)
    }

    cursors.up?.on('down', () => {
      this.selection = Math.max(this.selection - 1, 0)
      updateSelect()
    })

    cursors.down?.on('down', () => {
      this.selection = Math.min(this.selection + 1, 1)
      updateSelect()
    })

    const enterKey = this.input.keyboard.addKey('ENTER')

    enterKey.on('up', () => {
      this.scene.start(this.menuItems[this.selection].scene, { new: true })
    })

    this.events.on('shutdown', () => {
      enterKey.removeAllListeners()
      cursors.up?.removeAllListeners()
      cursors.down?.removeAllListeners()
      cursors.left?.removeAllListeners()
      cursors.right?.removeAllListeners()
    })
  }
}
