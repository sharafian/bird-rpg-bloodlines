import Phaser from 'phaser'

export class MainMenu extends Phaser.Scene {
  private selection = 0

  private menuY = 250
  private menuRowHeight = 30
  private menuItems = [
    { title: 'Start Campaign', scene: 'game-scene' },
    { title: 'About', scene: 'about-menu' }
  ]

  constructor () {
    super('main-menu')
  }

  create () {
    const headerStyle = {
      color: 'white',
      fontSize: '36px'
    }

    const itemStyle = {
      color: 'white',
      fontSize: '24px'
    }

    this.add.text(100, 100, 'Bird RPG: Bloodlines', headerStyle)

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
      this.scene.start(this.menuItems[this.selection].scene)
    })

    this.events.on('shutdown', () => {
      enterKey.destroy()
      cursors.up?.destroy()
      cursors.down?.destroy()
      cursors.left?.destroy()
      cursors.right?.destroy()
    })
  }
}
