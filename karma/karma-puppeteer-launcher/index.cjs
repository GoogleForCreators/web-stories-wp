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
const path = require('path');
const fs = require('fs').promises;
const puppeteer = require('puppeteer');

/**
 * Internal dependencies
 */
const MouseWithDnd = require('./mouseWithDnd.cjs');

function puppeteerBrowser(baseBrowserDecorator, config) {
  baseBrowserDecorator(this);
  this.name = 'puppeteer';

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
    };
    const puppeteerOptions = {
      ...defaultPuppeteerOptions,
      ...(config && config.puppeteer),
    };

    // See https://github.com/puppeteer/puppeteer/blob/v3.0.4/docs/api.md#puppeteerlaunchoptions.
    browser = await puppeteer.launch({
      product: puppeteerOptions.product,
      slowMo: puppeteerOptions.slowMo,
      dumpio: puppeteerOptions.dumpio,
      headless: puppeteerOptions.headless,
      devtools: puppeteerOptions.devtools,
      defaultViewport: puppeteerOptions.defaultViewport,
    });

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
    async (frame, testName, snapshotName) => {
      if (!config.snapshots) {
        // Do nothing unless snapshots are enabled.
        return;
      }

      if (!testName) {
        testName = '_';
      }
      testName = testName.trim();
      if (!snapshotName) {
        snapshotName = 'default';
      }
      snapshotName = snapshotName.trim();

      const snapshot = await extractSnapshot(frame, testName, snapshotName);

      const dir = path.resolve(
        process.cwd(),
        '.test_artifacts',
        'karma_snapshots'
      );
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (e) {
        // Ignore. Let the file write fail instead.
      }

      // TODO: make "safe file name" rules better.
      const maxFileName = 240;
      let fileName = `${
        testName.length + snapshotName.length < maxFileName
          ? testName
          : testName.substring(
              0,
              Math.max(maxFileName - snapshotName.length, 0)
            )
      }__${
        snapshotName.length < maxFileName
          ? snapshotName
          : snapshotName.substring(0, maxFileName)
      }`;
      fileName = fileName.replace(/[^a-z0-9]/gi, '_');
      const filePath = path.resolve(dir, fileName + '.html');
      await fs.writeFile(filePath, snapshot);
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
      const clipboardContent = new DataTransfer();
      const event = new ClipboardEvent('copy', {
        bubbles: true,
        cancelable: true,
        clipboardContent,
      });
      target.dispatchEvent(event);
      return clipboardContent;
    });
  });

  // Paste.
  await exposeClipboardFunction('paste', async (frame) => {
    if (!clipboardData) {
      throw new Error('clipboard is empty');
    }
    await frame.evaluate((clipboardContent) => {
      // @todo: do `document.execCommand('paste')` inside an input or
      // a contenteditable.
      const target = document.activeElement;
      const event = new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardContent,
      });
      target.dispatchEvent(event);
      return clipboardContent;
    }, clipboardData);
  });
}

function getContextFrame(page) {
  return (
    page.frames().find((frame) => frame.name() === 'context') ||
    page.mainFrame()
  );
}

async function extractSnapshot(frame, testName, snapshotName) {
  const { head, body } = await frame.evaluate(() => {
    // TODO: more careful head selection.
    return {
      head: document.head.innerHTML,
      body: document.body.innerHTML,
    };
  });

  const localizeUrls = (s) => s.replace(/http:\/\/localhost:9876\//gi, '/');

  return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
      <title>${testName}: ${snapshotName}</title>
      <style>
        body {
          margin: 0;
          width: 100vw;
          height: 100vh;
        }
      </style>
      ${localizeUrls(head)}
    </head>
    <body>
      ${localizeUrls(body)}
    </body>
    </html>
  `;
}

puppeteerBrowser.$inject = ['baseBrowserDecorator', 'config.puppeteerLauncher'];

module.exports = {
  'launcher:puppeteer': ['type', puppeteerBrowser],
};
