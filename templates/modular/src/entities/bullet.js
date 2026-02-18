import {
  vec2, tile
} from "@engine/littlejs.esm";

import data from "../data.json" assert { type: "json" };
import GameObject from "./gameObject";

export default class Bullet extends GameObject {

  constructor(pos) {
    super(pos, vec2(2,3), tile(3,4));
    this.velocity = vec2(0,2);
    this.name = 'bullet';
    this.setCollision();
  }

  update() {
    super.update()
    if (this.pos.y > this.screenY) {
      this.destroy();
    }
  }
}
