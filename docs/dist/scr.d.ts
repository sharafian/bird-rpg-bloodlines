import Phaser from 'phaser';
export declare class GameScene extends Phaser.Scene {
    player: any;
    cursors: any;
    constructor();
    preload(): void;
    create(): void;
    update(): void;
    generateMap(): void;
}
