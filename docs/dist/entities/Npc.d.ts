import { GameScene } from '../GameScene';
export declare class Npc {
    private scene;
    private x;
    private y;
    private asset;
    private sprite?;
    private heartEmitter?;
    private facing;
    private lovin;
    constructor(scene: GameScene, x: number, y: number, asset: string);
    preload(): void;
    create(): void;
    startLovin(): void;
    stopLovin(): void;
    update(): void;
    getPosition(): Phaser.Types.Math.Vector2Like;
    getSprite(): Phaser.Physics.Arcade.Sprite;
    die(): void;
}
