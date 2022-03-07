# SVGs

SVGs (also known as icons) are needed in different formats across this project.

This project uses webpack's [asset modules](https://webpack.js.org/guides/asset-modules/) and [SVGR](https://react-svgr.com/) to convert SVGs into different formats.

**Note**: Each raw SVG must be in a separate file that is named with the `.svg` extension.

## SVGs as Inline Assets

SVGs may be embedded as a small file inline by converting the SVG into a [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).

To use an SVG as a data URL, add the SVG in a folder named `/inline-icons`.

## SVGs as React Components or Images

SVGR is used to transform raw SVGs into React Components or Images so that SVGs can be more easily used in the dashboard and editor.

### Using SVG as a React Component

To use an SVG as React Component, add an SVG in a folder named `/icons`. 

Webpack will see the `/icons` folder and process those SVGs through SVGR. The built file will have a default export that is a react component.

### Using SVG as an Image

To use an SVG as an image, add an SVG in a folder named `/images`. 

Webpack will see the `/images` folder and process those SVGs through SVGR. The built file will have a default export that is an image.
