/// <reference types="node" />
import Phaser from 'phaser';
import { EventEmitter } from 'events';
export declare class Egg extends EventEmitter {
    private scene;
    private x;
    private y;
    private sprite?;
    constructor(scene: Phaser.Scene, x: number, y: number);
    preload(): void;
    create(): void;
    update(): void;
    hatch(): void;
    getPosition(): Phaser.GameObjects.Sprite;
}
