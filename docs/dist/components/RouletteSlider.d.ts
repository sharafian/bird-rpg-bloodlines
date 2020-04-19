import Phaser from 'phaser';
export declare class RouletteSlider {
    private scene;
    private x;
    private y;
    private lowerBound;
    private upperBound;
    private selectangle?;
    private width;
    private height;
    private speed;
    private stopped;
    constructor(scene: Phaser.Scene, x: number, y: number, lowerBound: number, upperBound: number);
    preload(): void;
    private positionToX;
    private addMark;
    getBody(): Phaser.Physics.Arcade.Body;
    create(): void;
    update(): void;
    getPosition(): {
        x: number;
        y: number;
    };
    stop(): void;
}
