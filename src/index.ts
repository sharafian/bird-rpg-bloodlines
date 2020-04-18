import Phaser from 'phaser'

import { GameScene } from './GameScene'

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scene: [ GameScene ]
}

const game = new Phaser.Game(config)
export default game
