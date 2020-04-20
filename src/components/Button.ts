import Phaser from 'phaser'
  
export class TextButton extends Phaser.GameObjects.Text {
  constructor (scene: Phaser.Scene, x: integer, y: integer, text: string, style: any) {
    super(scene, x, y, text, style)

    this.setScrollFactor(0)

    this.setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.enterButtonHoverState())
      .on('pointerout', () => this.enterButtonRestState())
      .on('pointerdown', () => this.enterButtonActiveState())
      .on('pointerup', () => this.enterButtonHoverState())
  }

  enterButtonHoverState () {
    this.setStyle({ fill: '#fff' })
  }

  enterButtonRestState () {
    this.setStyle({ fill: '#000' })
  }

  enterButtonActiveState () {
    this.setStyle({ fill: '#fff' })
  }
}

/*

const stats = this.add.text(400, 440, `Speed: ${this.player.stats.speed}   Beauty: ${this.player.stats.beauty}`, {fill: '#000'})
    stats.setScrollFactor(0)

    this.createButtons()
    
pauseMusic () {
    console.log("paused music")
    if (!this.music) return
    this.music.stop() // why u no work?
  }

  private createButtons () {
    const muteButton = new TextButton(this, 500, 10, "Mute", {fill: '#000'})
    muteButton.on('pointerdown', this.pauseMusic.bind(this))

    this.add.existing(muteButton)
  }


*/