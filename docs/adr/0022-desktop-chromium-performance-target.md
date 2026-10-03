# Desktop Chromium performance target

Meccha Chameleon will target desktop Chromium with a 60 FPS goal and no mobile promise for the first playable clone. This keeps WebGL and Playwright verification concrete while leaving the design lightweight enough to revisit broader browser support later.

## Considered Options

- Any machine with no formal target.
- Desktop Chromium only, 60 FPS goal, no mobile promise.
- Desktop and mobile Safari.
- High-end GPU only.
- Low-end phone first.

## Consequences

Browser acceptance should run through desktop Chromium. Mobile, Safari, and low-end phone behavior are outside the first delivery contract unless explicitly added later.
