/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { setDefaultOptions } from 'expect-puppeteer';
import { matchers } from 'jest-json-schema';
import { toBeValidAMP } from '@web-stories-wp/jest-puppeteer-amp';
import {
  enablePageDialogAccept,
  setBrowserViewport,
  setCurrentUser,
  trashAllPosts,
  deleteAllMedia,
  trashAllTerms,
  clearLocalStorage,
} from '@web-stories-wp/e2e-test-utils';

expect.extend({
  toBeValidAMP,
});

expect.extend(matchers);

/**
 * Environment variables
 */
const { PUPPETEER_TIMEOUT, EXPECT_PUPPETEER_TIMEOUT } = process.env;

/**
 * Set of console logging types observed to protect against unexpected yet
 * handled (i.e. not catastrophic) errors or warnings. Each key corresponds
 * to the Puppeteer ConsoleMessage type, its value the corresponding function
 * on the console global object.
 *
 * @type {Object<string,string>}
 */
const OBSERVED_CONSOLE_MESSAGE_TYPES = {
  warning: 'warn',
  error: 'error',
};

/**
 * A list of "allowed" error message - or actually error message substrings.
 *
 * The list comes prepopulated with known messages,
 * but can be appended to by tests where relevant.
 *
 * @type {Array<string>}
 */
const ALLOWED_ERROR_MESSAGES = [
  // As of WordPress 5.3.2 in Chrome 79, navigating to the block editor
  // (Posts > Add New) will display a console warning about
  // non - unique IDs.
  // See: https://core.trac.wordpress.org/ticket/23165
  'elements with non-unique id #_wpnonce',

  // Ignore warning about isSecondary prop on button component as used by AMP plugin.
  // The prop is only supported in newer versions of Gutenberg, and as such will trigger
  // warnings on older WordPress versions (but not on newer ones).
  'isSecondary',

  // styled-components warns about dynamically created components.
  // @todo Fix issues.
  ' has been created dynamically.',

  // WordPress still bundles jQuery Migrate, which logs to the console.
  'JQMIGRATE',

  // Firefox warns about this issue in WordPress admin.
  'This page uses the non standard property “zoom”',

  // Firefox warns about this issue when there's no proper favicon.
  'Component returned failure code: 0x80040111 (NS_ERROR_NOT_AVAILABLE) [nsIContentSniffer.getMIMETypeFromContent]',

  // Firefox warns about this issue on the login screen.
  'wp-includes/js/zxcvbn.min.js',

  // Another Firefox warning.
  'Layout was forced before the page was fully loaded',

  // Upsteam issue in gutenberg and twentytwenty theme.
  'Stylesheet twentytwenty-block-editor-styles-css was not properly added.',

  // TODO(#9240): Fix usage in the web stories block.
  "select( 'core' ).getAuthors() is deprecated since version 5.9.",

  // See https://www.chromestatus.com/feature/508239670987980
  "Blocked attempt to show a 'beforeunload' confirmation panel for a frame that never had a user gesture since its load",

  // See https://github.com/GoogleForCreators/web-stories-wp/pull/11782#issuecomment-1178865825
  'Bundle not found for language en:',
];

export function addAllowedErrorMessage(message) {
  ALLOWED_ERROR_MESSAGES.push(message);
  return () => {
    const index = ALLOWED_ERROR_MESSAGES.findIndex((msg) => msg === message);
    ALLOWED_ERROR_MESSAGES.splice(index, 1);
  };
}

/**
 * Array of page event tuples of [ eventName, handler ].
 *
 * @type {Array}
 */
const pageEvents = [];

// The Jest timeout is increased because these tests are a bit slow
jest.setTimeout(PUPPETEER_TIMEOUT || 100000);

// Retry flaky tests at most 2 times in CI (off by 1).
/*
if ('true' === process.env.CI) {
  jest.retryTimes(3);
}
*/

// Set default timeout for individual expect-puppeteer assertions. (Default: 500)
setDefaultOptions({ timeout: EXPECT_PUPPETEER_TIMEOUT || 2000 });

/**
 * Set up browser.
 */
