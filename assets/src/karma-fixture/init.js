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

// Debug timeout is 1hr.
const DEBUG_TIMEOUT = 3600000;

// Make Jasmine just a tiny bit more like Jest and Mocha.
self.describe.only = self.fdescribe;
self.it.only = self.fit;
self.describe.skip = self.xdescribe;
self.it.skip = self.xit;

let currentSpec;
let rootEl;
let cleanupsAll;

function withCleanupAll(callback) {
  if (!cleanupsAll) {
    cleanupsAll = [];
  }
  cleanupsAll.push(callback());
}

function setupDebugMode() {
  // The debug.html page always runs on the top window context, vs normal
  // tests run in a context frame.
  const isDebug = window === top;

  if (isDebug) {
    // In the debug mode, the timeout is extended to an hour.
    jasmine.DEFAULT_TIMEOUT_INTERVAL = DEBUG_TIMEOUT;
  }

  let resumeCallback = null;

  self.karmaPause = () => {
    if (!isDebug) {
      //eslint-disable-next-line no-console
      console.error(
        'No pausing in a non-debug mode. ' +
          'Go to http://localhost:9876/debug.html for debugging.'
      );
      return undefined;
    }

    if (resumeCallback) {
      // Already paused.
      //eslint-disable-next-line no-console
      console.error('Karma is already paused. Call karmaResume() to resume.');
      return undefined;
    }

    //eslint-disable-next-line no-console
    console.info('Karma paused. Call karmaResume() to resume.');
    return new Promise(function (resolve) {
      resumeCallback = resolve;
      setTimeout(function () {
        resumeCallback = null;
        resolve();
      }, DEBUG_TIMEOUT);
    });
  };

  self.karmaResume = () => {
    if (!isDebug) {
      return;
    }
    if (!resumeCallback) {
      return;
    }
    resumeCallback();
    resumeCallback = null;
    //eslint-disable-next-line no-console
    console.info('Karma resumed.');
  };
}

