# Creating a new template

## Where things are stored

- The **story JSON representation** for each template is stored in [`packages/templates/src/raw/`](https://github.com/google/web-stories-wp/tree/main/packages/templates/src/raw) (in the `main` branch).
- The **SVGs** used in each template are stored in [`assets/src/edit-story/stickers/`](https://github.com/google/web-stories-wp/tree/main/assets/src/edit-story/stickers) (in the `main` branch).
- The (non-SVG) **image &amp; video files** used in each template are stored in [`public/static/main/images/templates/`](https://github.com/google/web-stories-wp/tree/static-site/public/static/main/images/templates) (in the `static-site` branch, using [Git LFS](https://git-lfs.github.com/)).

## Overview

To add a new template to the editor:

1. [Engineer] Commit all SVGs used in the template to the codebase as stickers ([details](#adding-svgs-to-the-codebase-as-stickers)).
2. [Designer] Create a new story in your shared WP environment and replicate the template design.
    - SVGs should already be available in the Stickers panel from step (1) &mdash; click on a sticker to insert it into the story. If you can't find the Stickers Panel, make sure the `enableStickers` experiment is turned on.
    - Upload (drag & drop) images and videos into the story to add them.
3. [Engineer] Commit all images & videos used in the template to the codebase.
    - Filenames should follow the existing convention e.g. `travel_page9_bg.jpg`.
    - Make sure images are not too large &mdash; full-width images should be 1080p, large images should be 720p, and small images should be 480p. See [#6485](https://github.com/google/web-stories-wp/pull/6485) for an example.
    - Make sure videos are 720p.
4. [Engineer] Get the story JSON from your shared WP environment, modify its image & video URLs, and integrate it into the codebase (see [details](#get-the-story-json)).
5. [Both] Verify that new template shows up in the template library and looks as expected.

## Pitfalls

1. Don't upload SVGs as images. SVGs should only be added as stickers in step (1).
2. Avoid "`-<number>`" suffixes on images and videos e.g. `some_image-1.png`. See [details below](#filenames-for-images-and-videos).

## Detailed steps

### Adding SVGs to the codebase as stickers

To add new stickers to the codebase, obtain the raw svg file, and view it in your code editor. Paste the contents of the raw svg file into a react component in `assets/src/edit-story/stickers/<sticker_name>.js`.

Remove extraneous attributes on the base `svg` component and make sure your component takes a `style` property that it applies to the base svg element. Also make sure to remove any explicit `height` and `width` attributes and see that they only are applied to the viewbox. By the end, your component should look something like this:

```js
/* eslint-disable-next-line react/prop-types */
function MySticker({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 <width> <height>"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/*Contents*/}
    </svg>
  );
}
```

At the bottom of the file, make sure there's one default export that exports the svg component and the aspect ratio based off the viewbox:

```js
export default {
  aspectRatio: width / height,
  svg: MySticker,
};
```

The last step of this process is navigating to `assets/src/edit-story/stickers/index.js` and adding your new sticker to the default export object:

```js
//...
/* eslint-disable-next-line import/no-unresolved */
import { default as mySticker } from './mySticker';
export default {
  //...
  mySticker,
};
```

Once you've completed this step, your new sticker should now appear with the other stickers appended to the bottom of the shapes panel if the `enableStickers` feature flag is enabled.

### Inserting stickers (SVGs) into a story

To add stickers to your template story, go to the `Experiments` page (in the left-hand sidebar under the `Stories` section) and check the `Enable Stickers` checkbox. 

Once turned on, all available stickers in the codebase should be available for selection under our base shapes in the shapes library panel.

### Get the story JSON

To get the JSON representation of a story in the editor:

1. In the editor, open the story.
2. Press `Command+Shift+Option+J` (Mac) or `Control+Shift+Alt+J` (Windows/Linux) in the editor.
3. A dialog will appear where you can copy/paste story JSON.

#### Alternative

Another way to get the story JSON is by inspecting the network request that saves the story to the backend.

1. In the editor, open the story.
2. Open `Chrome DevTools > Network`.
3. In the editor, click the "Save draft" button. 
4. You should see a POST XHR with JSON in the request payload. In that payload JSON, find and right-click the `story_data` field and click `Copy value`. 
5. The story JSON should now be copied to your clipboard and ready to paste into a new file.

### Adding story JSON to the codebase as a new template

Once you have the story JSON, several code changes are needed to add it to the list of default templates in the editor.

1. In [`packages/templates/src/raw/`](https://github.com/google/web-stories-wp/tree/main/packages/templates/src/raw), commit your template's story JSON as a new file e.g. `<template_name>.json`.
    - In the JSON, first change all image & video URLs to use `__WEB_STORIES_TEMPLATE_BASE_URL__`. See an [example](https://github.com/google/web-stories-wp/blob/da23d65cbca76c604350464f0538115d280a7a06/packages/templates/src/raw/diy.json#L151).
2. In [`packages/templates/src/getTemplates.js`](https://github.com/google/web-stories-wp/blob/main/packages/templates/src/getTemplates.js), add `"<template_name>"` to the string array in the `getTemplates()` function. 
3. In [`packages/template/src/index.js`](https://github.com/google/web-stories-wp/blob/main/packages/templates/src/index.js), add a new JS object corresponding to the new template with properties `id`, `title`, `tags`, `colors`, etc.
4. Verify in your WP environment that the new template is visible in the editor's "Explore Templates" section.
5. Create a single pull request with all of the changes in steps 1-3.

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
