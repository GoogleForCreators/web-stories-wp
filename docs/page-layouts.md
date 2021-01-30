# Page Layouts

Page layouts allow people to apply individual pages defined in templates to their story without choosing an entire template. Page layouts are based on the same JSON definitions as templates defined in `src/dashboard/templates/raw`.

## How Page Layouts differ from Template Pages

Since page layouts are based on the same source files as page layouts, some customization of raw templates is required for them to work correctly with Page Layouts.

### Page Layout Types and Naming

In the page layouts pane, pages are labeled and able to be filtered by their page type (Examples: Cover, Section, Quote, ...). These types are defined in the source template's raw JSON.

To set page layout type for a template page, set `pageLayoutType` on the template JSON's page objects to one of the types defined at `src/edit-story/components/library/panes/pageLayouts/constants.js`. If `pageLayoutType` is set to `null`, the page will be omitted from the page layouts pane.

Page Layouts are named based on their original Template Name + Page Layout Type like "Cooking Cover".

### All template images are converted to grid placeholders

Unlike templates which come with lots of stock photography when creating a story based on a template, page layouts replace all (yes, all) images with a placeholder grid image. In order to make the grid consistent, a single placeholder grid image is scaled to look consistent across many image sizes.

To preserve images to persist into the page layout, they need to be converted to shapes. Shapes will be not be replaced with placeholder grids when rendered as page layouts and applied to pages.

There has been consideration to make it so that some images can be passed through in [Issue #6032](https://github.com/google/web-stories-wp/issues/6032).

### Page Layout Previews

Page Layouts preview using the same mechanisms as browsing templates on the dashboard. Animations are included when applying page layouts and are included in previews.

## Applying Page Layouts

Page layouts are designed to be a page replacement. On application, they will replace the entire page's contents. If the page has changes, a confirmation is required before overwriting existing changes.

Applying page layouts copies over grid placeholders and all associated animations from the original template page.

## Technical notes and considerations

### RTL Support

In order for page layouts and templates to render the same as they will when selected and published, they need to bypass some of the default RTL support in the app. All preview pages used for rendering page layouts and templates are wrapped in `<StyleSheetManager stylisPlugins={[]}>`.

### Page Layouts are Template Pages

In order to make templates and page layouts easier to maintain, page layouts are built off of standard templates. Use `"pageLayoutType": null` (see above) to omit template pages from being able as page layouts.

There are currently no mechanisms for creating page layouts that are not a part of templates.
