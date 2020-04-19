import Phaser from 'phaser';
export declare class MateScene extends Phaser.Scene {
    private egg;
    private sliders;
    private components;
    constructor();
    preload(): void;
    onFade(_: Phaser.Cameras.Scene2D.Camera, progress: number): void;
    create(): void;
    update(): void;
}
