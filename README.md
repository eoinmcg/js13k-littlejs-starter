# LittleJS Starter Template for the JS13K Jam

===========================================

Get a head start on the [JS13k game jam](https://js13kgames.com/) with this
batteries-included starter template. It's built with the lightweight
and powerful [LittleJS game engine](https://littlejs.org/), giving
you everything you need to start building your game right away.

* * *

## **Quick Start**

1. **Clone the repository:** `git clone [your-repo-url]`

2. **Install dependencies:** `npm install`

3. **Start the development server:** `npm run dev`

* * *

## **Features**

### Local Development Server

    npm run dev

This command starts a local server that automatically reloads your browser whenever
you save a change to a file. This gives you instant feedback on your code, significantly
speeding up the development process and allowing for a much smoother creative flow.

### **Build and Package for Submission**

When you're ready to submit your game, run the build command: `npm run zip`

This single command performs a few key actions:

* It creates a minified version of your game in the `/dist` folder.
  
* It generates a `.zip` file in the root directory.

### **Record Gameplay Gifs**

Want to share your progress? This template includes a built-in GIF recorder.

* During gameplay, press `[Alt] + [g]` to start and stop a recording.

* The generated GIF will automatically download to your computer.

You can customize the recording settings, such as length and FPS, in `./scripts/screenie.js`.

### **Deployment to GitHub Pages**

Easily deploy your game to GitHub Pages with one command: `npm run deploy`

**Important:** Before you run this for the first time, you need to set up your repository:

1. Make sure your project is hosted on **GitHub**.

2. Go to your repository's **Settings** -> **Pages**.

3. Under **Source**, select the `gh-pages` branch and the `/ (dist)` folder. _
This will be configured automatically when the `npm run deploy` command is
run the first time.

4. Wait a moment for GitHub Pages to build, and your game will be live at `your-username.github.io/your-repo-name`.
