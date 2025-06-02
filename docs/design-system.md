# Design System

## Overview

Web Stories exists as two apps right now, the editor and the dashboard. Both have their own set of components that they are built off of. Now that we have a robust design system [in Figma](https://www.figma.com/file/bMhG3KyrJF8vIAODgmbeqT/Design-System?node-id=1906%3A0), we won't need to duplicate foundational and base components by having separate copies in the editor and dashboard. The idea here is to make this transition as painless as possible, no massive structural changes. This is a consolidation of components and themes.

## What goes in the design system?

The Design System is **only** for shared basics and components. In [atomic design terms](https://bradfrost.com/blog/post/atomic-web-design) we are sharing atoms, molecules and (some) organisms.  If it is a small pattern that’s repeated in a more complicated structure (like a menu that’s used in a dropDown, a search component and a popover menu) then that structure should exist in the design system. If it’s shared across both the editor and the dashboard, it should exist in the design system - like a button or a dialog.

If it’s something complex only used by the editor, say the color picker, which uses a slider and some other smaller components in the design system, the color picker would live in the editor because it is not shared by the dashboard. Things that are not easily generalized should not live in the design system.

## Theme

The design system contains a full new color palette and theme. The structure is changing a little bit to try and keep things more organized. You can dig into the app [packages/design-system/src/theme](../packages/design-system/src/index.js) to see organization. Here’s brief overview of the organization to contextualize what you’re looking at.

1. Colors, Typography, Borders, Breakpoints are in separate files and all added to the [theme index](../packages/design-system/src/theme/index.js) that can be ingested at the root of each app. This file separation makes it easier to find theme values for developers who prefer to look in source code for the value they need.
2. The new theme provides a dark and a light variant. Dark is the default. All colors are available regardless of variant, but the `theme.colors.bg` and `theme.colors.fg` are what you should gravitate towards using because the light and dark theme colors mirror each other. This will make dark and light mode functionality easier to handle down the road.
3. Subdirectory called [helpers](../packages/design-system/src/theme/helpers/index.js) - these are styles meant to be quick references for one off components in the editor and dashboard that aren’t in the design system. They’re also used in the design system for continuity.
4. Subdirectory called [global](../packages/design-system/src/theme/global/index.js) - these are exported as `ThemeGlobals` and should be added to the app root to handle global styles for both the dashboard and editor.
5. Subdirectory called [constants](../packages/design-system/src/theme/constants/index.js) - these are constants that are used in the dashboard, the editor and across the  design system so that we can have a single source of truth. You can import them via `THEME _CONSTANTS`. These include things like static widths of wordPress menus that all projects reference.

It’s important to note that this is a living resource - we fully anticipate the need to add to the theme as we begin to use it more robustly. The design system is being created iteratively as we go through implementing new designs. If there’s a new need for a helper, add it! If there’s a color lacking, add it in following the existing patterns. Our goal here was to create a base that we could easily keep updated to avoid needless duplication.

## Components

The hope here is to make the transition to using the components in the design system straightforward and easy. If a component in the design system already existed in the editor or dashboard, that source code was used as a reference for the new one in almost all cases. Props should be the same or similar for components that were based off of existing code.

### Differences from the editor

- Icon buttons are now a button type where you give the icon to the button instead of specific button components.
- Button refs are readily available
- Typography is available in molecules - there’s `Display`, `Headline`, `Text`, and `Link` that match the figma specs for type and can take in a styled component `as` of `forwardedAs` to keep HTML semantic but avoid needlessly styling each text element. If you do need to do that there’s a `themeHelpers.expandPresetStyles` or `themehelpers.expandTextPreset` you can look to.

### How to add components to the design system

There are going to be things missing from the design system. Designs have been in flux and we’ve been adding things as we need them in the redesign. That said, feel free to add missing components. Components live in [design-system/components](../packages/design-system/src/components/index.js). This directory’s pretty flat so that things are easy to find at 1 level.  The general rule here, as with any shared design system, is that we keep things generic and non-opinionated as much as possible so that the usability remains flexible. All components have storybook demos that allow all props passed to the component to be seen as `controls` as well as dark and light versions so that theme colors can be checked.

### Some caveats

Buttons!
-The designs have 3 types of buttons: Primary, Secondary, Tertiary. The difference between a secondary button and a tertiary button is the active state.

- There’s a 4th type of button in the design system called Plain - this button type has no styles, it’s just a reset button without any outline or background color that can be used when we need something to semantically be a button but the designs disagree. This shouldn’t happen often and should be a bit of an escape hatch.
- Button variants in the designs are square and rectangle. The additional variants of circle and icon were added because there are occasions in the editor and dashboard where there are no shared button styles but the element is expected to behave as a button. By having a button variant of icon we can eliminate the need of having specific exportable buttons like `ArrowDown`.
- Button types, sizes, and variants (circle, rectangle, square, icon) are all available as [constants](../packages/design-system/src/components/button/constants.js) and importable via `BUTTON_TYPES`, `BUTTON_SIZES`, `BUTTON_VARIANTS` so that we don’t have to worry about miscellaneous strings.
- Every button combination has a [demo in storybook](https://googleforcreators.github.io/web-stories-wp/storybook/?path=/story/designsystem-components-button--default).

Typography

- [design-system/typography](../packages/design-system/src/components/typography/index.js) has the only nested content. This follows the foundation set up in the designs of `Display`, `Headline`, `Label`, `Paragraph`, `Link`.
- Each typography type has a set of presets that are stored in the theme and matching constants ([theme/constants/typography](../packages/design-system/src/theme/constants/typography.js)).
- The typography components are `<Display />`, `<Headline />`, `<Link />`, `<Text />`, found in [`components/typography`](../packages/design-system/src/components/typography/index.js).
- Each is a styled component and can be passed whatever element you want it to be with `as` or `forwardedAs` depending on your situation.
- These are meant to decrease our need to individually style text elements and ensure consistency.
- There’s a demo for every [type setting in storybook](https://googleforcreators.github.io/web-stories-wp/storybook/?path=/story/designsystem-components-typography-display--default).

Circular dependencies

- If you are adding a component and you need to reference anything in the design-system you’ll need to import it from its nearest location. Do not import it from the top level index.
- While this works just fine in the app (because you’re outside of the design system), storybook will yell at you because it thinks that imports aren’t loaded in time.
- As an example, I’m creating this new `<Taco />` and I need a `<Text />` component. I’d need to `import { Text } from ‘../typography’;` not `../` if I’m in `components/taco`.

## Icons

Icons are separated from components and already exported as `ReactComponent` . You can import them via `/theme/icons` or `/theme`.

### How to add icons

Icons are all located directly in the `design-system/icons/` folder. A few things to note:

- All icons are 32x32px and should never be resized or scaled in any way.
- Icons are named after their symbol, not their function. So a ⚙️  icon is named `Gear`, and not `Settings` or some other function, it might serve.
- If an icon has several sizes, denote this as a suffix as `GearLarge`, `GearTiny` etc.
- If an icon has a border, name it either just as `GearOutline` or as the shape of the border - e.g. `GearTriangle` if it's a gear inside a triangular border.
- Try to group similar icons alphabetically, so name icons e.g. `MagnifierPlus` and `MagnifierMinus` rather than `PlusMagnifier` and `MinusMagnifier`.

The process for adding an icon is as follows:

1. Export your SVG from Figma by selecting the 32x32px icon boundary box and selecting _"Export"_ in the right panel
2. Add the file to directory [design-system/icons](../packages/design-system/src/icons/index.js)
3. Export it from the index of that directory as a ReactComponent (please alphabetize the list, thanks!)
4. Import from the design-system wherever you want to use it.
