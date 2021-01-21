# karma-puppeteer-launcher

A Karma browser launcher implemented via [Puppeteer](https://github.com/puppeteer/puppeteer).

## Launch options

See [puppeteer.launch](https://github.com/puppeteer/puppeteer/blob/v3.0.4/docs/api.md#puppeteerlaunchoptions) for more info.

The available options are currently exposed via Karma command line args:

- `slowMo`: Slows down Puppeteer operations by the specified amount of milliseconds. Default is `0`.
- `headless`: Runs in headless mode. Default is `false`.

For instance, you can run Karma with the following options:

```sh
npm run test:karma --headless --slowMo=100
```

## Exposed functions

The karma-puppeteer-launcher exposes a few Puppeteer APIs. They are documented
in the [karma-puppeteer-client](packages/karma-puppeteer-client/README.md) docs.
