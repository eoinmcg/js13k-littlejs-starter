tileFixBleedScale = 0.5;

function gameInit() {}

function gameUpdate() {}

function gameUpdatePost() {}

function gameRender() {
  drawTextScreen(
    "LittleJS JS13K Demo",
    vec2(mainCanvasSize.x / 2, mainCanvasSize.y / 2),
    25,
  );

  // draw a tile
  drawTile(vec2(0, -5), vec2(3), tile(2, 8));
}

function gameRenderPost() {}

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, [
  "/t.gif",
]);
