# Environment Variables

Throughout the project some environment variables are in use:

## Application

**DISABLE_PREVENT** (bool):
Set this environment variable to disable unwanted `beforeunload` dialogs when reloading or closing the browser. Mostly useful during development. Default: `false`

## Bundler

**NODE_ENV** (`production`|`development`|`test`):
Defines the mode webpack and other tools operate in. Automatically set by tests / build tools, usually no need to override manually.

**BUNDLE_ANALYZER** (bool):
Enables the `webpack-bundle-analyzer` plugin to analyze the final bundle composition. Default: `false`

**BABEL_CACHE_DIRECTORY** (string):
Babel uses a directory within local node_modules by default. Use the environment variable option to enable more persistent caching.

## E2E Tests

**PUPPETEER_TIMEOUT** (number):
Set the default Jest timeout for Puppeteer test. It is already increased because these tests are a bit slow due to the browser overhead. Default: `100000` (ms)

**EXPECT_PUPPETEER_TIMEOUT** (number):
Set default timeout for individual expect-puppeteer assertions. Default: `500` (ms)

**WP_BASE_URL** (string):
Point the E2E tests to a different URL, i.e. when not using the built-in Docker environment. Default: `http://localhost:8899`.

**WP_USERNAME** (string):
Username to use for logging in during E2E tests. Default: `admin`

**WP_PASSWORD** (string):
Password to use for logging in during E2E tests. Default: `password`

**PUPPETEER_PRODUCT** (string):
Either `chrome` or `firefox`. Default: `chrome`

**PUPPETEER_HEADLESS** (bool):
Whether to run Puppeteer in headless mode or not. Default: `true`

**PUPPETEER_SLOWMO** (number):
Slow down all interactions by a certain time for easier debugging. Useful in combination with `PUPPETEER_HEADLESS`. Default: `0` (ms)

**PUPPETEER_DEVTOOLS** (bool):
Whether to open dev tools during tests. Default: `false`

## Local Environment

**PHP_VERSION** (string):
PHP version which local environment runs in. Default: `7.4` 
