# End-to-End Tests

This project leverages the [local Docker-based environment](./local-environment.md) to facilitate end-to-end (e2e) testing using [Puppeteer](https://github.com/puppeteer/puppeteer).

As with the [JavaScript unit tests](./unit-tests.md), Jest is used as the task runner.

Tests are written using [`jest-puppeteer`](https://github.com/smooth-code/jest-puppeteer).

Tests are written using the [Jest API](https://jestjs.io/docs/en/api) in combination with the [Puppeteer API](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md), facilitated by [`jest-puppeteer`](https://github.com/smooth-code/jest-puppeteer).

To run the full test suite, you can use the following command:

```bash
npm run test:e2e
```

You can also watch for any file changes and only run tests that failed or have been modified:

```bash
npm run test:e2e:watch
```

Not using the built-in local environment? Set the `WP_BASE_URL` environment variable to point to your URL of choice.

```bash
WP_BASE_URL=https://web-stories.local npm run test:e2e
```

**Note**:
All tests run serially in the current process using the `--runInBand` Jest CLI option to avoid conflicts between tests. This is caused by the fact that they share the same WordPress instance.

## Environment Variables

Check out the [separate document](./environment-variables.md) about supported environment variables for tweaking the E2E tests.

## Debugging

For debugging purposes, you can also run the E2E tests in non-headless mode:

```bash
npm run test:e2e:interactive
```

Note that this will also slow down all interactions during tests by 80ms. You can control these values individually too:

```bash
PUPPETEER_HEADLESS=false npm run test:e2e # Interactive mode, normal speed.
PUPPETEER_SLOWMO=200 npm run test:e2e # Headless mode, slowed down by 200ms.
```

It's also possible to enable node's inspector agent for the tests as follows:

```bash
npm run test:e2e:debug
```

Since these tests run both in the node context and the browser context, not all lines of code can have breakpoints set within the inspector client. Only the node context is debugged in the inspector client.

The code executed in the node context includes all of the test files excluding code within `page.evaluate` functions. This is because the `page.evaluate` functions are executed within the browser context.

To also debug the browser context, set `PUPPETEER_DEVTOOLS=true` and `PUPPETEER_HEADLESS=false` when running the `test:e2e:debug` script.
This will launch the browser with the devtools already open. Breakpoints can then be set in the browser context within devtools. 

## Common Mistakes

* Missing `await` on statements/assertions.
* Not waiting for an element to be present in DOM and to be visible before trying to interacting with it (race conditions).

## Writing Tests

### Useful Resources

* [`jest-puppeteer`](https://github.com/smooth-code/jest-puppeteer#api)
* [`expect-puppeteer`](https://github.com/smooth-code/jest-puppeteer/blob/master/packages/expect-puppeteer/README.md#api)
* [Available WordPress-specific test utils](https://www.npmjs.com/package/@wordpress/e2e-test-utils) (e.g. `loginUser`, `visitAdminPage`)

## Test Utilities

Sometimes one might want to test additional scenarios that aren't possible in a WordPress installation out of the box. The tests setup allows adding some utility plugins that can be activated during E2E tests.

These plugins can be added to `packages/e2e-tests/src/plugins` and then activated via the WordPress admin.

Test utilities like `createNewStory()` reside in the `packages/e2e-tests/src/utils` folder.
