# CDN

Large assets to be used by the plugin are hosted on the [wp.stories.google](https://wp.stories.google) site instead of being bundled with the plugin.

This includes, but is not limited to, assets for these areas:

* Plugin activation message
* Get Started story (FTUE)
* Templates
* Help Center (FTUE)

Assets are versioned. Whenever new assets have been added, or existing assets modified, the version will be incremented upon the next release.

## Git LFS

To keep repository size reasonable, CDN assets are stored with [Git Large File Storage (LFS)](https://docs.github.com/en/github/managing-large-files/about-git-large-file-storage).

In order to be able to add new assets, you have to [install Git LFS](https://docs.github.com/en/github/managing-large-files/installing-git-large-file-storage) on your machine.

You can download it from [git-lfs.github.com](https://git-lfs.github.com/) (or use `brew install git-lfs` if you're on Mac).

Verify that the installation was succcessful:

```bash
$ git lfs install
> Git LFS initialized.
```

**Note:** If the above command prints warning regarding pre-existing Git hooks, run `git lfs update --manual` for instructions on how to merge hooks.

## Adding Assets

**Important:** Make sure Git LFS is installed!

First, add the new assets to the CDN by following these steps:

1. Clone the [GoogleForCreators/wp.stories.google](https://github.com/GoogleForCreators/wp.stories.google) repo.
2. Modify/add assets as desired in the `public/static/main` folder.
3. Create a new pull request with these changes.

## Usage in the plugin

By default, the plugin will load assets from the `public/static/main` folder.

Only production builds released on WordPress.org will reference the versioned folder, e.g. `puiblic/static/123`.

## Plugin Release

Upon release, the `public/static/main` folder is compared against the latest version.
If there are changes in `main`, the folder is copied to `public/static/<latest+1>`.
