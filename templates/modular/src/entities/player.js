import { EngineObject, tile, timeDelta } from "@engine/littlejs.esm";
export default class Player extends EngineObject {
  constructor(pos, size) {
    super(pos, size, tile(0, 4));
  }

  update() {
    super.update();
    this.angle += timeDelta;
  }
}
