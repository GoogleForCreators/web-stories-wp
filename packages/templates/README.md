# Templates

Page layouts allow people to apply individual pages defined in templates to their story without choosing an entire template. Page layouts are based on the same JSON definitions as templates defined in `src/raw`.

## Adding Your Template

Once you've added your template's raw story json to `src/raw/<template_name>.json`, you can import it into `src/getTemplates` and add to the function `loadTemplates(imageBaseUrl)`. It should then be accessible in `src/index`.


