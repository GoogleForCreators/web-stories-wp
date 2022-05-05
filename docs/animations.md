# Animations

Animations currently reside in `packages/animation`. The top level logic is held in `packages/animation/src/components/provider.js`. This package is responsible for taking a serializable array of animations objects and transforming the objects into WAAPI & AMP animations as well as exposing aggregate animation methods: `pause`, `play`, etc

**Note:** Editing and updating the serializable array of animation objects is considered part of the story editor and held on the page level in the story reducer state.

## Generating an Animation from a Serializable Animation Object

Our serializable animation objects currently have this structure:

```js
// sample animation object
{
  id, // unique identifier for this animation
  type, // type of animation, `blink`, `bounce` etc.
  targets, // what elements in the story this animation is targeting
  ...args // whatever args this type of animation takes ie `ease` | `duration`
}
```

These objects are managed within the story reducer and passed to the animation provider. The animation provider then generates animations by passing this data to the function `AnimationPart(..)` located in `packages/animation/src/parts/index.js`. `AnimationPart(..)` maps the animations instanciation args to a generator function that will generate keyframes, WAAPI animation targets, AMP animation targets, etc.

### Animation Parts & Animation Effects

There are 2 types of animation generators we have in the editor, the first is an `Animation Part`.

#### Animation Parts

Animation Parts are more atomic animations that animate one style property and are more configurable. Animation parts are located in `packages/animation/src/parts`. Animation parts are more granular and unopinionated than Animation Effects. 

i.e. the `zoom` animation part can animate an elements scale from one value to any other value.


#### Animation Effects

The second type of animations we have are `Effects`. Effects are more complex and opinionated. They are located in `packages/animation/src/effects`. Effects can compose multiple Animation Parts and often take more specified arguments as well as altering keyframe values depending on the element they're being applied to. 

i.e. The Background Pan animation effect takes the current offset & zoom of the background image into consideration so the user can't pan the background image past the borders of the page.

#### Utilization of Parts & Effects within the Editor

The current story editor only uses `Effects` directly. The effects can be seen in the animation selector in the editor when editing an elements style.

#### Deviation in Spec from AMP Story Animation Presets

Our effects roughly mirror [amp_story_animations](https://amp.dev/documentation/examples/visual-effects/amp_story_animations/) but slightly deviate from them. 

The primary deviations in spec come from adding more protection so users don't enter a "bad" state with their animation, as well as supporting the concept of background element animations. AMP Stories don't deliniate between background and foreground elements so this behavior is unique to stories created with story editor.

## Parity Between Editor & Output

The generated animations share common keyframes between two formats, AMP & WAAPI ([Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)). Parity here is essential so generated amp stories don't deviate from what the user is viewing in the editor when editing & adding animations to a story page.

The WAAPI animations are used to apply animations to elements within the editor, while the AMP animations are used to apply animations to the generated story. You can view the generated story by clicking `preview` in the editor (next to the `publish` & `save` buttons).

## Integration into the Editor & Output

`packages/animation/src/components` contains the components used to animate elements within the editor. 

The top level logic is contained in the `packages/animation/src/components/provider.js`, which you can see integrated into the story editor at `packages/story-editor/src/components/canvas/displayLayer.js`. `<StoryAnimation.Provider />` takes the story elements & animations, interprets them and applies them to elements.

Target DOM elements are applied to story element components through animation wrappers. You can see `<StoryAnimation.WAAPIWrapper />` applied to display layer elements in the story editor through `packages/story-editor/src/components/canvas/displayElement.js`. You can see `<StoryAnimation.AMPWrapper />` applied to the generated AMP Story element through `packages/output/src/element.js`.

## Misc Notes & History

### Single Animation Target

In early specs for animations, we allowed a single animation to have mutliple targets (be applied to mulitple elements), since then, we have changed this spec to only allow an animation to have a single target element. This new spec is manually enforced in the editor code between the story reducer and the animation effect chooser. 

Remnants of this scope change can be seen in the serializable animation objects held in the story reducer state. These animations still take an array of targets even though that array should only ever hold one target while in use in the editor.

### Early Timeline Prototype

For the intial animation & template implementation we were supporting very complex animations for the templates. Creating these template animations necessitated an internal timeline tool to compose animation parts manually on each template. Since then, we've simplified animations for users and tried to make them parallel the AMP Story Animation presets

If we do introduce an animation timeline to the editor in the future, here's the reference to the PR where we took out the internal timeline tool:
[#7067](https://github.com/GoogleForCreators/web-stories-wp/pull/7067)

The commit hash right before that PR to remove the tool on main is `9b202aa628c6e44`. If you get a local version of that commit hash running, you can view the internal animation timeline tool by opening up the dashboard and navigating to `/story-anim-tool` in the url bar.

