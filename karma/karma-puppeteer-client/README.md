# karma-puppeteer-client

The karma-puppeteer-launcher exposes a few Puppeteer APIs, mainly related to native
events and nantive browser support. The APIs are exposed via `karmaPuppeteer` global.

Notice, that all exposed Puppeeter APIs that accept an element selector, also
accept the element reference in its place. Thus, both of these forms are valid:

```JavaScript
karmaPuppeteer.click('.element1') // Valid. Finds the element by the selector.
karmaPuppeteer.click(element1) // Also valid. Passes the element by reference.
```

## Supported APIs

### karmaPuppeteer.click

See [puppeteer.click](https://github.com/puppeteer/puppeteer/blob/v3.0.4/docs/api.md#pageclickselector-options).

### karmaPuppeteer.focus

See [puppeteer.focus](https://github.com/puppeteer/puppeteer/blob/v3.0.4/docs/api.md#pagefocusselector).
