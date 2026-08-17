#!/usr/bin/env node

// Adapted from https://github.com/KilledByAPixel/LittleJS/blob/js13k/examples/starter/build.js

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import process from "process";
import fs from "node:fs";
import child_process from "node:child_process";
import chalk from "chalk";
import { chalkError, chalkSuccess } from "./helpers.js";

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Change to the project root (parent of scripts directory)
process.chdir(join(__dirname, ".."));

// Read package.json to know the "mode"
const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));
const mode = pkg.littlejsMode || "vanilla";

// Get game data as we'll need to extract tiles
const dataPath = "./src/data.json";
const Data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

/**
 * LittleJS Build System
 */

("use strict");

const PROGRAM_NAME = "game";
const BUILD_FOLDER = "tmp";
const SIZE_LIMIT = 13312; // JS13K limit in bytes

// Turn off engine features your game does not use to save space.
// Each disabled feature becomes a compile time constant, which lets Closure
// delete the whole subsystem. See "Saving space" in LittleJS's README.md.
const FEATURES = {
  webgl: true, // WebGL renderer, disabling falls back to canvas 2D
  touch: true, // touch input and the on screen touch gamepad
  gamepad: true, // gamepad input
  sound: true, // all audio
  physics: true, // collision response, both object vs object and object vs tile
};

// feature name -> [engine flag, its setter]
const FEATURE_FLAGS = {
  webgl: ["glEnable", "setGLEnable"],
  touch: ["touchInputEnable", "setTouchInputEnable"],
  gamepad: ["gamepadsEnable", "setGamepadsEnable"],
  sound: ["soundEnable", "setSoundEnable"],
  physics: ["enablePhysicsSolver", "setEnablePhysicsSolver"],
};

// Set true to keep intermediate .closure.js / .uglify.js files for debugging
const DEBUG_BUILD = false;
// Roadroller shrinks the code a lot but is the slowest step
const USE_ROADROLLER = true;
// Extreme mode takes over a minute and usually saves only a few bytes
const ROADROLLER_EXTREME = false;

let sourceFiles = [];
if (mode === "vanilla") {
  sourceFiles = ["littlejs/littlejs.release.js", "dist/game.js"];
} else {
  sourceFiles = ["dist/game.js"];
}
if (!fs.existsSync("dist")) {
  console.error(
    'Error: "dist" directory does not exist. Please run `npm run build`.',
  );
  process.exit(1);
}

// tile(s) extracted from ./src/data.js
const dataFiles = Data.tiles.map((tile) => `public/${tile}`);

console.log(``);
chalkSuccess(` Building ${Data.title}... `, "🛠️");
console.log(``);
const startTime = Date.now();

// remove old files and setup build folder
fs.rmSync(BUILD_FOLDER, { recursive: true, force: true });
fs.rmSync(`${PROGRAM_NAME}.zip`, { force: true });
fs.mkdirSync(BUILD_FOLDER);

// copy data files
for (const file of dataFiles) {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, `${BUILD_FOLDER}/${file.split("/").pop()}`);
  }
}

try {
  const buildSteps = [closureCompilerStep, uglifyBuildStep];
  if (USE_ROADROLLER) buildSteps.push(roadrollerBuildStep);
  buildSteps.push(htmlBuildStep, zipBuildStep);

  Build(`${BUILD_FOLDER}/index.js`, sourceFiles, buildSteps);
} catch (e) {
  handleError(e, "Build failed!");
}

// report size against the JS13K budget
const size = fs.statSync(`${PROGRAM_NAME}.zip`).size;
const remaining = SIZE_LIMIT - size;
const percent = ((100 * size) / SIZE_LIMIT).toFixed(1);

console.log(``);
console.log(
  chalk.blue(
    `- Build Completed in ${((Date.now() - startTime) / 1e3).toFixed(2)} seconds!`,
  ),
);
console.log(
  chalk.blue(`- Size of ${PROGRAM_NAME}.zip: ${size} / ${SIZE_LIMIT} bytes (${percent}%)`),
);

if (size < SIZE_LIMIT) {
  chalkSuccess(`Remaining space: ${remaining} bytes`);
} else {
  chalkError(`Error: Build size exceeds maximum of ${SIZE_LIMIT} bytes!`);
  process.exit(1);
}
console.log("");

///////////////////////////////////////////////////////////////////////////////

// A single build with its own source files, build steps, and output file
// - each build step is a callback that accepts a single filename
function Build(outputFile, files = [], buildSteps = []) {
  // copy files into a buffer
  let buffer = "";
  for (const file of files) buffer += fs.readFileSync(file) + "\n";

  // strip out disabled features before minifying
  buffer = applyFeatureFlags(buffer);

  // output file
  fs.writeFileSync(outputFile, buffer, { flag: "w+" });

  // execute build steps in order
  for (const buildStep of buildSteps) buildStep(outputFile);
}

