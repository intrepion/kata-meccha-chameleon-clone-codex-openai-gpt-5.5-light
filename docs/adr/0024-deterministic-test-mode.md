# Deterministic Test Mode

The game will expose deterministic URL route or state flags for browser tests instead of no hooks, a visible debug menu, cheat codes, or a separate test build. Test Mode should let Playwright reach Levels and mechanics reliably without polluting the player-facing UI.

## Considered Options

- No hooks.
- URL route or state flags for Test Mode only.
- Visible debug menu.
- Cheat codes.
- Separate test build.

## Consequences

Test hooks should stay quiet and deterministic. They should support acceptance evidence for movement, Paint Rules, Tongue Anchors, Sentries, Sunflies, and level completion.
