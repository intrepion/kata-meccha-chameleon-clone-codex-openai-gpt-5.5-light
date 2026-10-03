# Meccha Chameleon

Meccha Chameleon is an original browser game context for a third-person 3D chameleon traversal game inspired by the core fantasy of Meccha Chameleon. Its language centers on paint-driven traversal, camouflage pressure, tongue movement, and handcrafted challenge levels.

## Language

**Chameleon**:
The player character, a nimble 3D avatar that moves through levels by jumping, painting, camouflaging, and using its tongue.
_Avoid_: Player blob, mascot, lizard

**Level**:
A handcrafted playable space with a start, traversal challenges, paint interactions, and an exit.
_Avoid_: Map, stage, room

**Exit**:
The level goal that completes the current level when the Chameleon reaches it.
_Avoid_: Portal, finish line, objective marker

**Paint**:
A color applied to world surfaces by the Chameleon to change traversal, gate, or camouflage meaning.
_Avoid_: Ink, dye, decal

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

**Sentry**:
A static level hazard with a vision area that detects the Chameleon when Camouflage does not match the local requirement.
_Avoid_: Enemy, guard, monster

**Vision Area**:
The space watched by a Sentry.
_Avoid_: Sight cone, aggro zone, detection field

**Checkpoint**:
A saved return point within a Level used after Sentry detection or failed traversal.
_Avoid_: Save point, respawn, restart
