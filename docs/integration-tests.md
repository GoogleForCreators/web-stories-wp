# Integration Tests

Karma + Jasmine are used for running integration tests in the browser.

More details can be found in the `/karma` folder and the corresponding `README`s.

## Running Karma Tests

To run the full test suite, you can use the following commands:

```bash
npm run test:karma:story-editor -- --headless --viewport=1600:1000
npm run test:karma:dashboard -- --headless --viewport=1600:1000
```

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

## Custom Matchers

There are a few custom matchers inspired by Jest and `jest-dom`:

* `toBeEmpty`
* `toHaveFocus`
* `toHaveStyle`
* `toHaveTextContent`
* `toHaveProperty`
* `toBeOneOf`

Plus another custom async matcher inspired by [`jest-axe`](https://github.com/nickcolley/jest-axe) to test for accessibility violations:

* `toHaveNoViolations`

## Writing Tests

### Useful Resources

* [DOM Testing Library](https://testing-library.com/docs/dom-testing-library/intro)
* [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
* ["Which query should I use?"](https://testing-library.com/docs/guide-which-query)
* [Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
* [React Hooks Testing Library](https://react-hooks-testing-library.com/)

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

### Test failure: ResizeObserver loop limit exceeded

See [ResizeObserver#observe() firing the callback immediately results in an infinite loop](https://github.com/WICG/resize-observer/issues/38#issuecomment-422126006).

If you are creating a new `observe()` event using the `resize-observer-polyfill` package, wrapping the body of the function which is provided to the `ResizeObserver` constructor with `window.requestAnimationFrame` will prevent the `ResizeObserver loop limit exceeded` error.

e.g.

```javascript
      const observer = new ResizeObserver(() => {
        // requestAnimationFrame prevents the 'ResizeObserver loop limit exceeded' error
        // https://stackoverflow.com/a/58701523/13078978
        window.requestAnimationFrame(() => {
          // handle resize observation
        });
      });

      observer.observe(node);
```

There is also a `design-system` util called `useResizeEffect` which takes a node ref and a handler function which should be sufficient for resize observation requirements.
