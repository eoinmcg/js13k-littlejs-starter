import data from "../data.json" assert { type: "json" };
import GameObject from "./gameObject"

export default class Baddie extends GameObject {
  constructor(player, { sfx, updateScore }) {
    const size = 5;
    let screenWidth = (data.width / data.tileSize) / 2;
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

  update() {
    super.update();

    // simple anim by flipping between two frames using a sine wave.
    const frame = Math.sin(Date.now() * 0.02) > 0 ? 0 : data.tileSize;
    this.tileInfo.pos.x = frame;

    if (!this.player) return;
    // change direction based on player position
    const buffer = this.size.x / 2;
    if (this.pos.x > this.player.pos.x + buffer) {
      this.mirror = true;
    } else if (this.pos.x < this.player.pos.x - buffer) {
      this.mirror = false;
    }
    this.velocity.x = this.mirror ? -this.speedX : this.speedX;

    // remove if offscreen
    if (this.pos.y < -this.screenY) {
      this.destroy();
    }
  }

  collideWithObject(o) {
    if (o.name === "p1" || o.name === "bullet") {
      this.destroy();
      o.destroy();

      this.updateScore();

      this.sfx.explosion.play();

      // create particle effects here:
      // https://killedbyapixel.github.io/LittleJS/examples/particles/
      const color = new Color(); // white
      const color2 = new Color(1, 0, 0); // red
      new ParticleEmitter(
        this.pos,
        0.2, // pos, angle
        vec2(this.size.x * 2),
        0.1,
        2000,
        PI, // emitSize, emitTime, emitRate, emiteCone
        tile(7, 4), // tileInfo
        color,
        color2, // colorStartA, colorStartB
        color.scale(1, 0),
        color2.scale(1, 0), // colorEndA, colorEndB
        0.3,
        1,
        5,
        0.1,
        0.1, // time, sizeStart, sizeEnd, speed, angleSpeed
        0.99,
        0.95,
        0.4,
        PI, // damping, angleDamping, gravityScale, cone
        0.1,
        0.75,
        0,
        1, // fadeRate, randomness, collide, additive
      );
    }
  }
}
