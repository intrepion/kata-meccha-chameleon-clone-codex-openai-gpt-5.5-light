# Checkpoint reset for Sentry detection

Sentry detection will return the Chameleon to the last Checkpoint rather than restarting the whole Level, merely showing feedback, or applying a soft resource penalty. This creates real stealth stakes while keeping iteration fast during playtesting.

## Considered Options

- Instant level restart.
- Return to last Checkpoint.
- Lose Camouflage charge.
- Temporary alarm and continue.
- Visual feedback only.

## Consequences

Levels need enough Checkpoints to make failure meaningful without making browser verification tedious. Sentry behavior must prove both detection and recovery.
