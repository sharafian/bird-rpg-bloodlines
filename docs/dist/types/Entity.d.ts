import Phaser from 'phaser';
export interface Entity {
    preload(): void;
    create(): void;
    update(): void;
    getPosition(): void;
}
export interface PhysicsEntity extends Entity {
    getSprite(): Phaser.Physics.Arcade.Sprite;
}
