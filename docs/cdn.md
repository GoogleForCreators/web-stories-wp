# CDN

Large assets to be used by the plugin are hosted on the [wp.stories.google](https://wp.stories.google) site instead of being bundled with the plugin.

This includes, but is not limited to, assets for these areas:

* Plugin activation message
* Get Started story (FTUE)
* Templates

Assets are versioned. Whenever new assets have been added, or existing assets modified, the version will be incremented upon the next release.

## Adding Assets

First, add the new assets to the CDN by following these steps

1. Switch to the `static-site` branch.  
  `git checkout static-site`
2. Modify/add assets as desired in the `public/static/main` folder.
3. Create a new pull request with these changes.

## Usage in the plugin

By default, the plugin will load assets from the `public/static/main` folder.

Only production builds released on WordPress.org will reference the versioned folder, e.g. `puiblic/static/123`.

## Plugin Release

Upon release, the `public/static/main` folder is compared against the latest version.
If there are changes in `main`, the folder is copied to `public/static/<latest+1>`.
