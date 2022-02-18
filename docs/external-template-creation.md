# Creating a new template

## Where things are stored

- The **story JSON representation** for each template is stored in [`packages/templates/src/raw/`](https://github.com/googleforcreators/web-stories-wp/tree/main/packages/templates/src/raw) (in the `main` branch).
- The **SVGs** used in each template are stored in [`packages/stickers/src/`](https://github.com/googleforcreators/web-stories-wp/tree/main/packages/stickers/src) (in the `main` branch).
- The (non-SVG) **image &amp; video files** used in each template are stored in [`public/static/main/images/templates/`](https://github.com/GoogleForCreators/wp.stories.google/tree/main/public/static/main/images/templates) (in the [GoogleForCreators/wp.stories.google](https://github.com/GoogleForCreators/wp.stories.google) repo, using [Git LFS](https://git-lfs.github.com/)).

## Overview

To add a new template to the editor:

1. [Engineer] Commit all SVGs used in the template to the codebase as stickers ([details](#adding-svgs-to-the-codebase-as-stickers)).
2. [Designer] Create a new story in your shared WP environment and replicate the template design.
    - SVGs should already be available in the Stickers panel from step (1) &mdash; click on a sticker to insert it into the story.
    - Upload (drag & drop) images and videos into the story to add them.
3. [Engineer] Commit all images & videos used in the template to the codebase.
    - Filenames should follow the existing convention e.g. `travel_page9_bg.jpg`.
    - Make sure images are not too large &mdash; full-width images should be 1080p, large images should be 720p, and small images should be 480p. See [#6485](https://github.com/googleforcreators/web-stories-wp/pull/6485) for an example.
    - Make sure videos are 720p.
    - Make sure caption files are also committed along with the videos, when available.
4. [Engineer] Get the story JSON from your shared WP environment, modify its image & video URLs, and integrate it into the codebase (see [details](#get-the-story-json)).
5. [Both] Verify that new template shows up in the template library and looks as expected.

## Pitfalls

1. Don't upload SVGs as images. SVGs should only be added as stickers in step (1).
2. Avoid "`-<number>`" suffixes on images and videos e.g. `some_image-1.png`. See [details below](#filenames-for-images-and-videos).

## Detailed steps

### Adding SVGs to the codebase as stickers

To add new stickers to the codebase, obtain the raw svg file, and view it in your code editor. Paste the contents of the raw svg file into a react component in `packages/stickers/src/<template_name>/<sticker_name>.js`.

Remove extraneous attributes on the base `svg` component and make sure your component takes a `style` property that it applies to the base svg element. Also make sure to remove any explicit `height` and `width` attributes and see that they only are applied to the viewbox. Lastly, be sure to add a title for accessibility. By the end, your component should look something like this:

```js
const title = __('Some Descriptor', 'web-stories');
function MySticker({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 <width> <height>"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      {/*Contents*/}
    </svg>
  );
}
```

At the bottom of the file, make sure there's one default export that exports the svg component and the aspect ratio based off the viewbox as well as the human readable title:

```js
export default {
  aspectRatio: width / height,
  svg: MySticker,
  title,
};
```

Create a new `index.js` file under your `<template_name>` directory and add your new sticker to the export object:

```js
//...
export { default as  mySticker } from './mySticker';
```

The last step of this process is navigating to `packages/stickers/src/index.js` and adding your new stickers to the default export object:

```js
//...
import * as myStickers from './<template_name>';
export default {
  //...
  ...myStickers,
};
```

Once you've completed this step, your new sticker should now appear with the other stickers appended to the bottom of the shapes panel.

### Inserting stickers (SVGs) into a story

To add stickers to your template story, go to the `Experiments` page (in the left-hand sidebar under the `Stories` section) and check the `Enable Stickers` checkbox.

Once turned on, all available stickers in the codebase should be available for selection under our base shapes in the shapes library panel.

### Get the story JSON

To get the JSON representation of a story in the editor:

1. In the editor, open the story.
2. Press `Command+Shift+Option+J` (Mac) or `Control+Shift+Alt+J` (Windows/Linux) in the editor.
3. A dialog will appear where you can copy/paste story JSON.
4. Check the `Template` checkbox that is present at the top of the dialog.

   <img width="554" alt="Screenshot of the dev tools with the Templates checkbox" src="https://user-images.githubusercontent.com/6906779/125189481-efe82c80-e255-11eb-93dd-ca875d514f54.png">


#### Alternative

Another way to get the story JSON is by inspecting the network request that saves the story to the backend.

1. In the editor, open the story.
2. Open `Chrome DevTools > Network`.
3. In the editor, click the "Save draft" button.
4. You should see a POST XHR with JSON in the request payload. In that payload JSON, find and right-click the `story_data` field and click `Copy value`.
5. The story JSON should now be copied to your clipboard and ready to paste into a new file.

### Adding story JSON to the codebase as a new template

Once you have the story JSON, several code changes are needed to add it to the list of default templates in the editor.

1. In [`packages/templates/src/raw/`](https://github.com/googleforcreators/web-stories-wp/tree/main/packages/templates/src/raw), create a new directory `<template_name>` for your template. Now add your template's story JSON in a new file e.g. `<template_name>/template.json`.
   - Make following changes to the template JSON,
      - Reset following extraneous properties,
        - `current: null`
        - `selection: []`
        - `story: {}`
      - First change all image & video URLs to use `__WEB_STORIES_TEMPLATE_BASE_URL__` as the base, which then will be replaced by the CDN url.
      - Ensure to also change poster image URLs to use `__WEB_STORIES_TEMPLATE_BASE_URL__`.
      - Change `posterId` and `id` for all elements of type image and video to `0`, these are the WP media ids that are not used in templates.
      - Make sure that the images and videos have appropriate title and alt text set for better accessibility.

   - If the story JSON is copied from the devTools dialog as mentioned  in [Get The Story JSON](#get-the-story-json), the JSON will have some of the changes already present.
     - The 'Template' checkbox does following:
       - Resets extraneous properties.
       - Changes resource URLs to use replaceable CDN constant
       - Resets `sizes` property for images to `[]`.
       - Resets all `id` and `posterId` to 0 for image and video type resources.

      NOTE: Check all resource URLs and properties are set properly before commiting the template.
      
2. Create a new file `metaData.js` in your newly created `<template_name>` directory. Your `<template_name>/metaData.js` file would then look something like this with object corresponding to the new template and properties `id`, `title`, `tags`, `colors`, `creationDate`, etc. 

    ```javascript
       //...
      /**
       * External dependencies
       */
      import { __, _x } from '@googleforcreators/i18n';

      export default {
        slug: 'template-name',
        creationDate: '2021-07-12T00:00:00.000Z',
        title: _x('Your Template Title', 'template name', 'web-stories'),
        tags: [
          _x('Tags', 'template keyword', 'web-stories'),
        ],
        // Array of color objects with name and hex values.
        colors: [
          { label: _x('Blue', 'color', 'web-stories'), color: '#1f2a2e' },
        ],
        description: __(
          'A short text describing your story template.',
        'web-stories'
        ),
        vertical: _x('Vertical name', 'template vertical', 'web-stories'),
      };
    ```

3. Create a new file `index.js` in your newly created `<template_name>` directory and import the `template.json` file and `metaData.js` file. Your `<template_name>/index.js` file would then look something like this:

    ```javascript
      //...
      /**
       * Internal dependencies
       */
      import { default as template } from './template';
      import { default as metaData } from './metaData';

      export default {
        ...metaData,
        ...template,
      };
    ```

4. In [`packages/templates/src/getTemplates.js`](https://github.com/googleforcreators/web-stories-wp/blob/main/packages/templates/src/getTemplates.js), add `"<template_name>"` to the string array in the `getTemplates()` function.
5. Verify in your WP environment that the new template is visible in the editor's "Explore Templates" section.
6. Create a single pull request with all of the changes in steps 1-3.

### Adding SVGs to the codebase as shapes

First and foremost, shapes aren't complete svgs, just a single normalized path (coordinates should be defined in a 0->1 space). To accommodate for this, there are a few formatting steps that must be taken in an svg editing software (like illustrator), and a few steps within the codebase to get a proper working path in the editor.

#### Getting your svg to be a single path

Since we must have a single path, we can't utilize any other aspects of the svg spec. This means all shapes must be converted to a single path in the svg editing software of your choosing. For the purposes here, we will outline the steps in illustrator because it's what we've used thus far, but these svg operations should be applicable to other programs as well.

- Open svg file in illustrator
- Select shape
- (If there's any stroke) Click on `Object -> Path -> Outline Stroke`
- Make sure your shape is selected and click `Object -> Compound Path -> Make`
- Open your code editor to any scratch pad svg file (will just be using this file for copy and pasting, won't save it at all)
- Select svg in illustrator and copy
- Paste into your code editor

In your editor, you should see something like this:

```svg
<!-- Generator: Adobe Illustrator 23.0.1, SVG Export Plug-In  -->
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="392px"
	 height="392px" viewBox="0 0 392 392" style="enable-background:new 0 0 392 392;" xml:space="preserve">
<style type="text/css">
	.st0{fill:#FFFFFF;}
</style>
<defs>
</defs>
<path class="st0" d="M392,196c0,108.25-87.75,196-196,196S0,304.25,0,196S87.75,0,196,0S392,87.75,392,196z M196,30
	c-44.34,0-86.03,17.27-117.38,48.62C47.27,109.97,30,151.66,30,196s17.27,86.03,48.62,117.38C109.97,344.73,151.66,362,196,362
	s86.03-17.27,117.38-48.62C344.73,282.03,362,240.34,362,196s-17.27-86.03-48.62-117.38C282.03,47.27,240.34,30,196,30 M196,0
	c108.25,0,196,87.75,196,196s-87.75,196-196,196S0,304.25,0,196S87.75,0,196,0L196,0z"/>
</svg>
```

If your svg markup consists of anything other than a single path, you must go back to your svg editing application and keep playing with it until you can copy the svg into your code editor and it only consists of a single path.

In the path's `d` attribute you'll see a mix of numbers and letters. The letters are draw commands and the numbers after it specify coordinate arguments for the draw command. Those coordinates are drawn relative to the coordinate space depicted in the `viewBox` attribute. It's important that the path fits nicely in the viewbox. For Illustrator it creates the viewbox & path coordinates based on the bounding box of all selected elements you're copying onto your clipboard. If you need to alter the path to be drawn relative to a slightly larger viewbox, you can always place a square/rectangle (larger than original selected elements) within the selected elements before copying over to your editor to dictate the size of the viewbox and illustrator will update the path coordinates accordingly.

#### Normalizing your svg path

All the svg paths in the shapes panel are declared in a 0->1 coordinate space. In theory you could scale down your svg in illustrator and it would update the path coordinates accordingly, but we found that Illustrator lacks the level of precision needed for large shapes with small details. This can lead to necessary parts of your path getting rounded off. To accommodate for this, we created a little node script you can run your svg path through and it will normalize the path with a much higher level of precision that won't round off details in your shape.

This script is located in `bin/normalize-path.js`. You'll need to copy the path and viewbox from your scratchpad svg file and paste them into the resize command in that file like so:

```javascript
console.log(
  resize(
    // viewBox width
    392,
    // viewBox height
    392,
    // path that you're normalizing
    `M392,196c0,108.25-87.75,196-196,196S0,304.25,0,196S87.75,0,196,0S392,87.75,392,196z M196,30
	c-44.34,0-86.03,17.27-117.38,48.62C47.27,109.97,30,151.66,30,196s17.27,86.03,48.62,117.38C109.97,344.73,151.66,362,196,362
	s86.03-17.27,117.38-48.62C344.73,282.03,362,240.34,362,196s-17.27-86.03-48.62-117.38C282.03,47.27,240.34,30,196,30 M196,0
	c108.25,0,196,87.75,196,196s-87.75,196-196,196S0,304.25,0,196S87.75,0,196,0L196,0z`
  )
);
```

You can then save the file and run the command:

```bash
node bin/normalize-path
```

It should output a normalized path like this in the console:

```javascript
M 1.000000 , 0.500000 c 0.000000 , 0.276148 -0.223852 , 0.500000 -0.500000 , 0.500000 S 0.000000 , 0.776148 , 0.000000 , 0.500000 S 0.223852 , 0.000000 , 0.500000 , 0.000000 S 1.000000 , 0.223852 , 1.000000 , 0.500000 z  M 0.500000 , 0.076531 c -0.113112 , 0.000000 -0.219464 , 0.044056 -0.299439 , 0.124031 C 0.120587 , 0.280536 , 0.076531 , 0.386888 , 0.076531 , 0.500000 s 0.044056 , 0.219464 , 0.124031 , 0.299439 C 0.280536 , 0.879413 , 0.386888 , 0.923469 , 0.500000 , 0.923469 s 0.219464 -0.044056 , 0.299439 -0.124031 C 0.879413 , 0.719464 , 0.923469 , 0.613112 , 0.923469 , 0.500000 s -0.044056 -0.219464 -0.124031 -0.299439 C 0.719464 , 0.120587 , 0.613112 , 0.076531 , 0.500000 , 0.076531 M 0.500000 , 0.000000 c 0.276148 , 0.000000 , 0.500000 , 0.223852 , 0.500000 , 0.500000 s -0.223852 , 0.500000 -0.500000 , 0.500000 S 0.000000 , 0.776148 , 0.000000 , 0.500000 S 0.223852 , 0.000000 , 0.500000 , 0.000000 L 0.500000 , 0.000000 z
```

#### Creating a shape from your normalized path

Copy the outputted path from your terminal and navigate to `packages/story-editor/src/masks/constants.js`. In that file create a new key describing your shape in `MaskTypes`. For the shape shown above an apt description would be something like:

```javascript
export const MaskTypes = {
  ...
  [RING]: 'ring',
};
```

Then navigate down to `CLIP_PATHS` and add your normalized path like so:

```javascript
const CLIP_PATHS = {
  ...,
  [MaskTypes.RING]: `M 1.000000 , 0.500000 c 0.000000 , 0.276148 -0.223852 , 0.500000 -0.500000 , 0.500000 S 0.000000 , 0.776148 , 0.000000 , 0.500000 S 0.223852 , 0.000000 , 0.500000 , 0.000000 S 1.000000 , 0.223852 , 1.000000 , 0.500000 z  M 0.500000 , 0.076531 c -0.113112 , 0.000000 -0.219464 , 0.044056 -0.299439 , 0.124031 C 0.120587 , 0.280536 , 0.076531 , 0.386888 , 0.076531 , 0.500000 s 0.044056 , 0.219464 , 0.124031 , 0.299439 C 0.280536 , 0.879413 , 0.386888 , 0.923469 , 0.500000 , 0.923469 s 0.219464 -0.044056 , 0.299439 -0.124031 C 0.879413 , 0.719464 , 0.923469 , 0.613112 , 0.923469 , 0.500000 s -0.044056 -0.219464 -0.124031 -0.299439 C 0.719464 , 0.120587 , 0.613112 , 0.076531 , 0.500000 , 0.076531 M 0.500000 , 0.000000 c 0.276148 , 0.000000 , 0.500000 , 0.223852 , 0.500000 , 0.500000 s -0.223852 , 0.500000 -0.500000 , 0.500000 S 0.000000 , 0.776148 , 0.000000 , 0.500000 S 0.223852 , 0.000000 , 0.500000 , 0.000000 L 0.500000 , 0.000000 z`,
```

Lastly go down to `MASKS` and add an entry for your newly updated mask:

```javascript
export const MASKS = [
  ...,
  {
      {
    type: MaskTypes.RING,
    showInLibrary: true, // mark this as true if you would like the shape to be user facing
    name: _x('Ring', 'shape/mask name', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.RING],
    ratio: 392 / 392, // <Width of svg viewbox coppied from illustrator> / <Height>
  },
  }
];
```

That's it! After you recompile your application you should now see your new shape show up in the shapes panel of the editor.


## Appendix

### Filenames for images and videos

WordPress has a naming convention where if you upload an image with the same name multiple times, it adds a `-x` suffix.

**i.e**
if I upload `some_image.png` 3 times to the WordPress media upload in the story editor, it will store those images as:

```javascript
// some_image.png
// some_image-1.png
// some_image-2.png
```

Because of this, our conversion script will strip the `-x` suffix off of the image source so it can point to the correct image stored in our repo.

This is an important note to make when naming images for upload into a story as **a `-x` suffix will always be stripped**. This naming convention is reserved for WordPress and will break your template creation if you use it in your image naming.
