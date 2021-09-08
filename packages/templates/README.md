# Templates

This package contains the templates used by the dashboard and the editor (as part of page templates).

## Template Creation

See [External Template Creation](../../docs/external-template-creation.md).

## Generating images for templates

Run `npm run workflow:render-template-posters` to generate and save each template page as an image in the `build/template-posters/` folder. Then move and commit the images to the `static-site` branch under `public/static/main/images/templates/<template-name>/posters`.

You will want to run the png through [ImageOptim](https://imageoptim.com/howto.html) and also create a [WebP](https://developers.google.com/speed/webp) version of each png. Save both to the template poster directory.
