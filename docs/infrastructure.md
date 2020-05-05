# Tooling & Infrastructure

## Workflows

### Update list of available fonts

The project bundles an up-to-date list of available fonts from Google Fonts (plus some system fonts) that can be used in the editor.

A workflow exists that automatically updates the list every time Google Fonts updates its catalogue. However, it can also be done manually if needed.

A [Google Fonts API key](https://developers.google.com/fonts/docs/developer_api) is required to update said list. Check out the [Google fonts docs](https://developers.google.com/fonts/docs/developer_api) to learn how to obtain one.

Once obtained, follow these steps to configure the project appropriately:

```bash
export GOOGLE_FONTS_API_KEY=your-api-key
npm run build:fonts
```

This script does the following:

1. Downloads all available fonts from Google Fonts to `includes/data/fonts.json`.
1. Merges font list with a set of system fonts and prepares them for usage in the editor.
1. Saves changes to `includes/data/fonts.json`.
