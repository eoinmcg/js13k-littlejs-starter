import D from "../data";

export default class Baddie extends EngineObject {
  constructor(player, { sfx, updateScore }) {
    const size = 6;
    const startPos = vec2(rand(0, D.width / D.tileSize), D.height / D.tileSize);
    super(startPos, vec2(size), tile(5, 4));
    this.player = player;
    this.sfx = sfx;
    this.updateScore = updateScore;

    this.setCollision();

    this.speedX = rand(0.1, 0.25);
    this.velocity = vec2(0.1, rand(-1, -2));
  }

  update() {
    super.update();

    // simple anim by flipping between two frames using a sine wave.
    const frame = Math.sin(Date.now() * 0.02) > 0 ? 0 : D.tileSize;
    this.tileInfo.pos.x = frame;

    // change direction based on player position
    const buffer = this.size.x / 2;
    if (this.pos.x > this.player.pos.x + buffer) {
      this.mirror = true;
    } else if (this.pos.x < this.player.pos.x - buffer) {
      this.mirror = false;
    }
    this.velocity.x = this.mirror ? -this.speedX : this.speedX;

    // remove if offscreen
    if (this.pos.y < -this.size.y) {
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