beforeAll(() => {
  jasmine.getEnv().addReporter({
    specStarted(result) {
      currentSpec = result;
    },
    specDone() {
      currentSpec = null;
    },
  });

  setupDebugMode();

  self.karmaSnapshot = (name) => {
    return karmaPuppeteer.saveSnapshot(currentSpec?.fullName, name);
  };

  /*eslint-disable no-console*/

  // Suppress react-dom/server error messages during tests.
  withCleanupAll(() => {
    const originalConsoleError = console.error;

    console.error = (...args) => {
      if (
        args[0].includes('Warning: useLayoutEffect does nothing on the server')
      ) {
        return;
      }

      originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  });

  /*eslint-enable no-console*/

  // Disable transitions. These add unnecessarily flakiness into integration
  // tests and snapshots/screenshots.
  withCleanupAll(() => {
    const testRootStyles = document.createElement('style');
    testRootStyles.setAttribute('data-desc', 'Karma test-root styles');
    testRootStyles.textContent = `
      * {
        transition-property: none !important;
        transition-delay: 0s !important;
        transition-duration: 0s !important;
      }
    `;
    document.head.appendChild(testRootStyles);
    return () => {
      testRootStyles.remove();
    };
  });

  // By default Jasmine doesn't report unhandled promise rejections.
  // But with `act()` it's very easy to do. So this is patched for Jasmine
  // here until the relevant issues are addressed.
  // See https://github.com/karma-runner/karma-jasmine/issues/184
  // See https://eng.wealthfront.com/2016/11/03/handling-unhandledrejections-in-node-and-the-browser/
  withCleanupAll(() => {
    const handler = (evt) => {
      throw evt.reason?.stack || evt.reason || evt;
    };
    self.addEventListener('unhandledrejection', handler);
    return () => {
      self.removeEventListener('unhandledrejection', handler);
    };
  });

  // Make sure that testing iframe takes over the whole screen. This way, the
  // native events can be targetted precisely.
  // The documented approach is to supply our own
  // [client_with_context.html](https://github.com/karma-runner/karma/blob/master/static/client_with_context.html)
  // file via [customClientContextFile](http://karma-runner.github.io/5.0/config/configuration-file.html)
  // configuration option. But, IMHO, that'd make it a much more fragile
  // dependency.
  withCleanupAll(() => {
    const frameElement = self.frameElement;
    if (!frameElement) {
      return undefined;
    }
    frameElement.style.position = 'absolute';
    frameElement.style.top = '0';
    frameElement.style.left = '0';
    return () => {
      frameElement.style.position = '';
      frameElement.style.top = '';
      frameElement.style.left = '';
    };
  });

  // Add custom matchers inspired by jest's and jest-dom's ditto
  jasmine.addMatchers({
    toBeEmpty: () => ({
      compare: function (actual) {
        const innerHTML = actual?.innerHTML ?? '';
        const pass = innerHTML === '';
        return {
          pass,
          message: pass
            ? `Expected element to not be empty`
            : `Expected element to be empty`,
        };
      },
    }),
    toHaveFocus: () => ({
      compare: function (actual) {
        const doc = actual?.ownerDocument || actual?.document;
        const pass = doc.activeElement === actual;
        return {
          pass,
          message: pass
            ? `Expected element ${actual} to not have focus`
            : `Expected element ${actual} to have focus, but focus is on ${doc.activeElement}`,
        };
      },
    }),
    toHaveStyle: (util, customEqualityTesters) => ({
      compare: function (element, property, expected) {
        const actual = element
          ? window.getComputedStyle(element)[property]
          : null;
        const pass = util.equals(actual, expected, customEqualityTesters);
        return {
          pass,
          message: pass
            ? `Expected element to not have style "${property}: ${expected}"`
            : `Expected element to have style "${property}: ${expected}" but found "${actual}"`,
        };
      },
    }),
    toHaveProperty: (util, customEqualityTesters) => ({
      compare: function (element, property, expected) {
        const actual = element?.[property] ?? '';
        const pass =
          typeof expected === 'string'
            ? util.equals(actual, expected, customEqualityTesters)
            : expected.test(actual);
        return {
          pass,
          message: pass
            ? `Expected element to not have ${property} = "${expected}"`
            : `Expected element to have ${property} = "${expected}" but found "${actual}"`,
        };
      },
    }),
    toBeOneOf: (util, customEqualityTesters) => ({
      compare: function (actual, expecteds) {
        const passer = (expected) =>
          util.equals(actual, expected, customEqualityTesters);
        const pass = expecteds.some(passer);
        return {
          pass,
          message: pass
            ? `Expected value to not be in list: ${expecteds.join(
                ', '
              )}, received: ${actual}"`
            : `Expected value to be in list: ${expecteds.join(
                ', '
              )}, received: ${actual}"`,
        };
      },
    }),
  });

  jasmine.addAsyncMatchers({
    toHaveNoViolations: () => ({
      compare: async function (element, options) {
        const result = await window.axe.run(element, options);
        const pass = result.violations.length === 0;

        const formattedViolations = result.violations.map((violation) => {
          const { id, impact, description, help, helpUrl } = violation;

          const message = [];

          message.push(`[ ${id}] ${description}`);
          message.push(helpUrl ? `${help} (${helpUrl}` : help);
          message.push(`Impact: ${impact}`);
          message.push('\n');

          for (const { html, failureSummary } of violation.nodes) {
            message.push(`HTML: ${html}`);
            message.push(failureSummary);
            message.push('\n');
          }

          return message.join('\n');
        });

        const message = !pass
          ? `Expected element to pass aXe accessibility tests. Violations found:
            ${formattedViolations.join('\n')}`
          : 'Expected element to contain aXe accessibility test violations. No violations found.';

        return {
          pass,
          message: () => message,
        };
      },
    }),
  });

  // Virtual cursor.
  withCleanupAll(() => {
    const el = document.createElement('div');
    el.id = '__karma__cursor';
    el.className = 'i__karma__snapshot__hide';
    el.style.cssText = `
      width: 0px;
      height: 0px;
      border-left: 10px solid red;
      border-bottom: 10px solid transparent;
      position: fixed;
      top: 0px;
      left: 0px;
      z-index: 2147483647;
      pointer-events: none;
    `;
    document.body.appendChild(el);

    let clientX = -9999;
    let clientY = -9999;
    let scheduled = false;

    const move = (evt) => {
      clientX = evt.clientX;
      clientY = evt.clientY;
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(() => {
          scheduled = false;
          el.style.transform = `translate(${clientX}px, ${clientY}px)`;
        });
      }
    };

    document.addEventListener('mousemove', move, true);
    document.addEventListener('drag', move, true);
    return () => {
      document.removeEventListener('mousemove', move, true);
      document.removeEventListener('drag', move, true);
    };
  });
});

afterAll(() => {
  if (cleanupsAll) {
    const toCleanup = cleanupsAll.slice(0);
    cleanupsAll = undefined;
    toCleanup.forEach((cleanup) => {
      if (cleanup) {
        cleanup();
      }
    });
  }
});

beforeEach(async () => {
  // @todo: ideally we can find a way to use a new <body> for each test, but
  // there are too many browser APIs to patch to make it consistent.

  // @todo: ideally we can find a way to use a new <head> for each test, but
  // styled-components uses some side-effect-y global constants to manage
  // the stylesheet state, e.g. `masterSheet`.
  // See https://github.com/styled-components/styled-components/blob/4add697ac770634300f7775fc880882b5497bdf4/packages/styled-components/src/models/StyleSheetManager.js#L25

  rootEl = document.createElement('test-root');
  rootEl.style.cssText = `
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
  `;
  document.body.appendChild(rootEl);

  // Each test should start with the pointer in the same location ([-1,-1]) to
  // avoid pointerover/mouseover/hover flakes.
  await karmaPuppeteer.mouse.seq([{ type: 'move', x: -1, y: -1 }]);
});

afterEach(() => {
  rootEl.remove();
});