// Rewrite disabled feature flags to compile time constants
// - the engine declares them as mutable 'let' so setters can change them
// - Closure cannot fold a mutable binding, so it keeps both branches and the
//   whole subsystem behind them survives even in a game that never uses it
// - turning the flag into 'const false' and emptying its setter lets Closure
//   prove the branch is dead and delete it
function applyFeatureFlags(buffer) {
  for (const feature in FEATURE_FLAGS) {
    if (FEATURES[feature]) continue;

    const [flag, setter] = FEATURE_FLAGS[feature];
    const flagPattern = new RegExp(`^let ${flag} = \\w+;`, "m");
    const setterPattern = new RegExp(`^function ${setter}\\(([^)]*)\\)[^\\n]*$`, "m");

    // fail loudly rather than silently skipping the optimization
    if (!flagPattern.test(buffer))
      handleError(`could not find "let ${flag}"`, "Failed to disable feature: " + feature);
    if (!setterPattern.test(buffer))
      handleError(`could not find "function ${setter}"`, "Failed to disable feature: " + feature);

    buffer = buffer.replace(flagPattern, `const ${flag} = false;`);
    buffer = buffer.replace(setterPattern, `function ${setter}($1) {}`);
    console.log(`Feature disabled: ${feature}`);
  }
  return buffer;
}

function closureCompilerStep(filename) {
  console.log(`Running closure compiler...`);

  const filenameTemp = filename + ".tmp";
  fs.copyFileSync(filename, filenameTemp);
  try {
    child_process.execSync(
      `npx google-closure-compiler --js=${filenameTemp} --js_output_file=${filename} --compilation_level=ADVANCED --warning_level=VERBOSE --jscomp_off=* --assume_function_wrapper`,
      { stdio: "inherit" },
    );
  } catch (e) {
    handleError(e, "Closure Compiler step failed!");
  }
  if (DEBUG_BUILD) fs.copyFileSync(filename, filename + ".closure.js");
  fs.rmSync(filenameTemp);
}

function uglifyBuildStep(filename) {
  console.log(`Running uglify...`);
  try {
    child_process.execSync(`npx uglifyjs ${filename} -c -m --toplevel -o ${filename}`, {
      stdio: "inherit",
    });
  } catch (e) {
    handleError(e, "Uglify step failed!");
  }
  if (DEBUG_BUILD) fs.copyFileSync(filename, filename + ".uglify.js");
}

function roadrollerBuildStep(filename) {
  console.log(`Running roadroller...`);
  const optimize = ROADROLLER_EXTREME ? " --optimize 2" : "";
  try {
    child_process.execSync(`npx roadroller ${filename} -o ${filename}${optimize}`, {
      stdio: "inherit",
    });
  } catch (e) {
    handleError(e, "Roadroller step failed!");
  }
}

function htmlBuildStep(filename) {
  console.log(`Building html...`);
  let scriptContent = fs.readFileSync(filename, "utf8");

  scriptContent = scriptContent.replace(/\/\/# sourceMappingURL=.*/g, "");

  let buffer = `<!DOCTYPE html><html><head><title>${Data.title}</title><meta charset=utf-8></head>`;
  buffer += `<body>`;
  buffer += "<script>";
  buffer += scriptContent;
  buffer += "</script></body></html>";

  fs.writeFileSync(`${BUILD_FOLDER}/index.html`, buffer);
}

function zipBuildStep() {
  console.log(`Zipping...`);
  const { execSync, spawnSync } = child_process;
  const fileNames = Data.tiles;

  try {
    if (process.platform === "win32") {
      // Windows version using ect
      const ect = "../node_modules/ect-bin/vendor/win32/ect.exe";
      const args = [
        "-9",
        "-strip",
        "-zip",
        `../${PROGRAM_NAME}.zip`,
        "index.html",
        ...fileNames,
      ];
      const result = spawnSync(ect, args, { stdio: "inherit", cwd: BUILD_FOLDER });
      if (result.error || result.status)
        handleError(result.error || `exit code ${result.status}`, "Zip step failed!");
    } else {
      // Linux/macOS version using zip
      const zipCommand = `cd ${BUILD_FOLDER} && zip -9 -r ../${PROGRAM_NAME}.zip index.html ${fileNames.join(" ")}`;
      execSync(zipCommand, { stdio: "inherit" });
    }
  } catch (e) {
    handleError(e, "Zip step failed!");
  }

  // cleanup - remove tmp and rename to dist for gh-pages
  fs.rmSync("dist", { recursive: true, force: true });
  fs.renameSync("tmp", "dist");
}

// display the error and exit
function handleError(e, message) {
  console.error(e);
  chalkError(message);
  process.exit(1);
}

