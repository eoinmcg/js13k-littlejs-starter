/**
 * Renders a parallax starfield effect.
 *
 * @param {boolean} gameOver - If true, the stars will stop moving.
 */
export function starfield(gameOver) {
  const { width, height } = mainContext.canvas;
  const NUM_STARS = 50;

  // Draw the background as a solid black rectangle.
  mainContext.fillStyle = "#222";
  mainContext.beginPath();
  mainContext.rect(0, 0, width, height);
  mainContext.fill();

  // Use a seeded random number generator for a consistent starfield pattern.
  const random = new RandomGenerator(1223);

  // Loop to draw a fixed number of stars.
  for (let i = NUM_STARS; i--; ) {
    // Star size and speed are tied together for a parallax effect.
    // Larger stars (larger size) move faster.
    let size = random.float(1, 3);
    let speed = gameOver ? 0 : size * 500;

    const extraSpace = 10;
    const w = width,
      h = height;

    // Calculate the star's position based on a seeded random value and game time.
    // The modulo operator (%) makes the stars wrap around the screen, creating a
    // seamless, endless effect.
    const screenPos = vec2(
      ((random.float(w) + time) % w) - extraSpace,
      ((random.float(h) + time * speed * random.float()) % h) - extraSpace,
    );

    // Adjust the star's opacity based on its size for a subtle depth effect.
    // Smaller stars (which are slower) are less opaque.
    mainContext.globalAlpha = 1 / size;

    // Draw the star as a white circle.
    mainContext.fillStyle = "#fff";
    mainContext.beginPath();
    mainContext.arc(screenPos.x, screenPos.y, size, 0, 2 * Math.PI, false);
    mainContext.fill();
  }

  // Reset global alpha to 1 to avoid affecting other drawing operations.
  mainContext.globalAlpha = 1;
}
