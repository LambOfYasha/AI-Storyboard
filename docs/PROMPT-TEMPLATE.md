# AI Shot Prompt Template

Use this template for each storyboard shot.

## Shot identification

```text
PROJECT:
SEQUENCE:
SCENE:
SHOT:
VERSION:
DURATION:
ASPECT RATIO:
RESOLUTION:
FRAME RATE:
```

## Narrative purpose

```text
The purpose of this shot is:
```

## Subject

```text
Primary subject:
Secondary subjects:
Character count:
Character identity references:
Wardrobe:
Props:
```

## Action

```text
Starting action:
Primary action:
Ending action:
Character interaction:
Environmental reaction:
```

## Performance

```text
Emotion:
Facial expression:
Eye line:
Body language:
Energy level:
Performance restrictions:
```

## Environment

```text
Location:
Time of day:
Weather:
Foreground:
Middle ground:
Background:
Architecture:
Atmosphere:
```

## Composition

```text
Shot size:
Camera angle:
Camera height:
Subject placement:
Horizon:
Leading lines:
Foreground framing:
Negative space:
Depth layers:
```

## Camera

```text
Lens impression:
Camera movement:
Movement direction:
Movement speed:
Focus target:
Depth of field:
Start framing:
End framing:
Camera restrictions:
```

## Lighting

```text
Key light:
Fill light:
Rim light:
Light direction:
Contrast:
Color temperature:
Practical lights:
Volumetric lighting:
```

## Color

```text
Primary colors:
Secondary colors:
Accent colors:
Saturation:
Contrast:
Color progression:
```

## Visual style

```text
Medium:
Rendering style:
Surface detail:
Line quality:
Texture:
Motion style:
Reference priority:
```

## Effects

```text
Particles:
Weather effects:
Energy or magical effects:
Motion effects:
Environmental effects:
Effect restrictions:
```

## Continuity locks

```text
Keep unchanged:
- Character identity
- Apparent age
- Face shape
- Eye color
- Hairstyle
- Costume
- Accessories
- Body proportions
- Props
- Environment geometry
- Light direction
- Character count
- Screen direction
```

## Negative prompt

```text
Do not include identity drift, costume changes, extra characters,
duplicate characters, extra limbs, malformed hands, distorted faces,
incorrect eye direction, floating objects, warped architecture,
unreadable text, watermarks, logos, random camera movement,
background mutation, flicker, or inconsistent lighting.
```

## Motion prompt

```text
Over [DURATION], the subject begins by [STARTING ACTION].

The subject then [PRIMARY ACTION] at [SPEED] while moving
[DIRECTION].

Secondary motion includes [HAIR, CLOTH, PARTICLES, OR ENVIRONMENT].

The camera performs [CAMERA MOVEMENT] from [START FRAMING]
to [END FRAMING].

Keep [LOCKED ELEMENTS] stationary and consistent.

The shot ends with [ENDING POSE OR COMPOSITION].
```

## Generation log

```text
MODEL:
MODEL VERSION:
SEED:
REFERENCE IMAGES:
CONTROL METHOD:
PROMPT VERSION:
GENERATION DATE:
OUTPUT FILE:
REVIEW STATUS:
NOTES:
```

## Suggested generation passes

```text
PASS 01 — Environment
PASS 02 — Character placement
PASS 03 — Pose and performance
PASS 04 — Lighting
PASS 05 — Effects
PASS 06 — Motion
PASS 07 — Correction
PASS 08 — Upscale
PASS 09 — Color match
PASS 10 — Final export
```
