# Page Templates

Page templates allow people to apply individual pages defined in templates to their story without choosing an entire template. Page templates are based on the same JSON definitions as templates defined in `packages/templates/src/raw`.

## How Page Templates differ from Template Pages

Since page templates are based on the same source files as templates, some customization of raw templates is required for them to work correctly with Page Templates.

### Page Template Types and Naming

In the page templates pane, pages are labeled and able to be filtered by their page type (Examples: Cover, Section, Quote, ...). These types are defined in the source template's raw JSON.

To set page template type for a template page, set `pageTemplateType` on the template JSON's page objects to one of the types defined at `src/edit-story/components/library/panes/pageTemplates/constants.js`. If `pageTemplateType` is set to `null`, the page will be omitted from the page templates pane.

Page Templates are named based on their original Template Name + Page Template Type like "Cooking Cover".

### All template images are converted to grid placeholders

Unlike templates which come with lots of stock photography when creating a story based on a template, page templates replace all (yes, all) images with a placeholder grid image. In order to make the grid consistent, a single placeholder grid image is scaled to look consistent across many image sizes.

To preserve images to persist into the page template, they need to be converted to shapes. Shapes will be not be replaced with placeholder grids when rendered as page templates and applied to pages.

There has been consideration to make it so that some images can be passed through in [Issue #6032](https://github.com/google/web-stories-wp/issues/6032).

### Page Template Previews

Page Templates preview using the same mechanisms as browsing templates on the dashboard. Animations are included when applying page templates and are included in previews.

## Applying Page Templates

Page templates are designed to be a page replacement. On application, they will replace the entire page's contents. If the page has changes, a confirmation is required before overwriting existing changes.

Applying page templates copies over grid placeholders and all associated animations from the original template page.

## Technical notes and considerations

### RTL Support

In order for page templates and templates to render the same as they will when selected and published, they need to bypass some of the default RTL support in the app. All preview pages used for rendering page templates and templates are wrapped in `<StyleSheetManager stylisPlugins={[]}>`.

### Page Templates are Template Pages

In order to make templates and page templates easier to maintain, page templates are built off of standard templates. Use `"pageTemplateType": null` (see above) to omit template pages from being able as page templates.

There are currently no mechanisms for creating page templates that are not a part of templates.
