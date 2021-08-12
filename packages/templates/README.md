# Templates

This package contains the templates used by the dashboard and the editor (as part of page templates).

## Template Creation

See [External Template Creation](../../docs/external-template-creation.md).

## Generating images for templates

_Note: This script requires the development environment to be running with `DISABLE_OPTIMIZED_RENDERING` so the templates are rendered as components not images._

Run `npm run workflow:render-template-posters` to generate and save the first page of templates as images in the `build/template-posters/` folder. Then move and commit the images to the `static-site` branch.
