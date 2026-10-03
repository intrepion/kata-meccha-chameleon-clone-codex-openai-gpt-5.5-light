# Compact Play HUD

The Play HUD will show current Paint Color, level goal, Checkpoint feedback, Sentry alert state, and level progress in a compact form. The game is not a dashboard, but paint rules, stealth feedback, and progression need to be visible while the player is moving.

## Considered Options

- Current Paint Color only.
- Current Paint Color plus level goal.
- Paint Color, Checkpoint, Sentry alert, and level progress.
- Full minimap and quest log.
- No HUD.

## Consequences

The HUD should be small, readable, and testable without covering traversal-relevant screen space. It should provide feedback for mechanic state, not explain the game with tutorial prose.
