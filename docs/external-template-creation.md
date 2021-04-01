# Creating a new template

## Where things are stored

- The **story JSON representation** for each template is stored in [`packages/templates/src/raw/`](https://github.com/google/web-stories-wp/tree/main/packages/templates/src/raw) (in the `main` branch).
- The **SVGs** used in each template is stored in [`assets/src/edit-story/stickers/`](https://github.com/google/web-stories-wp/tree/main/assets/src/edit-story/stickers) (in the `main` branch).
- The (non-SVG) **image &amp; video files** used in each template is stored in [`public/static/main/images/templates/`](https://github.com/google/web-stories-wp/tree/static-site/public/static/main/images/templates) (in the `static-site` branch, using [Git LFS](https://git-lfs.github.com/)).

## Overview

To add a new template to the editor:

1. [Engineer] Commit all SVGs used in the template to the codebase as stickers ([details](#adding-svgs-to-the-codebase-as-stickers)).
2. [Designer] Create a new story in your local WP environment and replicate the template design.
    - SVGs should already be available in the Stickers panel from step (1) &mdash; click on a sticker to insert it into the story. If you can't find the Stickers Panel, make sure the `enableStickers` experiment is turned on.
    - Upload (drag & drop) images and videos into the story to add them.
3. [Engineer] Commit all images & videos used in the template to the codebase.
    - Make sure images are not too large &mdash; full-width images should be 1080p, large images should be 720p, and small images should be 480p. See [#6485](https://github.com/google/web-stories-wp/pull/6485) as an example.
    - Make sure videos are 720p.
4. [Engineer] Get the story JSON ([details](#get-the-story-json)) and commit it to the codebase.
    - Replace image & video URLs in the JSON with the `replaceme.com` placeholder.
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

To add stickers to your template, it's as easy as going to the experiments and enabling the `enableStickers` flag. Once turned on, all available stickers in the codebase should be available for selection under our base shapes in the shapes library panel.

### Get the story JSON

To get the raw story json, simply open up a story in the web story editor with the devtools network tab open and press `save`. You should see the the story's json show up in the network tab. In that json, right click the `story_data` field and click `Store as global variable`. Go to the devtools console and type 

```javascript
copy(temp1)
```

When you press enter the story data should now be copied to your clipboard and ready to paste where you need.

**Note**: `Command+Shift+Option+J / Control+Shift+Alt+J` in the story editor opens up a dialog you can copy/paste raw story json to/from. However this is missing some fields `story_data` contains which are necessary for versioning the external templates.

### Adding story JSON to the codebase as a new template

Once you've added your template's raw story json to `packages/templates/src/raw/<template_name>.json`, you can import it into `packages/templates/src/getTemplates` and add to the function `loadTemplates(imageBaseUrl)`. It should then be accessible in `packages/templates/src/index`.

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
