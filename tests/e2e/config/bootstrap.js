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
// eslint-disable-next-line import/no-extraneous-dependencies
import { setDefaultOptions } from 'expect-puppeteer';

/**
 * WordPress dependencies
 */
import {
  enablePageDialogAccept,
  setBrowserViewport,
} from '@wordpress/e2e-test-utils';

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
 * Array of page event tuples of [ eventName, handler ].
 *
 * @type {Array}
 */
const pageEvents = [];

// The Jest timeout is increased because these tests are a bit slow
jest.setTimeout(PUPPETEER_TIMEOUT || 100000);

// Set default timeout for individual expect-puppeteer assertions. (Default: 500)
setDefaultOptions({ timeout: EXPECT_PUPPETEER_TIMEOUT || 500 });

async function setupBrowser() {
  // 15inch screen.
  await setBrowserViewport({
    width: 1680,
    height: 948,
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

    // As of WordPress 5.3.2 in Chrome 79, navigating to the block editor
    // (Posts > Add New) will display a console warning about
    // non - unique IDs.
    // See: https://core.trac.wordpress.org/ticket/23165
    if (text.includes('elements with non-unique id #_wpnonce')) {
      return;
    }

    // styled-components warns about dynamically created components.
    // @todo Fix issues.
    if (text.includes(' has been created dynamically.')) {
      return;
    }

    // Firefox warns about this issue in WordPress admin.
    if (text.includes('This page uses the non standard property “zoom”')) {
      return;
    }

    // Firefox warns about this issue when there's no proper favicon.
    if (
      text.includes(
        'Component returned failure code: 0x80040111 (NS_ERROR_NOT_AVAILABLE) [nsIContentSniffer.getMIMETypeFromContent]'
      )
    ) {
      return;
    }

    // Firefox warns about this issue on the login screen.
    if (text.includes('wp-includes/js/zxcvbn.min.js')) {
      return;
    }

    // Another Firefox warning.
    if (text.includes('Layout was forced before the page was fully loaded')) {
      return;
    }

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

    // Disable reason: We intentionally bubble up the console message
    // which, unless the test explicitly anticipates the logging via
    // @wordpress/jest-console matchers, will cause the intended test
    // failure.

    // eslint-disable-next-line no-console
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
      'aria-allowed-role',
      'aria-input-field-name',
      'aria-required-parent',
      'button-name',
      'color-contrast',
      'label',
      'landmark-banner-is-top-level',
      'landmark-no-duplicate-banner',
      'landmark-unique',
      'page-has-heading-one',
      'region',
      'scrollable-region-focusable',
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
});

// eslint-disable-next-line jest/require-top-level-describe
afterEach(async () => {
  await runAxeTestsForStoriesEditor();
  await setupBrowser();
});

// eslint-disable-next-line jest/require-top-level-describe
afterAll(() => {
  removePageEvents();
});
