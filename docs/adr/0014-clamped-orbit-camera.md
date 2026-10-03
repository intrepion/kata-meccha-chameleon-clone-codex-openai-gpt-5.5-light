# Clamped Orbit Camera

Meccha Chameleon will use an Orbit Camera with clamped pitch and collision-safe distance rather than a fully free camera, fixed behind-the-back camera, cinematic zones, or top-down fallback. This keeps third-person agency while reducing camera breakage around Jungle Temple geometry.

## Considered Options

- Free orbit with full pitch range.
- Orbit with clamped pitch and collision-safe distance.
- Fixed behind-the-back camera.
- Level-specific cinematic camera zones.
- Top-down fallback.

## Consequences

Movement, Raycast Aim, and Tongue targeting should be tested with the same camera constraints the player uses. Camera behavior is part of first-playable acceptance, not polish deferred to the end.
