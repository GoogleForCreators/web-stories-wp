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
import { toBeValidAMP } from '@web-stories-wp/jest-puppeteer-amp';
import {
  enablePageDialogAccept,
  setBrowserViewport,
  setCurrentUser,
  toggleVideoOptimization,
  trashAllPosts,
  deleteAllMedia,
  deleteWidgets,
  trashAllTerms,
  clearLocalStorage,
} from '@web-stories-wp/e2e-test-utils';

expect.extend({
  toBeValidAMP,
});

/**
 * Environment variables
 */
const {
  PUPPETEER_TIMEOUT,
  EXPECT_PUPPETEER_TIMEOUT,
  PUPPETEER_PRODUCT = 'chrome',
} = process.env;

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
 * A list of "allowed" error messages in Firefox.
 *
 * @type {Array<string>}
 */
const ALLOWED_ERROR_MESSAGES_FIREFOX = [
  // Firefox warns about this issue in WordPress admin.
  'This page uses the non standard property “zoom”',

  // Firefox warns about this issue when there's no proper favicon.
  'Component returned failure code: 0x80040111 (NS_ERROR_NOT_AVAILABLE) [nsIContentSniffer.getMIMETypeFromContent]',

  // Firefox warns about this issue on the login screen.
  'wp-includes/js/zxcvbn.min.js',

  // Another Firefox warning.
  'Layout was forced before the page was fully loaded',

  // Firefox cookie warning.
  'will be soon rejected because it has the “SameSite” attribute set to “None”',

  // Firefox cookie warning.
  'has been rejected because it is already expired',

  // Firefox warns about this usage in TinyMCE.
  'MouseEvent.mozPressure is deprecated',

  // Firefox + Feature Policy for embeds.
  'Skipping unsupported feature name',

  // Firefox + CSP for embeds.
  'Ignoring duplicate source',

  // Another CSP warning in Firefox for embeds.
  'Content Security Policy: Couldn’t parse invalid host',

  // Another CSP warning in Firefox for embeds.
  'An iframe which has both allow-top-navigation and allow-top-navigation-by-user-activation',

  // Firefox warns about this in WP admin.
  'For more information see “The Principal Writing Mode”',

  // Firefox warns about this, caused by react-modal.
  'unreachable code after return statement',

  // Some bug in Firefox?
  '0xc1f30001 (NS_ERROR_NOT_INITIALIZED)',

  // Firefox Nightly does not appear to support MP4.
  // The "Web Stories Block" test embeds a story containing an MP4,
  // and the Tenor test loads MP4s as well.
  'Your system may not have the required video codecs for: video/mp4',
  'Specified “type” attribute of “video/mp4” is not supported',

  // Firefox warning for AMP scripts that can be neglected in tests.
  'Loading failed for the module with source “https://cdn.ampproject.org',
  'Loading failed for the <script> with source “https://cdn.ampproject.org',

  // Flaky image loading in Firefox.
  'Image corrupt or truncated.',

  // Some bug in Firefox?
  'TypeError: can\'t access property "docShell", target.defaultView is undefined',

  // Firefox emits some warnings about Google Fonts like "Fahkwang".
  'downloadable font: maxp: Bad maxZones',

  // Sometimes Firefox even fails to download fonts and likes to warn about it.
  'downloadable font: download failed',

  // Media failing to play in Firefox.
  'All candidate resources failed to load. Media load paused.',

  // Firefox warning about scroll-linked effects, see https://firefox-source-docs.mozilla.org/performance/scroll-linked_effects.html.
  'This site appears to use a scroll-linked positioning effect. This may not work well with asynchronous panning',

  // Some bug in Firefox?
  'Sending message that cannot be cloned. Are you trying to send an XPCOM object?',

  // Not caused by the editor.
  'This page is in Quirks Mode.',

  // Some bug in Firefox?
  'JSWindowActorChild.sendAsyncMessage: JSWindowActorChild cannot send at the moment',
];

