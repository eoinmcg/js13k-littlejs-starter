import data from "../data.json" assert { type: "json" };
import GameObject from "./gameObject";
import Bullet from "./bullet";

export default class Player extends GameObject {
  constructor({sfx, setGameOver}) {
    super(vec2(0), vec2(4), tile(0, 4));
    this.speed = .8;

    this.animTime = 0;

    this.setGameOver = setGameOver;
    this.sfx = sfx;

    this.setCollision();
    this.name = "p1";
  }

  update() {
    super.update();

    if (this.velocity.x !== 0) {
      this.tileInfo.pos.x = data.tileSize * 2;
      this.mirror = this.velocity.x > 0;
    } else {
      // Oscillate between frame 0 and 1 using sine wave
      const idleFrame = Math.sin(time * 20) > 0 ? 0 : data.tileSize;
      this.tileInfo.pos.x = idleFrame;
    }
    this.velocity = isUsingGamepad
      ? gamepadStick(0)
      : vec2(
          keyIsDown("ArrowRight") - keyIsDown("ArrowLeft"),
          keyIsDown("ArrowUp") - keyIsDown("ArrowDown"),
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

  destroy() {
    super.destroy();
    this.setGameOver(time);
  }
}
