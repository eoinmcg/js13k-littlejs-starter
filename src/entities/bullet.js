import D from '../data'

export default class Bullet extends EngineObject {
  constructor(pos, size = 4) {
    super(pos, vec2(3, 6), tile(3, size));

    this.name='bullet';

    this.setCollision();

    this.maxY = (D.height / D.tileSize);
    this.speed = 2;
  }

  update() {
    super.update();

    this.pos.y += this.speed;

    if (this.pos.y > this.maxY) {
      this.destroy();
    }
  }
}
