# Validated MVP delivery

We will deliver the clone through independently playable MVP slices, committing and pushing each milestone after validation. The project is small, but the gameplay risk is high enough that a single large commit would hide whether movement, paint, tongue interaction, and level completion actually work in the browser.

## Considered Options

- One complete pass followed by one commit.
- MVP slices with a commit and push per milestone.
- Local-only prototype.
- Documentation only.
- Tests only after all gameplay exists.

## Consequences

Each milestone should include browser evidence appropriate to the slice. Unit tests and builds are useful, but they are not sufficient acceptance evidence for the final playable experience.

The planned slices are movement, camera, and collision first; then paint rules and gates; then Tongue Anchors, Sentries, and the three-level progression.
