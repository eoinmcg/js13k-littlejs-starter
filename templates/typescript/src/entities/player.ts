import {
  vec2,
  tile,
  time,
  keyIsDown, keyWasPressed,
  gamepadStick, gamepadWasPressed, isUsingGamepad,
} from "@engine/littlejs.esm";
import data from "../data.json";
import GameObject from "./gameObject";
import Bullet from "./bullet";
import type { Sound } from "@engine/littlejs.esm";

type SfxMap = Record<string, Sound>;

interface PlayerOpts {
  sfx: SfxMap;
  setGameOver: (val: number) => void;
}

export default class Player extends GameObject {
  speed: number;
  animTime: number;
  shoot: boolean = false;
  sfx: SfxMap;
  setGameOver: (val: number) => void;

  constructor({ sfx, setGameOver }: PlayerOpts) {
    super(vec2(0), vec2(4), tile(0, 4));
    this.speed = .8;
    this.animTime = 0;
    this.setGameOver = setGameOver;
    this.sfx = sfx;
    this.setCollision();
    this.name = "p1";
  }

  update(): void {
    super.update();

    if (this.velocity.x !== 0) {
      this.tileInfo!.pos.x = data.tileSize * 2;
      this.mirror = this.velocity.x > 0;
    } else {
      const idleFrame = Math.sin(time * 20) > 0 ? 0 : data.tileSize;
      this.tileInfo!.pos.x = idleFrame;
    }

    this.velocity = isUsingGamepad
      ? gamepadStick(0)
      : vec2(
        Number(keyIsDown("ArrowRight")) - Number(keyIsDown("ArrowLeft")),
        Number(keyIsDown("ArrowUp")) - Number(keyIsDown("ArrowDown")),
      );

    this.shoot =
      keyWasPressed("Space") || keyWasPressed("KeyX") || gamepadWasPressed(2);

    if (this.shoot) {
      new Bullet(this.pos);
      this.sfx.shoot.play();
    }

    this.velocity = this.velocity.scale(this.speed);
    this.clampToScreen();
  }

  destroy(): void {
    super.destroy();
    this.setGameOver(time);
  }
}
