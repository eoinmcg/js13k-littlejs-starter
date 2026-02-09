"use strict";

import D from "./data";
import Player from "./entities/player";
import Baddie from "./entities/baddie";
import { starfield } from "./entities/starfield";
import { tune } from "./tune.js";

document.title = D.title;

// uncomment to if you experience tile bleed
// tileFixBleedScale = .5;

// uncomment to hide fps counter at top of screen
// setShowWatermark(false)

// object to hold all sfx
const sfx = {};
// add sfx from data.
Object.keys(D.sfx).forEach((key) => {
  sfx[key] = new Sound(D.sfx[key]);
});

// setup onscreen gamepad for touch devices
touchInputInit();
touchGamepadEnable = true;
setTouchGamepadSize(50);
setTouchGamepadAnalog(false);

let player, font;
let score = 0;
let gameOver = 0;
let ready = false;
const music = tune;

const updateScore = (val = 10) => (score += val);
const setGameOver = (val) => {
  gameOver = val;
  music.stop();
};
const startGame = (opts) => {
  setGameOver(false);
  player = new Player(opts);
  music.play();
  score = 0;
};

function gameInit() {
  const gameSize = vec2(D.width, D.height);
  setCanvasFixedSize(gameSize);
  setCanvasMaxSize(gameSize);

  D.size = vec2(D.width / D.tileSize, D.height / D.tileSize);
  D.center = vec2(D.size.x / 2, D.size.y / 2);
  setCameraPos(D.center);
  cameraScale = D.tileSize;

  // built in pixel font
  font = new FontImage();
}

function gameUpdate() {
  const clicked =
    keyWasPressed("Space") || keyWasPressed("KeyX") || gamepadWasPressed(2);

  // start game for first time
  if (!ready && clicked) {
    ready = true;
    startGame({ sfx, setGameOver });
  }

  // restart game only if 1sec since game over
  if (gameOver && clicked && time > gameOver + 1) {
    startGame({ sfx, setGameOver });
  }

  // randomly spawn baddie
  if (!gameOver && ready && Math.random() > 0.991) {
    new Baddie(player, { sfx, updateScore });
  }
}

function gameUpdatePost() {}

function gameRender() {
  const flash = Math.sin(Date.now() * 0.005) > 0;

  // splash screen
  if (!ready) {
    const center = D.width / 2;
    drawRect(D.center, D.size, new Color().setHex("#111"));
    font.drawTextScreen(D.title, vec2(center, D.height / 3), 2.2, true);

    // example of drawing a tile that is 8x8 rather than
    // the default 4x4 that we defined in data.js
    drawTile(
      D.center, // position
      vec2(10), // size
      tile(2, 8), // 2 = tile frame,  8 = tile size
    );

    if (flash)
      font.drawTextScreen("READY?", vec2(center, D.height / 1.5), 1.5, true);

    return;
  }

  font.drawTextScreen(String(score).padStart(5, "0"), vec2(160, 20), 2, true);

  if (gameOver && flash) {
    font.drawTextScreen("Game Over", vec2(150, D.height / 2), 3, true);
    return;
  }
}

function gameRenderPost() {
  // draw to overlay canvas for hud rendering
  drawTextScreen(
    "LittleJS JS13K Demo",
    vec2(mainCanvasSize.x / 2, mainCanvasSize.y - 15),
    15,
  );
  if (ready) starfield(gameOver);
}

engineInit(
  gameInit,
  gameUpdate,
  gameUpdatePost,
  gameRender,
  gameRenderPost,
  D.tiles,
);
