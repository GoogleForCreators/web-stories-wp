# Right Click Menu (Context Menu)

The Right-click Menu provides additional functionality to the user. The actions displayed on this Menu will change depending on which type of Element the user has selected on the canvas: Page, Text, Media, or Shapes.

## Overview

Right click menu will give the user a right click menu that is intuitive to use in the editor. Using this custom context menu, the user will be able to edit element style properties, store data in the clipboard, and paste data from their clipboard back into the editor.

### Right click menu action types

|Group|Description|
|--|--|
|Main actions|These options can apply across any element or media|
|Layer distribution options/actions|These options help the user move the selected element between the different layers (objects in the canvas)|
|Element styling options/actions|These options help the user manage the Element's style properties||
|Page action options|These options help the user manage the different Pages in the story|

### Actions

Different actions will be rendered depending on the Element that is right clicked. The actions will do the following:

#### Page element

|Action text|Action description|
|--|--|
|Copy|Copies the page styles from the current page to the clipboard. This does not create a new page.|
|Paste|Pastes the page styles from the clipboard to the current page.|
|Delete|Deletes the current page (if the page can be deleted).|
|Add new page after|Adds a page after the current page.|
|Add new page before|Adds a page before the current page.|
|Duplicate page|Creates a new page that is identical to the current page. All animations, styles, and elements should be the same.|
|Delete page|Deletes the current page (if the page can be deleted).|

#### Text element

|Action text|Action description|
|--|--|
|Copy|Copies the text and the text styles to the clipboard.|
|Paste|Pastes the text and the text styles from the clipboard. This creates a new text element.|
|Delete|Deletes the currently selected text element.|
|Send to back|Set the text element behind all other elements on the page.|
|Send backward|Bring the text element backward one layer.|
|Bring forward|Bring the text element forward one layer.|
|Bring to front|Set the text element in front of all elements on the page.|
|Copy style|The styles of the selected text element are copied to the clipboard. A snackbar is displayed on completion.|
|Paste style|The styles that are saved to the clipboard are pasted to the currently selected text box. This does not update the text in the textbox. A snackbar is shown on completion.|
|Add style to "Saved styles"|The style of the currently selected textbox is saved to the "Saved styles" panel in the inspector. This action opens the design tab, opens the "Saved styles" panel, and collapses all other panels in the inspector. The "Saved styles" panel should be highlighted when opened.|
|Add color to "Saved colors"|The color(s) of the currently selected textbox is saved to the "Saved colors" panel in the inspector. This action opens the design tab, opens the "Saved colors" panel, and collapses all other panels in the inspector. The "Saved colors" panel should be highlighted when opened. A snackbar is displayed on completion.|

#### Background Media (images, gifs, videos) element

|Action text|Action description|
|--|--|
|Copy|Copies the media and styles that are set to be the background to the clipboard.|
|Paste|Pastes the media and styles from the clipboard to be the page background. This does not create a new element.|
|Delete|Deletes the background media and styles.|
|Detach image from background|Removes the media from the background of the page and sets it in the foreground.|
|Replace background image|TBD (should the button only highlight the library, or prompt the user to replace it, how would this work, etc.)|
|Scale & crop background image|Show the scale and crop UI so that the user may scale or crop the image to the desired size.|
|Clear style|Remove all styles currently applied to the background media. A snackbar is displayed on completion.|

#### Foreground Media (images, gifs, videos) element

|Action text|Action description|
|--|--|
|Copy|Copies the media and styles to the clipboard.|
|Paste|Pastes the media and styles to be the page. This creates a new element.|
|Delete|Deletes the media.|
|Send to back|Place media behind all other elements. Disabled if the layer is all the way back.|
|Send backward|Bring media one layer backwards. Disabled if the layer is all the way back.|
|Bring forward|Bring media one layer forwards. Disabled if the layer is all the way forward.|
|Bring to front|Place media in front of all other elements. Disabled if the element is all the way forward.|
|Copy image styles|Copy all styles applied to the media to the clipboard. A snackbar is displayed on completion.|
|Paste image styles|Add all styles in the clipboard to the selected media. A snackbar is displayed on completion.|
|Clear image styles|Remove all styles from the currently selected media. A snackbar is displayed on completion.|

#### Shape element

|Action text|Action description|
|--|--|
|Copy|Copy the shape and styles to the clipboard.|
|Paste|Paste the shape and styles to the page. This creates a new element.|
|Delete|Remove the shape and styles from the page.|
|Send to back|Place shape behind all other elements. Disabled if the layer is all the way back.|
|Send backward|Bring shape one layer backwards. Disabled if the layer is all the way back.|
|Bring forward|Bring shape one layer forwards. Disabled if the layer is all the way forward.|
|Bring to front|Place shape in front of all other elements. Disabled if the element is all the way forward.|
|Copy shape styles|Copy styles from the shape to the clipboard. A snackbar is displayed on completion.|
|Paste shape styles|Add styles from the clipboard to the selected shape. A snackbar is displayed on completion.|
|Add color to "Saved colors"|The color(s) of the currently selected shape is saved to the "Saved colors" panel in the inspector. This action opens the design tab, opens the "Saved colors" panel, and collapses all other panels in the inspector. The "Saved colors" panel should be highlighted when opened. A snackbar is displayed on completion.|

## Technical notes and considerations

### Clipboard API

The right click menu leverages the new [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API). This api requires user permission to be set when pasting data from the clipboard since it can be dangerous to let applications paste data that they have set themselves.

A user may copy anything they want from the canvas using the right click menu. However, the user may not paste until this permission is granted to the application.

### Testing 

In order to prevent regression testing, unit and karma tests have been created. It is recommended to add a karma test for each new right click action to make sure that it behaves properly.
