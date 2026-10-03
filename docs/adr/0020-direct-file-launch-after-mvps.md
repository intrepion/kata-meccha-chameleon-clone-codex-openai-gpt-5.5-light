# Direct file launch after MVPs

Direct `file://` launch support will be considered after the core MVPs are complete rather than required from the beginning, omitted forever, or used to replace the Vite stack. This keeps early work focused on the playable 3D browser path while leaving room for a double-click workflow if it becomes a delivery requirement.

## Considered Options

- Direct file launch required from the start.
- Vite dev and build browser paths are enough.
- Add direct file launch only after all MVPs are complete.
- Add direct file launch only if browser smoke tests are stable.
- Replace Vite with static files.

## Consequences

Core acceptance should use the Vite development or production browser path. If direct file launch is added later, it should have its own regression because module-based Vite entries do not automatically prove `file://` compatibility.
