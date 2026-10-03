# Vite TypeScript Three.js Playwright stack

Meccha Chameleon will use Vite, TypeScript, Three.js, Vitest, and Playwright rather than a dependency-light static page, React shell, Babylon.js, or Canvas 2D. The game depends on 3D raycasting, collision, and browser regression evidence, so the stack should make those mechanics explicit and testable.

## Considered Options

- Static HTML, CSS, and JavaScript with CDN libraries.
- Vite, TypeScript, Three.js, Vitest, and Playwright.
- React app.
- Babylon.js.
- Canvas 2D.

## Consequences

The implementation should keep the playable game as the first screen and use browser smoke tests as acceptance evidence. Direct file launch support is separate from the core stack decision and should only be added if it becomes an explicit delivery requirement.
