// data.json can contain all game settings
import data from "./data.json" assert { type: "json" };

// import everything
import * as LJ from "@engine/littlejs.esm";

// or choose just the stuff you need
import {
  vec2,
  tile,
  mainCanvasSize,
  setTileDefaultBleed,
  drawTile,
  engineInit,
} from "@engine/littlejs.esm";

import Player from "./entities/player";

setTileDefaultBleed(0.5);

let player;

function gameInit() {
  player = new Player(vec2(0, 2), vec2(1));
}

function gameUpdate() {}

function gameUpdatePost() {}

function gameRender() {
  LJ.drawTextScreen(
    "LittleJS JS13K Demo",
    vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2),
    25,
  );

  // draw a tile
  drawTile(vec2(0, -5), vec2(3), tile(2, 8));
}

function gameRenderPost() {}

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, [
  data.tiles,
]);
