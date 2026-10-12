# AI Generation Workflow

This workflow turns each storyboard panel into a controlled generation sequence.

## Stage 1: Define the shot

Before generating anything, define:

- Narrative purpose
- Subject
- Environment
- Time of day
- Character emotion
- Character action
- Beginning pose
- Ending pose
- Camera position
- Camera movement
- Audio cue
- Shot duration
- Transition into the shot
- Transition out of the shot

## Stage 2: Lock references

Collect and approve:

- Character face references
- Character body proportions
- Hairstyle
- Costume
- Props
- Location
- Architecture
- Color palette
- Lighting style
- Visual motifs
- Rendering style

Every recurring character should have an identity lock.

An identity lock should describe details that cannot change between shots.

Example:

```text
Maintain the same face shape, eye color, hairstyle, costume, accessories,
body proportions, apparent age, and color palette in every shot.
```

## Stage 3: Generate the environment plate

Generate the environment without characters.

Focus on:

- Composition
- Perspective
- Horizon position
- Foreground elements
- Middle-ground elements
- Background elements
- Light direction
- Atmospheric depth
- Empty areas reserved for characters
- Camera height
- Lens impression

Do not add effects that obstruct the future character placement.

## Stage 4: Add characters

Add one character at a time when the generation system allows it.

For each character, define:

- Name
- Screen position
- Distance from camera
- Body orientation
- Face direction
- Eye line
- Pose
- Expression
- Hand position
- Interaction with objects
- Interaction with other characters

## Stage 5: Performance correction

Review:

- Facial expression
- Eye direction
- Hand anatomy
- Foot placement
- Weight distribution
- Character interaction
- Emotional readability
- Costume continuity
- Prop continuity
- Screen direction

Regenerate or correct the shot before adding complex effects.

## Stage 6: Cinematic pass

Define:

- Shot size
- Camera angle
- Lens
- Depth of field
- Focus target
- Camera movement
- Motion speed
- Camera shake
- Foreground occlusion
- Composition balance

Example:

```text
Medium close shot, eye-level camera, restrained 50mm lens impression,
shallow depth of field, focus locked on the lead character's eyes,
slow six-second push forward.
```

## Stage 7: Lighting and effects

Add:

- Key light
- Fill light
- Rim light
- Volumetric light
- Weather
- Fog
- Dust
- Particles
- Energy effects
- Reflections
- Motion streaks
- Environmental response

Effects should support the story beat rather than obscure the performance.

## Stage 8: Motion generation

Separate subject motion from camera movement.

### Subject motion

Describe:

- Initial pose
- Action
- Speed
- Direction
- Final pose
- Secondary motion
- Cloth movement
- Hair movement
- Environmental reaction

### Camera movement

Describe:

- Static, pan, tilt, dolly, track, crane, orbit, zoom, or handheld
- Direction
- Speed
- Duration
- Start framing
- End framing
- Focus behavior

### Locked elements

State what must remain unchanged:

- Character identity
- Costume
- Location geometry
- Light direction
- Prop position
- Background architecture
- Number of characters
- Screen direction

## Stage 9: Quality control

Inspect each result for:

- Identity drift
- Costume drift
- Incorrect character count
- Duplicate limbs
- Hand artifacts
- Eye artifacts
- Object warping
- Background mutation
- Flickering
- Lighting inconsistency
- Unwanted camera movement
- Unwanted text
- Watermarks
- Logo distortion

## Stage 10: Production output

Prepare:

- Clean keyframe
- Start frame
- End frame
- Motion clip
- Transparent effects pass when available
- Clean environment plate
- Character-only pass when available
- High-resolution still
- Proxy video
- Production video
- Prompt archive
- Seed archive
- Model/version record

## Stage 11: Editing

In the editing application:

1. Import all approved clips.
2. Place clips at storyboard timecodes.
3. Trim to musical or dialogue cues.
4. Add transitions.
5. Match color between clips.
6. Stabilize inconsistent motion.
7. Add sound design.
8. Add dialogue and music.
9. Add titles and graphics.
10. Review continuity.
11. Export a review version.
12. Apply notes.
13. Export the final master.
