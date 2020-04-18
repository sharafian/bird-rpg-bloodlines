import Phaser from 'phaser'

import { GameScene } from './GameScene'
import { AboutMenu } from './AboutMenu'
import { MainMenu } from './MainMenu'

const ZOOM = 2

const config = {
  type: Phaser.AUTO,
  pixelArt: true,
  
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 200,
    height: 150,
    zoom: ZOOM,
    max: {
      width: 400,
      height: 300
    }
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scene: [ MainMenu, GameScene, AboutMenu ]
}

const game = new Phaser.Game(config)
export default game
