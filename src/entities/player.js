import Bullet from "./bullet";
import D from "../data";

export default class Player extends EngineObject {
  constructor({ sfx, setGameOver }) {
    const size = 6;
    const startPos = vec2(D.width / D.tileSize / 2, D.height / D.tileSize / 2);
    super(startPos, vec2(size), tile(0, 4));
    this.shootSound = sfx.shoot;
    this.setGameOver = setGameOver;

    this.name = "p1";

    this.setCollision();

    this.speed = 1;

    this.halfSize = this.size.x / 2;
    this.maxX = D.width / D.tileSize - this.halfSize;
    this.maxY = D.height / D.tileSize - this.halfSize;
  }

  update() {
    super.update();
    this.velocity = isUsingGamepad
      ? gamepadStick(0)
      : vec2(
          keyIsDown("ArrowRight") - keyIsDown("ArrowLeft"),
          keyIsDown("ArrowUp") - keyIsDown("ArrowDown"),
        );
    this.velocity = this.velocity.scale(this.speed);

    this.shoot =
      keyWasPressed("Space") || keyWasPressed("KeyX") || gamepadWasPressed(2);

    let frame = this.velocity.x !== 0 ? D.tileSize * 2 : 0;
    this.tileInfo.pos.x = frame;
    this.mirror = this.velocity.x > 0;

    this.pos.x = clamp(this.pos.x, this.halfSize, this.maxX);
    this.pos.y = clamp(this.pos.y, this.halfSize, this.maxY);

    if (this.shoot) {
      new Bullet(this.pos);
      this.shootSound.play();
    }
  }

  destroy() {
    super.destroy();
    this.setGameOver(time);
  }
}
