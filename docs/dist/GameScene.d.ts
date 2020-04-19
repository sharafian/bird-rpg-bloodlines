import Phaser from 'phaser';
import { Npc } from './entities/Npc';
import { Player } from './entities/Player';
export declare const BIRD_SIZE = 50;
export declare const MATING_RANGE = 150;
export declare const TILE_SIZE = 32;
export declare class GameScene extends Phaser.Scene {
    private player;
    private NPCs;
    private predators;
    private entities;
    constructor();
    preload(): void;
    onFade(_: Phaser.Cameras.Scene2D.Camera, progress: number): void;
    create(): void;
    createEnvironment(): void;
    update(): void;
    closestBirb(): Npc | void;
    getPlayer(): Player;
}
