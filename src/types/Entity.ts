import Phaser from 'phaser'

export interface Entity {
  preload (): void
  create (): void
  update (): void
  getPosition (): void
  getSprite (): Phaser.Physics.Arcade.Sprite
}
