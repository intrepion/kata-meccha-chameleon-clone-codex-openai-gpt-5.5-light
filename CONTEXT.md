# Meccha Chameleon

Meccha Chameleon is an original browser game context for a third-person 3D chameleon traversal game inspired by the core fantasy of Meccha Chameleon. Its language centers on paint-driven traversal, camouflage pressure, tongue movement, and handcrafted challenge levels.

## Language

**Chameleon**:
The player character, a nimble 3D avatar that moves through levels by jumping, painting, camouflaging, and using its tongue.
_Avoid_: Player blob, mascot, lizard

**Character Controller**:
The movement model for the Chameleon, including slopes, steps, ledge forgiveness, jumping, and collision.
_Avoid_: Physics body, rigid body, movement script

**Level**:
A handcrafted playable space with a start, traversal challenges, paint interactions, and an exit.
_Avoid_: Map, stage, room

**Training Grove**:
The first Level, focused on movement, camera use, collision, jumping, HUD feedback, and reaching an Exit.
_Avoid_: Tutorial, Level 1, starter area

**Sentry Shrine**:
The second Level, focused on Purple Paint, Camouflage, Sentries, Checkpoints, and stealth pressure.
_Avoid_: Stealth level, Level 2, guard room

**Anchor Falls**:
The third Level, focused on Orange Paint, Tongue Anchors, Green Paint traversal, and finale movement challenges.
_Avoid_: Grapple level, Level 3, waterfall room

**Jungle Temple**:
The primary level setting, combining bright jungle readability with temple structures for traversal landmarks.
_Avoid_: Swamp, lab, test chamber

**Exit**:
The level goal that completes the current level when the Chameleon reaches it.
_Avoid_: Portal, finish line, objective marker

**Sunfly**:
An optional collectible hidden in a Level for exploration and completion tracking.
_Avoid_: Coin, fruit, gem

**Unlocked Level**:
A Level made available for replay after the player completes the preceding Level.
_Avoid_: Open stage, available map

**Paint**:
A color applied to world surfaces by the Chameleon to change traversal, gate, or camouflage meaning.
_Avoid_: Ink, dye, decal

**Paintable Surface**:
A marked panel or obvious natural surface that can receive Paint and express a Paint Rule.
_Avoid_: Any surface, paint zone, target

**Paint Color**:
A specific rule-bearing color of Paint, such as a color that enables climbing, bouncing, gate power, or camouflage.
_Avoid_: Swatch, material, skin

**Paint Rule**:
The gameplay permission or behavior attached to a Paint Color.
_Avoid_: Modifier, buff, effect

**Green Paint**:
A Paint Color whose Paint Rule creates Grip Surfaces for traversal.
_Avoid_: Climb paint, sticky paint

**Purple Paint**:
A Paint Color whose Paint Rule supports Camouflage against Sentries.
_Avoid_: Stealth paint, shadow paint

**Orange Paint**:
A Paint Color whose Paint Rule activates Tongue Anchors.
_Avoid_: Hook paint, grapple paint

**Grip Surface**:
A painted surface the Chameleon can use for traversal beyond ordinary walking, such as climbing or sticking.
_Avoid_: Climb wall, sticky wall

**Gate**:
A level obstacle that responds to Paint Color and blocks or opens traversal.
_Avoid_: Door, lock, barrier

**Tongue**:
The Chameleon's directed grab tool for reaching anchors, pulling collectibles, or crossing gaps.
_Avoid_: Grapple hook, rope, whip

**Tongue Anchor**:
A world target that the Tongue can grab to move the Chameleon or manipulate something in the level.
_Avoid_: Hook point, grapple node

**Raycast Aim**:
A directed aim from the camera through the pointer into the 3D world for selecting paint targets or Tongue Anchors.
_Avoid_: Mouse click, cursor aim

**Camouflage**:
The Chameleon's color-matching state used to avoid detection by sentries.
_Avoid_: Stealth mode, invisibility, disguise

**State Outline**:
A visible outline or glow around the Chameleon that clarifies the current Paint Color or Camouflage state.
_Avoid_: Aura, shader effect, status glow

**Sentry**:
A static level hazard with a vision area that detects the Chameleon when Camouflage does not match the local requirement.
_Avoid_: Enemy, guard, monster

**Vision Area**:
The space watched by a Sentry.
_Avoid_: Sight cone, aggro zone, detection field

**Checkpoint**:
A saved return point within a Level used after Sentry detection or failed traversal.
_Avoid_: Save point, respawn, restart

**Play HUD**:
The compact in-game display for current Paint Color, level goal, Checkpoint feedback, Sentry alert state, and level progress.
_Avoid_: Dashboard, quest log, overlay

**Orbit Camera**:
The third-person camera that rotates around the Chameleon with constrained pitch and collision-safe distance.
_Avoid_: Free camera, fixed camera, cinematic camera

**Ambient Loop**:
The repeating environmental audio bed for the Jungle Temple.
_Avoid_: Soundtrack, music system, adaptive score

**Test Mode**:
A deterministic route or state flag used by browser tests to reach Levels and mechanics without exposing a player-facing debug menu.
_Avoid_: Debug menu, cheat mode, test build
