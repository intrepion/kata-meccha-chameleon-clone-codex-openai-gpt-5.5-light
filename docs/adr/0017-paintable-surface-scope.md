# Paintable Surface scope

Paint will apply to marked Paintable Surfaces plus a few obvious natural surfaces rather than any visible surface, ground only, walls only, or marked panels only. This keeps player agency visible while preserving level readability and testability.

## Considered Options

- Any visible surface.
- Only marked paintable panels.
- Ground only.
- Walls only.
- Paintable panels plus obvious natural surfaces.

## Consequences

Paintable Surfaces should be visually legible and mechanically meaningful. Browser tests should target explicit Paintable Surfaces rather than depending on arbitrary geometry accepting Paint.
