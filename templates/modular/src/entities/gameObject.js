import {
  vec2, clamp, EngineObject
} from "@engine/littlejs.esm";

import data from "../data.json" assert { type: "json" };

export default class GameObject extends EngineObject {
  constructor(pos, size, tileInfo) {
    super(pos, size, tileInfo);

    this.halfSize = this.size.x / 2;
    this.screenX = data.width / data.tileSize / 2 - this.halfSize;
    this.screenY = data.height / data.tileSize / 2 - this.halfSize;
  }

  clampToScreen() {
    this.pos.x = clamp(this.pos.x, -this.screenX, this.screenX);
    this.pos.y = clamp(this.pos.y, -this.screenY, this.screenY);
  }
}

