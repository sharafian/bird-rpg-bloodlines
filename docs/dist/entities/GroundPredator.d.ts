import { GameScene } from '../GameScene';
import { Player } from './Player';
import { Npc } from './Npc';
export declare class GroundPredator {
    private scene;
    private x;
    private y;
    private asset;
    private sprite?;
    private size;
    private facing;
    constructor(scene: GameScene, x: number, y: number, asset: string, size: number);
    preload(): void;
    create(): void;
    update(): void;
    isClose(prey: Npc | Player, distance: number): boolean;
    prowl(): void;
    runLeft(): void;
    runRight(): void;
    jump(): void;
    stop(): void;
    attack(prey: Npc | Player): void;
    kill(prey: Npc | Player): void;
    getPosition(): Phaser.Types.Math.Vector2Like;
    getSprite(): Phaser.Physics.Arcade.Sprite;
}
