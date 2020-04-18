import Phaser from 'phaser'

import { GameScene } from './GameScene'
import { MainMenu } from './MainMenu'
import { AboutMenu } from './AboutMenu'

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
  scene: [
    MainMenu,
    AboutMenu,
    GameScene
  ]
}

const game = new Phaser.Game(config)
export default game
