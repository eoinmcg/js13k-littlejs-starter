
import {
    mainContext, vec2, time, RandomGenerator
} from "@engine/littlejs.esm";

/**
 * Renders a parallax starfield effect.
 * adapted from littlejs demos
 *
 * @param {boolean} gameOver - If true, the stars will stop moving.
 */
export default function starfield(gameOver) {

    const w = mainContext.canvas.width;
    const h = mainContext.canvas.height;
    const NUM_STARS = 20;
    const extraSpace = 10;

    const random = new RandomGenerator(1223);

    // Draw the background as a dark blue rectangle.
    mainContext.fillStyle = '#002';
    mainContext.beginPath();
    mainContext.rect(0, 0, w, h);
    mainContext.fill();

    // Loop to draw a fixed number of stars.
    for (let i = NUM_STARS; i--;) {
        // Star size and speed are tied together for a parallax effect.
        // Larger stars (larger size) move faster.
        let size = random.float(1, 3);
        let speed = gameOver ? 0 : (size/5) * 500;

        // Calculate the star's position based on a seeded random value and game time.
        // The modulo operator (%) makes the stars wrap around the screen, creating a
        // seamless, endless effect.
        const screenPos = vec2(
            (random.float(w) + time) % w - extraSpace,
            (random.float(h) + time * speed * random.float()) % h - extraSpace
        );

        // Adjust the star's opacity based on its size for a subtle depth effect.
        // Smaller stars (which are slower) are less opaque.
        mainContext.globalAlpha = .8 / size;

        // Draw the star as a white circle.
        mainContext.fillStyle = '#fff';
        mainContext.beginPath();
        mainContext.arc(screenPos.x, screenPos.y, size, 0, 2 * Math.PI, false);
        mainContext.fill();
    }

    // Reset global alpha to 1 to avoid affecting other drawing operations.
    mainContext.globalAlpha = 1;
}
