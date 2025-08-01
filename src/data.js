/**
 * Data - Game configuration and assets.
 * This file contains global game data, including game
 * dimensions, asset paths, and sound effect definitions.
 */
const Data = {
  title: 'Starter Template', // this will be injected into document.title
  width: 320, height: 480, // mobile portratit
  tiles: ['t.gif'], // tiles are located in public/
  tileSize: 4, // this matches the size of the tiles in t.gif
  sfx: { // create effects here: https://killedbyapixel.github.io/ZzFX/
    click: [1,.5],
    shoot: [,,90,,.01,.03,4,,,,,,,9,50,.2,,.2,.01],
    explosion: [2,.2,72,.01,.01,.2,4,,,,,,,1,,.5,.1,.5,.02],
  }
}

export default Data;
