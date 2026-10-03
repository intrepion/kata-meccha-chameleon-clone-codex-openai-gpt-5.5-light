# Raycast tongue targeting

The Tongue will use Raycast Aim against visible Tongue Anchors before considering a full physics rope swing. This keeps the signature interaction spatial and skillful while avoiding the scope risk of making rope physics the center of the first playable clone.

## Considered Options

- Lock on to the nearest valid anchor.
- Raycast aim at visible anchors.
- Short-range automatic grab in front of the Chameleon.
- Full physics rope swing.
- Collectible grab only.

## Consequences

Tongue interaction should be verified through camera-facing browser input, not only through state-level tests. Full rope swing behavior remains a later enhancement rather than an MVP dependency.
