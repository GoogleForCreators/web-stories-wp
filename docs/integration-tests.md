# Karma integration testing

## Running Karma tests

To run Karma once:

```sh
npm run test:karma
```

To run Karma in the watch mode:

```sh
npm run test:karma:watch
```

To run Karma in the headless mode:

```sh
npm run test:karma -- --headless
```

or

```sh
npm run test:karma:watch -- --headless
```

## Debugging Karma tests

To debug a Karma test, you can follow the following steps:

1. Focus the test you want to debug by change it's `it` to `fit`.
2. Add `await karmaPause()` command in a desired place in the test. The test
will execute all test steps prior to `karmaPause()` and will block.
3. Run `npm run test:karma:watch`.
4. Once the Karma window is opened, click on the "DEBUG" button in the header.
This will open the debug page at [http://localhost:9876/debug.html](http://localhost:9876/debug.html).
5. Open DevTools. A tip: you can also run Karma with the `--devtools` option
to open DevTools automatically.
6. A test can be unblocked by executing `karmaResume()` in the DevTools console.
A test can be blocked/resumed any number of times using `karmaPause()` and
`karmaResume()` during the debugging session.


## Browser support

Currently, only Puppeeter option is configured. It can run Chrome and Firefox browsers.
In the near future this may also be expanded to Playwright to support Safari and other
browsers.

For details on how to customize browser options, see [karma-puppeteer-launcher](./karma-puppeteer-launcher/README.md).

For details on exposed native browser APIs, see [karma-puppeteer-client](./karma-puppeteer-client/README.md).

## Common issues

### Annoying firewall question: "Do you want to the application Chromium.app to accept incoming network connections?"

See [Puppeteer issue 4752](https://github.com/puppeteer/puppeteer/issues/4752).

```sh
sudo codesign --force --deep --sign - ./node_modules/puppeteer/.local-chromium/mac-*/chrome-mac/Chromium.app
```