/**
 * A list of "allowed" error messages in Chrome.
 *
 * @type {Array<string>}
 */
const ALLOWED_ERROR_MESSAGES_CHROME = [
  // As of WordPress 5.3.2 in Chrome 79, navigating to the block editor
  // (Posts > Add New) will display a console warning about
  // non - unique IDs.
  // See: https://core.trac.wordpress.org/ticket/23165
  'elements with non-unique id #_wpnonce',
];

/**
 * A list of "allowed" error messages.
 *
 * The list comes pre-populated with known messages,
 * but can be appended to by tests where relevant.
 *
 * @type {Array<string>}
 */
const ALLOWED_ERROR_MESSAGES = [
  // Ignore warning about isSecondary prop on button component as used by AMP plugin.
  // The prop is only supported in newer versions of Gutenberg, and as such will trigger
  // warnings on older WordPress versions (but not on newer ones).
  'isSecondary',

  // styled-components warns about dynamically created components.
  // @todo Fix issues.
  ' has been created dynamically.',

  // WordPress still bundles jQuery Migrate, which logs to the console.
  'JQMIGRATE',

  // Upsteam issue in gutenberg and twentytwenty theme.
  'Stylesheet twentytwenty-block-editor-styles-css was not properly added.',

  // TODO(#9240): Fix usage in the web stories block.
  "select( 'core' ).getAuthors() is deprecated since version 5.9.",

  ...('chrome' === PUPPETEER_PRODUCT
    ? ALLOWED_ERROR_MESSAGES_CHROME
    : ALLOWED_ERROR_MESSAGES_FIREFOX),
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
if ('true' === process.env.CI) {
  jest.retryTimes(3);
}

// Set default timeout for individual expect-puppeteer assertions. (Default: 500)
setDefaultOptions({ timeout: EXPECT_PUPPETEER_TIMEOUT || 1000 });

// Different args needed for Firefox, see https://github.com/puppeteer/puppeteer/issues/6442.
const VIEWPORT_CHROME = {
  width: 1600,
  height: 1000,
};
const VIEWPORT_FIREFOX = {
  width: 1600,
  height: 900, // Smaller than the window size in jest-puppeteer.config.cjs.
};

/**
 * Set up browser.
 */
async function setupBrowser() {
  // Same as jest-puppeteer.config.cjs and percy.config.yml
  await setBrowserViewport(
    process.env.PUPPETEER_PRODUCT === 'firefox'
      ? VIEWPORT_FIREFOX
      : VIEWPORT_CHROME
  );
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

/**
 * Runs Axe tests when the story editor is found on the current page.
 *
 * @return {?Promise} Promise resolving once Axe texts are finished.
 */
async function runAxeTestsForStoriesEditor() {
  if (!(await page.$('body.edit-story'))) {
    return;
  }

  await expect(page).toPassAxeTests({
    // Temporary disabled rules to enable initial integration.
    disabledRules: [
      'aria-input-field-name',
      'aria-required-parent',
      'color-contrast',
      // Because of multiple #_wpnonce elements.
      'duplicate-id',
      'region',
      'aria-allowed-attr',
      'nested-interactive',
    ],
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
  await setupBrowser();
  await page.setDefaultNavigationTimeout(10000);
  await page.setDefaultTimeout(3000);

  await setCurrentUser('admin', 'password');
  await trashAllPosts();
  await trashAllPosts('page');
  await trashAllPosts('web-story');
  await trashAllTerms('web_story_category');
  await trashAllTerms('web_story_tag');
  await deleteAllMedia();
  await deleteWidgets();

  await clearLocalStorage();

  // Disable cross-origin isolation by default as it causes issues in Firefox.
  await toggleVideoOptimization(false);
});

// eslint-disable-next-line jest/require-top-level-describe
afterEach(async () => {
  await runAxeTestsForStoriesEditor();
  await setupBrowser();
  await clearLocalStorage();
});

// eslint-disable-next-line jest/require-top-level-describe
afterAll(() => {
  removePageEvents();
});
