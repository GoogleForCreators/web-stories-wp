# Design System

## Overview

Web Stories exists as two apps right now, the editor and the dashboard. Both have their own set of components that they are built off of. Now that we have a robust design system in figma ([here](https://www.figma.com/file/bMhG3KyrJF8vIAODgmbeqT/Design-System?node-id=1906%3A0)), we won't need to duplicate foundational and base components by having separate copies in the editor and dashboard. The idea here is to make this transition as painless as possible, no massive structural changes. This is a consolidation of components and themes.

## What goes in the design system?

The Design System is **only** for shared basics and components. In [atomic design terms](https://bradfrost.com/blog/post/atomic-web-design) we are sharing atoms, molecules and (some) organisms.  If it is a small pattern that’s repeated in a more complicated structure (like a menu that’s used in a dropDown, a search component and a popover menu) then that structure should exist in the design system. If it’s shared across both the editor and the dashboard, it should exist in the design system - like a button or a dialog. 

If it’s something complex only used by the editor, say the color picker, which uses a slider and some other smaller components in the design system, the color picker would live in the editor because it is not shared by the dashboard. Things that are not easily generalized should not live in the design system.

## Theme

With this update we get a full new color palette and theme. The structure is changing a little bit to try and keep things more organized. You can dig into the app [assets/src/design-system/theme](https://github.com/google/web-stories-wp/tree/main/assets/src/design-system) to see organization. Here’s brief overview of the organization to contextualize what you’re looking at.

1. Colors, Typography, Borders, Breakpoints are in separate files and all added to the index’s `theme` that can be ingested at the root of each app. This file separation makes it easier to find theme values for developers who prefer to look in source code for the value they need.
2. The new theme provides a dark and a light variant. The dark is the default. All colors are available regardless of variant, but the `theme.colors.bg` and `theme.colors.fg` are what you should gravitate towards using because the light and dark theme colors mirror each other. This will make dark and light mode functionality easier to handle down the road.
3. Subdirectory called `helpers` - these are styles meant to be quick references for one off components in the editor and dashboard that aren’t in the design system.They’re also used in the design system for continuity.
4. Subdirectory called `global` - these are exported as `ThemeGlobals` and should be added to app root code to handle global styles for both the dashboard and editor. Currently only the focus override exists here.
5. Subdirectory called `constants` - these are constants that are used in both the dashboard and the editor (or needed also in the design system) so that we can have a single source of truth. You can import them via `THEME _CONSTANTS`. These include things like static widths of wordPress menus that all projects reference.

It’s important to note that this is a living resource - I fully anticipate that we need to add to the theme as we begin to use it more robustly. The design system is being created iteratively as we go through implementing new designs. If there’s a new need for a helper, add it! If there’s a color lacking, add it in following the existing patterns. My goal here was to create a base that we can easily keep updating and avoid needless duplication.

## Components

The hope here is to make the transition to using the components in the design system straightforward and easy. If a component in the design system already existed in the editor or dashboard, that source code was used as a reference for the new one in almost all cases. Props should be the same or similar for components that were based off of existing code.

### Differences from the editor

- Icon buttons are now a button type where you give the icon to the button instead of specific button components.
- Button refs are readily available
- Typography is available in molecules - there’s `Display`, `Headline`, `Text`, and `Link` that match the figma specs for type and can take in a styled component `as` of `forwardedAs` to keep HTML semantic but avoid needlessly styling each text element. If you do need to do that there’s a `themeHelpers.expandPresetStyles` or `themehelpers.expandTextPreset` you can look to.

### How to add components to the design system

There’s going to be things missing from the design system as of this writing. Our designs have been in flux and we’ve been adding things as we need them in the redesign. That said, feel free to add missing components. Components live in [design-system/components](https://github.com/google/web-stories-wp/tree/main/assets/src/design-system/components). This directory’s pretty flat so that things are easy to find at 1 level.  The general rule here, as with any shared design system, is that we keep things generic and non-opinionated as much as possible so that the usability remains flexible. All components have storybook demos that allow all props passed to the component to be seen as knobs as well as dark and light versions so that theme colors can be checked.

### Some caveats

1. Buttons!

- Figma has 3 types of buttons: Primary, Secondary, Tertiary. The difference between a secondary button and a tertiary button is the active state.
- There’s a 4th type of button in the design system called Plain - this button type has no styles, it’s just a reset button without any outline or background color that can be used when we need something to semantically be a button but the designs disagree. This shouldn’t happen often and should be a bit of an escape hatch.
- Button variants in figma are square and rectangle. The additional variants of circle and icon are added outside of figma because there are occasions in the editor and dashboard where there are no shared button styles but the element is expected to behave as a button. By having a button variant of icon we can eliminate the need of having specific exportable buttons like `ArrowDown`.
- Button types, sizes, and variants (circle, rectangle, square, icon) are all available as constants and importable via `BUTTON_TYPES`, `BUTTON_SIZES`, `BUTTON_VARIANTS` so that we don’t have to worry about miscellaneous strings.
- Every button combination has a [demo in storybook](https://google.github.io/web-stories-wp/storybook/?path=/story/designsystem-components-button--default).

1. Typography

- [design-system/typography](https://github.com/google/web-stories-wp/tree/main/assets/src/design-system/components/typography) has the only nested content. This follows the foundation set up in figma of Display, Headline, Label, Paragraph, Link.
- Each typography type has a set of presets that are stored in the theme and matching constants ([theme/constants/typography](https://github.com/google/web-stories-wp/blob/main/assets/src/design-system/theme/constants/typography.js)).
- The typography components are `<Display />`, `<Headline />`, `<Link />`, `<Text />`
- Each is a styled component and can be passed whatever element you want it to be with `as` or `forwardedAs` depending on your situation.
- These are meant to decrease our need to individually style text elements and ensure consistency.
- There’s a demo for every [type setting in storybook](https://google.github.io/web-stories-wp/storybook/?path=/story/designsystem-components-typography-display--default).

1. Circular dependencies

- If you are adding a component and you need to reference anything in the design-system you’ll need to import it from the nearest location to that import not the top level index.
- While this works just fine in the app (because you’re outside of the design system), storybook will yell at you because it thinks that imports aren’t loaded in time.
- As an example, I’m creating this new `<Taco />` and I need a `<Text />` component. I’d need to `import { Text } from ‘../typography’;` not `../` if I’m in `components/taco`.

## Icons

Icons are separated from components and already exported as `ReactComponent` . You can import them via `/theme/icons` or `/theme`.

### How to add icons

Icons are separated into sections to make traversing the directory a little easier when you’re unsure of what all is in there. [Material Design icon categories](https://material.io/resources/icons/?style=baseline) were used as the naming convention so as not to reinvent the wheel.

1. Export your SVG & compress it (example: [https://jakearchibald.github.io/svgomg/](https://jakearchibald.github.io/svgomg/))
2. Add the file to the appropriate directory in [design-system/icons](https://github.com/google/web-stories-wp/tree/main/assets/src/design-system/icons)
3. Export it from the index of that directory as a ReactComponent
4. Import from the design-system wherever you want to use it.
