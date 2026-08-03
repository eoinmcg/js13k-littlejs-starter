import {
  vec2,
  tile,
  rand,
  time, isUsingGamepad, Color, ParticleEmitter, PI,
} from "@engine/littlejs.esm";
import data from "../data.json";
import GameObject from "./gameObject";
import Player from "./player";
import type { Sound } from "@engine/littlejs.esm";

type SfxMap = Record<string, Sound>;

interface BaddieOpts {
  sfx: SfxMap;
  updateScore: (val?: number) => void;
}

export default class Baddie extends GameObject {
  player: Player;
  sfx: SfxMap;
  updateScore: (val?: number) => void;
  speedX: number;

  constructor(player: Player, { sfx, updateScore }: BaddieOpts) {
    const size = 5;
    const screenWidth = (data.width / data.tileSize) / 2;
    const startPos = vec2(rand(-screenWidth, screenWidth), data.height / data.tileSize);
    super(startPos, vec2(size), tile(5, 4));
    this.player = player;
    this.sfx = sfx;
    this.updateScore = updateScore;
    this.name = 'baddie';
    this.setCollision();
    this.speedX = rand(0.1, 0.25);
    this.velocity = vec2(0.1, rand(-1, -2));
  }

  update(): void {
    super.update();

    const frame = Math.sin(Date.now() * 0.02) > 0 ? 0 : data.tileSize;
    this.tileInfo!.pos.x = frame;

    if (!this.player) return;

    const buffer = this.size.x / 2;
    if (this.pos.x > this.player.pos.x + buffer) {
      this.mirror = true;
    } else if (this.pos.x < this.player.pos.x - buffer) {
      this.mirror = false;
    }
    this.velocity.x = this.mirror ? -this.speedX : this.speedX;

    // remove if offscreen
    if (this.pos.y < -(data.height / data.tileSize)) {
      this.destroy();
    }
  }

  collideWithObject(o: GameObject): boolean {
    if (o.name === "p1" || o.name === "bullet") {
      this.destroy();
      o.destroy();
      this.updateScore();
      this.sfx.explosion.play();

      const color = new Color();
      const color2 = new Color(1, 0, 0);
      new ParticleEmitter(
        this.pos,
        0.2,
        vec2(this.size.x * 2),
        0.1,
        2000,
        PI,
        tile(7, 4),
        color,
        color2,
        color.scale(1, 0),
        color2.scale(1, 0),
        0.3,
        1,
        5,
        0.1,
        0.1,
        0.99,
        0.95,
        0.4,
        PI,
        0.1,
        0.75,
        false,
        true,
      );
    }
    return true;
  }
}
