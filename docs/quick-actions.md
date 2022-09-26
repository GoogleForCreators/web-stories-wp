# Quick Actions

Some actions are cumbersome in the editor as it's difficult to find them in the Design panel. The quick actions menu allows users to perform actions and locate specific panels in the editor.

## Overview

Quick actions hook into the `highlight` api that is used in the pre-publish checklist. Using this, the quick actions can highlight specific panels in the editor.

The quick action menu is located in the nav layer. This allows users to navigate around using the keyboard in an intuitive way. Clicking the quick action menu should not remove focus from any elements that have focus.

Quick actions have two main functions:

1. Focusing a specific part of the editor
2. Editing an element in the canvas

Quick actions are not limited to just the above functionality. In the future it may be necessary to add more functionality.

### Action Types

The actions that are displayed dynamically change depending on which element type is selected. These are outlined below:

| Selected Element Type | Available actions                                                                                         |
|-----------------------|-----------------------------------------------------------------------------------------------------------|
| Nothing selected      | - Change background color<br/>- Insert media <br/>- Insert text                                           |
| Background Image      | - Replace background<br/>- Add animation* <br/>- Clear filters and animation                              |
| Foreground Image      | - Replace media<br/>- Add animation* <br/>- Add link<br/>- Clear animation                                |
| Video                 | - Replace media<br/>- Add animation* <br/>- Add link<br/>- Add captions<br/>- Clear filters and animation |
| Shape                 | - Change color<br/>- Add animation* <br/>- Add link<br/>- Clear filters and animation                     |
| Text                  | - Change color<br/>- Edit text<br/>- Add animation*<br/>- Add link<br/>- Clear animation                  |

### Action functionality

Reference this table when needing to know what a quick action will do when clicked.

| Quick Action                          | Result                                                                                                                                                                                                                        |
|---------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Add animation*                        | Open and highlight the `animation` panel in the `design pane`. Focus the effect chooser dropdown.                                                                                                                             |
| Add caption                           | Open and highlight the `captions and subtitles` panel in the `design pane`. Focus the input.                                                                                                                                  |
| Add link                              | Open and highlight the `link` panel in the `design pane`. Focus the input.                                                                                                                                                    |
| Change background color               | Open and highlight the `page background` panel in the `design pane`. Focus the input.                                                                                                                                         |
| Clear animation/filters and animation | Remove all filters and/or animations as specified. Display a snackbar to the user indicating that they were removed. The snackbar will contain an action button that when clicked will re-apply the styles that were removed. |
| Edit text                             | Open and highlight the `text` panel in the `design pane`. Focus the first input.                                                                                                                                              |
| Insert media                          | Open and highlight the `media pane` in the `library`. Focus the media tab button.                                                                                                                                             |
| Insert text                           | Open and highlight the `text pane` in the `library`. Focus the text tab button.                                                                                                                                               |
| Replace background/media              | Open and highlight one of the media panes in the `library`. The media pane opened will depend on the type of the element selected. Focus the relevant tab button.                                                             |
| Trim video                            | Enter video trim mode similar to button in design panel.                                                                                                                                                                      |

> *_Add animation_ action is not available on the first page of a story.

### Visibility

The quick actions menu is visible when:

1. there are no elements selected or 
2. if a single element is selected (including the background)

This feature does not support selecting multiple elements, so the menu will be hidden if more than one element is selected.

## Adding new quick actions

Quick actions hook into the highlight api. To add a new quick action, the following steps must be completed. If you are not highlighting, skip the first two steps:

1. If it doesn't already exist, add a key to `packages/story-editor/src/app/highlights/states.js` that will reference the panel/pane/element that you are trying to highlight.
2. Attach the new highlight state to the panel/pane/element that will be focused with the `useHighlights()` context. See existing usages for an example.
3. Create the quick action in the `useQuickActions` hook located at `packages/story-editor/src/app/highlights/quickActions/useQuickActions.js`

## Technical notes and considerations

### Focus

Clicking the quick action menu should not remove focus from an element. To do this, two things were added:

1. An `onMouseDown` event handler is passed to the buttons. This event handler prevents the mouse down event from unfocusing the canvas element.
2. The context menu is given an `onMouseDown` event handler to prevent mouse  events on the menu _in between the buttons_ from bubbling up and unfocusing the element in the canvas.

A user should be able to navigate the quick actions menu with their keyboard.

### Highlights

This feature uses the `highlights` api that was implemented in [this pr: #6150](https://github.com/googleforcreators/web-stories-wp/pull/5965).

### Testing

In order to prevent regression testing, unit and karma tests have been created. It is recommended to add a karma test for each new quick action to make sure that it behaves properly.