async function setupBrowser() {
  // Same as jest-puppeteer.config.cjs and percy.config.yml
  await setBrowserViewport({
    width: 1600,
    height: 1000,
  });
}

/**
 * Adds an event listener to the page to handle additions of page event
 * handlers, to assure that they are removed at test teardown.
 */
function capturePageEventsForTearDown() {
  page.on('newListener', (eventName, listener) => {
    pageEvents.push([eventName, listener]);
  });
}

/**
 * Removes all bound page event handlers.
 */
function removePageEvents() {
  pageEvents.forEach(([eventName, handler]) => {
    page.removeListener(eventName, handler);
  });
}

/**
 * Adds a page event handler to emit uncaught exception to process if one of
 * the observed console logging types is encountered.
 */
function observeConsoleLogging() {
  page.on('console', (message) => {
    const type = message.type();
    if (!Object.hasOwnProperty.call(OBSERVED_CONSOLE_MESSAGE_TYPES, type)) {
      return;
    }

    let text = message.text();

    // Short-circuit abort if any known "allowed" message fails
    if (ALLOWED_ERROR_MESSAGES.some((msg) => text.includes(msg))) {
      return;
    }

    // Special case: ignore 403 errors on logout page.
    // See https://github.com/googleforcreators/web-stories-wp/pull/7889
    if (
      text.includes(
        'Failed to load resource: the server responded with a status of 403 (Forbidden)'
      ) &&
      message.stackTrace()?.[0]?.url?.endsWith('wp-login.php?action=logout')
    ) {
      return;
    }

    //eslint-disable-next-line security/detect-object-injection -- Negligible.
    const logFunction = OBSERVED_CONSOLE_MESSAGE_TYPES[type];

    // As of Puppeteer 1.6.1, `message.text()` wrongly returns an object of
    // type JSHandle for error logging, instead of the expected string.
    //
    // See: https://github.com/GoogleChrome/puppeteer/issues/3397
    //
    // The recommendation there to asynchronously resolve the error value
    // upon a console event may be prone to a race condition with the test
    // completion, leaving a possibility of an error not being surfaced
    // correctly. Instead, the logic here synchronously inspects the
    // internal object shape of the JSHandle to find the error text. If it
    // cannot be found, the default text value is used instead.
    text = message.args()?.[0]?._remoteObject?.description || text;

    /* eslint-disable-next-line no-console, security/detect-object-injection --
     * We intentionally bubble up the console message
     * which, unless the test explicitly anticipates the logging via
     * @wordpress/jest-console matchers, will cause the intended test
     * failure.
     **/
    console[logFunction](text);
  });
}

let requestResults = []; // collects request results

function monitorRequests() {
  page.on('requestfinished', async (request) => {
    const response = await request.response();
    if (response.status() !== 200) {
      requestResults.push(response.status() + ' ' + request.url());
    }
  });

  page.on('requestfailed', (requestfailed) => {
    const req = JSON.stringify(requestfailed.failure());
    // eslint-disable-next-line no-console
    console.log('requestfailed occurred: ', req);
    // eslint-disable-next-line no-console
    console.log('monitor requests:' + JSON.stringify(requestResults));
  });
}

/**
 * Before every test suite run, delete all content created by the test. This ensures
 * other posts/comments/etc. aren't dirtying tests and tests don't depend on
 * each other's side-effects.
 */
// eslint-disable-next-line jest/require-top-level-describe
beforeAll(async () => {
  capturePageEventsForTearDown();
  enablePageDialogAccept();
  observeConsoleLogging();
  monitorRequests();
  await setupBrowser();
  await page.setDefaultNavigationTimeout(10000);
  await page.setDefaultTimeout(3000);

  await setCurrentUser('admin', 'password');
  await trashAllPosts();
  await trashAllPosts('web-story');
  await trashAllTerms('web_story_category');
  await trashAllTerms('web_story_tag');
  await deleteAllMedia();

  await clearLocalStorage();
});

// eslint-disable-next-line jest/require-top-level-describe
afterEach(async () => {
  await setupBrowser();
  await clearLocalStorage();
  requestResults = [];
});

// eslint-disable-next-line jest/require-top-level-describe
afterAll(() => {
  removePageEvents();
});
