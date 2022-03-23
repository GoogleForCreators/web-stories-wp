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

<details>

<summary>Page element actions</summary>

|Action text|Action description|
|--|--|
|Add new page after|Adds a page after the current page.|
|Add new page before|Adds a page before the current page.|
|Duplicate page|Creates a new page that is identical to the current page. All animations, styles, and elements should be the same.|
|Delete page|Deletes the current page (if the page can be deleted).|

</details>

<details>

<summary>Text element actions</summary>

|Action text|Action description|
|--|--|
|Send to back|Set the text element behind all other elements on the page.|
|Send backward|Bring the text element backward one layer.|
|Bring forward|Bring the text element forward one layer.|
|Bring to front|Set the text element in front of all elements on the page.|
|Copy style|The styles of the selected text element are copied to the clipboard. A snackbar is displayed on completion.|
|Paste style|The styles that are saved to the clipboard are pasted to the currently selected text box. This does not update the text in the textbox. A snackbar is shown on completion.|
|Add style to "Saved styles"|The style of the currently selected textbox is saved to the "Saved styles" panel in the sidebar. This action opens the design tab, opens the "Saved styles" panel, and collapses all other panels in the sidebar. The "Saved styles" panel should be highlighted when opened.|
|Add color to "Saved colors"|The color(s) of the currently selected textbox is saved to the "Saved colors" panel in the sidebar. This action opens the design tab, opens the "Saved colors" panel, and collapses all other panels in the sidebar. The "Saved colors" panel should be highlighted when opened. A snackbar is displayed on completion.|

</details>

<details>

<summary>Background media actions</summary>

|Action text|Action description|
|--|--|
|Detach image from background|Removes the media from the background of the page and sets it in the foreground.|
|Scale & crop background image|Show the scale and crop UI so that the user may scale or crop the image to the desired size.|

</details>

<details>

<summary>Foreground media actions</summary>

|Action text|Action description|
|--|--|
|Send to back|Place media behind all other elements. Disabled if the layer is all the way back.|
|Send backward|Bring media one layer backwards. Disabled if the layer is all the way back.|
|Bring forward|Bring media one layer forwards. Disabled if the layer is all the way forward.|
|Bring to front|Place media in front of all other elements. Disabled if the element is all the way forward.|
|Copy image styles|Copy all styles applied to the media to the clipboard. A snackbar is displayed on completion.|
|Paste image styles|Add all styles in the clipboard to the selected media. A snackbar is displayed on completion.|

</details>

<details>

<summary>Shape element actions</summary>

|Action text|Action description|
|--|--|
|Send to back|Place shape behind all other elements. Disabled if the layer is all the way back.|
|Send backward|Bring shape one layer backwards. Disabled if the layer is all the way back.|
|Bring forward|Bring shape one layer forwards. Disabled if the layer is all the way forward.|
|Bring to front|Place shape in front of all other elements. Disabled if the element is all the way forward.|
|Copy shape styles|Copy styles from the shape to the clipboard. A snackbar is displayed on completion.|
|Paste shape styles|Add styles from the clipboard to the selected shape. A snackbar is displayed on completion.|
|Add color to "Saved colors"|The color(s) of the currently selected shape is saved to the "Saved colors" panel in the sidebar. This action opens the design tab, opens the "Saved colors" panel, and collapses all other panels in the sidebar. The "Saved colors" panel should be highlighted when opened. A snackbar is displayed on completion.|

</details>

## Technical notes and considerations

### Copying and pasting styles

When a user right clicks elements, they may be given the option to copy an element's styles and paste them to another element of the same type.

**Note**: This does not override all styles of the element. Only styles that are in the table below are able to be copied and pasted:

|Element type|Properties that are copy/paste-able|
|--|--|
|Text|- `backgroundColor`<br/>- `backgroundTextMode`<br/>- `border`<br/>- `border-radius`<br/>- `flip`<br/>- `font`<br/>- `fontSize`<br/>- `lineHeight`<br/>- `opacity`<br/>- `padding`<br/>- `rotationAngle`<br/>- `textAlign`|
|Foreground Media|- `border`<br/>- `border-radius`<br/>- `flip`<br/>- `opacity`<br/>- `overlay`<br/>- `rotationAngle`|
|Shape|- `backgroundColor`<br/>- `flip`<br/>- `opacity`<br/>- `rotationAngle`|

A user may copy styles from any text, foreground media, and shape element. A user may not copy background media element styles.

Once styles are copied, a user may select an element of the same type and 'paste' those onto the selected element. The selected element's properties will be overridden by the 'copied' styles.

### Testing 

In order to prevent regression testing, unit and karma tests have been created. It is recommended to add a karma test for each new right click action to make sure that it behaves properly.
