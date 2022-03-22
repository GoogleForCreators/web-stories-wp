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
const puppeteer = require('puppeteer');

/**
 * Internal dependencies
 */
const MouseWithDnd = require('./mouseWithDnd.cjs');
const takePercySnapshot = require('./snapshot.cjs');

function puppeteerBrowser(baseBrowserDecorator, config) {
  baseBrowserDecorator(this);
  this.name = 'karma-puppeteer-launcher';

  let browser = null;

  this._start = async (url) => {
    const defaultPuppeteerOptions = {
      product: 'chrome',
      slowMo: 0,
      dumpio: true,
      headless: false,
      devtools: false,
      defaultViewport: null,
      snapshots: false,
      // See https://peter.sh/experiments/chromium-command-line-switches/
      args: [
        // Disables GPU hardware acceleration.
        '--disable-gpu',
        // Disables the sandbox for all process types that are normally sandboxed.
        '--no-sandbox',
        // The /dev/shm partition is too small in certain VM environments, causing Chrome to fail or crash.
        // See http://crbug.com/715363
        // We use this flag to work-around this issue.
        '--disable-dev-shm-usage',
      ],
    };
    const puppeteerOptions = {
      ...defaultPuppeteerOptions,
      ...(config && config.puppeteer),
    };

    // See https://github.com/puppeteer/puppeteer/blob/v3.0.4/docs/api.md#puppeteerlaunchoptions.
    browser = await puppeteer.launch(puppeteerOptions);

    const page = await (async () => {
      const pages = await browser.pages();
      const lastPage = pages.length > 0 ? pages[pages.length - 1] : null;
      if (lastPage && lastPage.url() === 'about:blank') {
        return lastPage;
      }
      return browser.newPage();
    })();

    // Test APIs.
    await exposeFunctions(page, puppeteerOptions);
    browser.on('targetcreated', async (target) => {
      if (target.type() !== 'page') {
        // Not a page. E.g. a worker.
        return;
      }
      const newPage = await target.page();
      if (newPage === page) {
        // An already handled page.
        return;
      }
      await exposeFunctions(newPage, puppeteerOptions);
    });

    await page.goto(url);
  };

  this.on('kill', async (done) => {
    if (browser != null) {
      await browser.close();
    }
    done();
  });
}

async function exposeFunctions(page, config) {
  // Save snapshot.
  await exposeFunction(
    page,
    'saveSnapshot',
    async (frame, testName, snapshotName, options) => {
      if (!process.env?.PERCY_TOKEN) {
        // Do nothing unless snapshots are enabled.
        return;
      }

      await takePercySnapshot(frame, testName, snapshotName, options);
    }
  );

  // click.
  // See https://github.com/puppeteer/puppeteer/blob/v3.0.4/docs/api.md#frameclickselector-options
  await exposeFunction(page, 'click', (frame, selector, options) => {
    return frame.click(selector, options);
  });

  // focus.
  // See https://github.com/puppeteer/puppeteer/blob/v3.0.4/docs/api.md#pagefocusselector
  await exposeFunction(page, 'focus', (frame, selector, options) => {
    return frame.focus(selector, options);
  });

  // hover.
  // See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#framehoverselector
  await exposeFunction(page, 'hover', (frame, selector, options) => {
    return frame.hover(selector, options);
  });

  // select.
  // See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#frameselectselector-values
  await exposeFunction(page, 'select', (frame, selector, values) => {
    return frame.select(selector, ...values);
  });

  // keyboard.
  // See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-keyboard
  await exposeKeyboardFunctions(page);

  // mouse.
  // See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-mouse
  await exposeMouseFunctions(page);

  // clipboard.
  await exposeClipboard(page);
}

function exposeFunction(page, name, func) {
  return page.exposeFunction(`__karma_puppeteer_${name}`, (...args) => {
    return func(getContextFrame(page), ...args);
  });
}

async function exposeKeyboardFunctions(page) {
  // See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-keyboard
  const { keyboard } = page;

  function exposeKeyboardFunction(name, func) {
    return exposeFunction(page, `keyboard_${name}`, func);
  }

  // Keyboard sequence.
  // See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-keyboard
  await exposeKeyboardFunction('seq', (frame, seq) => {
    return seq.reduce((promise, item) => {
      const { type, key, options } = item;
      return promise.then(() => keyboard[type](key, options));
    }, Promise.resolve());
  });

  // Keyboard sendCharacter.
  // See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#keyboardsendcharacterchar
  await exposeKeyboardFunction('sendCharacter', (frame, char) => {
    return keyboard.sendCharacter(char);
  });

  // Keyboard type.
  // See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#keyboardtypetext-options
  await exposeKeyboardFunction('type', (frame, text, options) => {
    return keyboard.type(text, options);
  });
}

async function exposeMouseFunctions(page) {
  // See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-mouse
  const mouseForFrame = new Map();

  function getMouse(frame) {
    if (!mouseForFrame.has(frame)) {
      mouseForFrame.set(frame, new MouseWithDnd(page, frame));
    }
    return mouseForFrame.get(frame);
  }

  function exposeMouseFunction(name, func) {
    return exposeFunction(page, `mouse_${name}`, func);
  }

  // Mouse sequence of "down", "up", "move", and "click".
  await exposeMouseFunction('seq', (frame, seq) => {
    const mouse = getMouse(frame);
    return seq.reduce((promise, item) => {
      const { type, x, y, options } = item;
      const acceptsXY = type === 'move' || type === 'click';
      if (acceptsXY) {
        return promise.then(() => mouse[type](x, y, options));
      }
      return promise.then(() => mouse[type](options));
    }, Promise.resolve());
  });
}

async function exposeClipboard(page) {
  await page
    .browserContext()
    .overridePermissions('http://localhost:9876', [
      'clipboard-read',
      'clipboard-write',
    ]);

  function exposeClipboardFunction(name, func) {
    return exposeFunction(page, `clipboard_${name}`, func);
  }

  // @todo: Drop the local clipboardData once `navigator.clipboard.read()`
  // supports text/html. It will be a lot better since it will also support
  // native clipboard. OTOH, there's something good in not running tests on
  // a real clipboard. E.g. a test cannot accidentally copy/print a secret
  // value.
  // See the https://crbug.com/931839 for "text/html" support.
  let clipboardData;

  // @todo: Implement `cut` and `set()`.

  // Copy.
  await exposeClipboardFunction('copy', async (frame) => {
    clipboardData = await frame.evaluateHandle(() => {
      // @todo: do `document.execCommand('copy')` inside an input or
      // a contenteditable.
      const target = document.activeElement;
      const data = new DataTransfer();
      const event = new ClipboardEvent('copy', {
        bubbles: true,
        cancelable: true,
        clipboardData: data,
      });
      target.dispatchEvent(event);
      return data;
    });
  });

  // Paste.
  await exposeClipboardFunction('paste', async (frame) => {
    if (!clipboardData) {
      throw new Error('clipboard is empty');
    }
    await frame.evaluate((data) => {
      // @todo: do `document.execCommand('paste')` inside an input or
      // a contenteditable.
      const target = document.activeElement;
      const event = new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData: data,
      });
      target.dispatchEvent(event);
    }, clipboardData);
  });
}

function getContextFrame(page) {
  return (
    page.frames().find((frame) => frame.name() === 'context') ||
    page.mainFrame()
  );
}

puppeteerBrowser.$inject = ['baseBrowserDecorator', 'config.puppeteerLauncher'];

module.exports = {
  'launcher:karma-puppeteer-launcher': ['type', puppeteerBrowser], // Could not use @web-stories-wp/ because it does not accept symbols in name.
};
