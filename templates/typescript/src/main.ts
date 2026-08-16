// import everything
import * as LJS from "@engine/littlejs.esm";

// or choose just the stuff you need
import {
  vec2,
  time,
  tile,
  mainCanvasSize,
  drawTile,
  engineInit,
  keyWasPressed,
  gamepadWasPressed,
  Color,
  drawRect,
  drawTextScreen,
  Music, Sound, FontImage
} from "@engine/littlejs.esm";


import data from "./data.json";
import Player from "./entities/player";
import Baddie from "./entities/baddie";
import Starfield from "./starfield";
import { tune } from "./tune.js";
import { ZzFXMusic } from "littlejs-js13k";

document.title = data.title;

// uncomment to if you experience tile bleed
LJS.setTileFixBleedScale(.5);

// uncomment to hide fps counter at top of screen
// setShowWatermark(false)

// setup onscreen gamepad for touch devices
LJS.setTouchGamepadEnable(true);
LJS.setTouchGamepadSize(50);
LJS.setTouchGamepadAnalog(false);


let player: Player | undefined;
let score = 0;
let gameOver: number = 0;
let ready = false;
const music = new ZzFXMusic(tune as [any[], any[], any[], number]);

type SfxMap = Record<string, Sound>;
const sfx: SfxMap = {}
Object.keys(data.sfx).forEach((key) => {
  sfx[key] = new Sound(data.sfx[key as keyof typeof data.sfx].split(','));
});

const updateScore = (val: number = 10) => (score += val);
const setGameOver = (val: number) => {
  gameOver = val;
  music.stop();
};

interface GameOpts {
  sfx: SfxMap;
  setGameOver: (val: number) => void;
}
const startGame = (opts: GameOpts): void => {
  LJS.clearInput();
  setGameOver(0);
  player = new Player({ sfx, setGameOver });
  music.play();
  score = 0;
};

function gameInit(): void {
  const gameSize = vec2(data.width, data.height);
  LJS.setCanvasFixedSize(gameSize);
  LJS.setCanvasMaxSize(gameSize);
  LJS.setCameraScale(data.tileSize);
}

function gameUpdate(): void {
  const clicked =
    keyWasPressed("Space") || keyWasPressed("KeyX") || gamepadWasPressed(2);

  // start game for first time
  if (!ready && clicked) {
    ready = true;
    startGame({ sfx, setGameOver });
  }

  // restart game only if 1sec since game over
  if (gameOver && clicked && LJS.time > gameOver + 1) {
    startGame({ sfx, setGameOver });
  }

  // randomly spawn baddie
  if (!gameOver && player && ready && Math.random() > 0.991) {
    new Baddie(player, { sfx, updateScore });
  }
}

function gameUpdatePost(): void { }

function gameRender(): void {
  const flash = Math.sin(Date.now() * 0.005) > 0;

  // splash screen
  if (!ready) {
    const center = data.width / 2;
    drawRect(vec2(0), vec2(data.width, data.height), new Color().setHex("#333"));
    drawTextScreen(data.title, vec2(center, data.height / 3), 20, WHITE, 1, BLACK);

    // example of drawing a tile that is 8x8 rather than
    // the default 4x4 that we defined in data.json
    drawTile(
      vec2(0), // position
      vec2(10), // size
      tile(2, 8), // 2 = tile frame,  8 = tile size
    );

    if (flash)
      drawTextScreen("READY?", vec2(center, data.height / 1.5), 15, WHITE);

    return;
  }


  font.drawTextScreen(String(score).padStart(5, "0"), vec2(160, 30), 2, true);

  if (gameOver && flash) {
    drawTextScreen("Game Over", vec2(150, data.height / 2), 30, RED);
    return;
  }
}

function gameRenderPost() {
  // draw to overlay canvas for hud rendering
  if (ready) {
    Starfield(gameOver);
  }
}

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, [
  data.tiles,
]);
