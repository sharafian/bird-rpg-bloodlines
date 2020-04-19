/// <reference types="node" />
import Phaser from 'phaser';
import { EventEmitter } from 'events';
export declare class Player extends EventEmitter {
    private scene;
    private x;
    private y;
    private sprite?;
    private cursors?;
    private flapping;
    private singing;
    private lovin;
    private facing;
    constructor(scene: Phaser.Scene, x: number, y: number);
    preload(): void;
    create(): void;
    startLovin(): void;
    stopLovin(): void;
    update(): void;
    private isFlying;
    private getAnim;
    getPosition(): Phaser.Physics.Arcade.Sprite;
    die(): void;
    getSprite(): Phaser.Physics.Arcade.Sprite;
}
