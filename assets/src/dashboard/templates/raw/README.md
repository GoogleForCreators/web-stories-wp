# Template Generation From Raw Story JSON

This folder is a dumping ground for raw story json outputted by the editor. To convert the json output of a story to a template function simply create a file here titled `<template_name>.json` and copy the raw json into it. Then from your command line, run:
```
TEMPLATE=<template_name> npm run generate-template
```

The generated javascript file containing the template function should appear in the sibling folder `/data/<template_name>.js`.

**Note**
This process may take several seconds to run as linting the several thousand line json can be pretty cpu intensive.

## Getting The Raw Story JSON

To get the raw story json, simply create a new story in the web story editor. Open your network tab and save the story. You should see a network request that contains a large json, this json should have a field in it named `story_data`.

Right click `story_data` and click `Store as global variable`. The variable should now be saved as `temp1`. Go to the console and enter `copy(temp1)`. The story data should now be coppied to your clip board and ready to paste into a file in this folder `templates/raw/<template_name>.json`.

## Formatting Media Names In Story Creation

Wordpress has a naming covention where if you upload an image with the same name multiple times, it adds a `-x` suffix. 

**i.e**
if I upload `some_image.png` 3 times to the wordpress media upload in the story editor, it will store those images as:

```
some_image.png
some_image-1.png
some_image-2.png
```

Because of this, our conversion script will strip the `-x` suffix off of the image source so it can point to the correct image stored in our repo.

This is an important note to make when naming images for upload into a story as **a `-x` suffix will always be stripped**. This naming convention is reserved for wordpress and will break your template creation if you use it in your image naming.