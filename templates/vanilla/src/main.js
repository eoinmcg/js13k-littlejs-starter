import data from "./data.json" assert { type: "json" };
import Player from "./entities/player";
import Baddie from "./entities/baddie";
import Starfield from "./starfield";
import { tune } from "./tune.js";

document.title = data.title;

// uncomment to if you experience tile bleed
// tileFixBleedScale = 0.5;

// uncomment to hide fps counter at top of screen
// setShowWatermark(false)

// setup onscreen gamepad for touch devices
touchInputInit();
setTouchGamepadEnable(true);
setTouchGamepadSize(50);
setTouchGamepadAnalog(false);


let player, font;
let score = 0;
let gameOver = 0;
let ready = false;
const music = new Music(tune);

const sfx = {}
Object.keys(data.sfx).forEach((key) => {
  sfx[key] = new Sound(data.sfx[key].split(','));
});
window.sfx = sfx;

const updateScore = (val = 10) => (score += val);
const setGameOver = (val) => {
  gameOver = val;
  music.stop();
};
const startGame = (opts) => {
  clearInput();
  setGameOver(false);
  player = new Player({sfx, setGameOver});
  music.play();
  score = 0;
};

function gameInit() {
  const gameSize = vec2(data.width, data.height);
  setCanvasFixedSize(gameSize);
  setCanvasMaxSize(gameSize);
  setCameraScale(data.tileSize);

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
  data.center = vec2(0)

  // splash screen
  if (!ready) {
    const center = data.width / 2;
    drawRect(vec2(0), vec2(data.width, data.height), new Color().setHex("#333"));
    font.drawTextScreen(data.title, vec2(center, data.height / 3), 2, true);

    // example of drawing a tile that is 8x8 rather than
    // the default 4x4 that we defined in data.json
    drawTile(
      vec2(0), // position
      vec2(10), // size
      tile(2, 8), // 2 = tile frame,  8 = tile size
    );

    if (flash)
      font.drawTextScreen("READY?", vec2(center, data.height / 1.5), 1.5, true);

    return;
  }

  font.drawTextScreen(String(score).padStart(5, "0"), vec2(160, 20), 2, true);

  if (gameOver && flash) {
    font.drawTextScreen("Game Over", vec2(150, data.height / 2), 3, true);
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
  if (ready) {
    Starfield(gameOver, mainContext);
  }
}


engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, [
  data.tiles,
]);
