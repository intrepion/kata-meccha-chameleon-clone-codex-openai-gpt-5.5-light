# Local progress persistence

Meccha Chameleon will persist Unlocked Levels and collected Sunflies locally rather than having no persistence, full checkpoint restore, cloud save, or URL-only save. This gives level progression and optional collectibles meaning without turning mid-level restoration into an early bug source.

## Considered Options

- No persistence.
- Persist Unlocked Levels and Sunflies locally.
- Persist full Checkpoint state.
- Cloud save.
- URL encoded save only.

## Consequences

Persistence should be small, local, and resilient to version changes. Checkpoints remain in-session recovery, not a saved-game contract.
