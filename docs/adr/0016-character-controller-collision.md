# Character Controller collision

Meccha Chameleon will use a conservative Character Controller with slopes, steps, ledge forgiveness, jumping, and collision instead of full rigid-body physics, grid collision, visual-only collision, or simple boxes alone. The goal is platformer-feeling forgiveness, not a physics simulation.

## Considered Options

- Simple capsule against boxes and platforms.
- Full rigid-body physics engine.
- Grid-based collision.
- Visual-only collision.
- Character controller with slopes, steps, and ledge forgiveness.

## Consequences

Movement tests should prove the Chameleon can collide, jump, recover from small edges, and move predictably through Training Grove. Full physics behavior should not become an MVP dependency.
