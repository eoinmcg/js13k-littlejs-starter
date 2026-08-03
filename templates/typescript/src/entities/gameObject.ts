import {
  vec2, clamp, EngineObject,
} from "@engine/littlejs.esm";
import type { Vector2, TileInfo } from "@engine/littlejs.esm";
import data from "../data.json";

export default class GameObject extends EngineObject {
  halfSize: number;
  screenX: number;
  screenY: number;
  name: string = '';

  constructor(pos: Vector2, size: Vector2, tileInfo: TileInfo) {
    super(pos, size, tileInfo);
    this.halfSize = this.size.x / 2;
    this.screenX = data.width / data.tileSize / 2 - this.halfSize;
    this.screenY = data.height / data.tileSize / 2 - this.halfSize;
  }

  clampToScreen(): void {
    this.pos.x = clamp(this.pos.x, -this.screenX, this.screenX);
    this.pos.y = clamp(this.pos.y, -this.screenY, this.screenY);
  }
}
