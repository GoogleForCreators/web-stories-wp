# Creating an External Template

`src/dashbpard/templates/raw` is a dumping ground for raw story json output from the editor, which is then interpreted as a template.

## Getting The Raw Story JSON

To get the raw story json, simply open up a story in the web story editor with the devtools network tab open and press `save`. You should see the the story's json show up in the network tab. In that json, right click the `story_data` field and click `Store as global variable`. Go to the devtools console and type 

```javascript
copy(temp1)
```

When you press enter the story data should now be copied to your clipboard and ready to paste where you need.

**Note**`Command+Shift+Option+J / Control+Shift+Alt+J` in the story editor opens up a dialog you can copy/paste raw story json to/from. However this is missing some fields `story_data` contains which are necessary for versioning the external templates.

## Formatting Media Names In Story Creation

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

## Adding Your Template

Once you've added your template's raw story json to `src/dashboard/templates/raw/<template_name>.json`, you can import it into `src/dashboard/templates/getTemplates` and add to the function `loadTemplates(imageBaseUrl)`. It should then be accessible in `src/dashboard/templates/index`.
