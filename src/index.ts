import Phaser from 'phaser'

import { GameScene } from './GameScene'

const config = {
  type: Phaser.AUTO,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 100,
    height: 75,
    zoom: 4,
    max: {
      width: 200,
      height: 160
    }
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: false
    }
  },
  scene: [ GameScene ]
}

const game = new Phaser.Game(config)
export default game
