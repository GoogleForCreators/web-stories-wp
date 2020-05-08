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

const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer');

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
      defaultViewport: puppeteerOptions.defaultViewport,
    });

    const page = await browser.newPage();

    // Mouse functions.
    await exposeFunctions(page, puppeteerOptions);

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
  await exposeFunction(page, 'saveSnapshot', async (frame, testName, snapshotName) => {
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

    const dir = path.resolve(process.cwd(), '.test_artifacts', 'karma_snapshots');
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (e) {
      // Ignore. Let the file write fail instead.
    }

    // TODO: make "safe file name" rules better.
    const maxFileName = 240;
    let fileName = `${
      testName.length + snapshotName.length < maxFileName ?
      testName :
      testName.substring(0, Math.max(maxFileName - snapshotName.length, 0))
    }__${
      snapshotName.length < maxFileName ?
      snapshotName :
      snapshotName.substring(0, maxFileName)
    }`;
    fileName = fileName.replace(/[^a-z0-9]/gi, '_');
    const filePath = path.resolve(dir, fileName + '.html');
    await fs.writeFile(filePath, snapshot);
  });

  // Click.
  // See https://github.com/puppeteer/puppeteer/blob/v3.0.4/docs/api.md#frameclickselector-options.
  await exposeFunction(page, 'click', (frame, selector, options) => {
    return frame.click(selector, options);
  });

  // Focus.
  // See https://github.com/puppeteer/puppeteer/blob/v3.0.4/docs/api.md#pagefocusselector
  await exposeFunction(page, 'focus', (frame, selector, options) => {
    return frame.focus(selector, options);
  });

  // TODO:
  // - frame.hover(selector)
  // - frame.select(selector, ...values)
  // - frame.tap(selector)
  // - frame.type(selector, text[, options])
  // - frame.waitFor(selectorOrFunctionOrTimeout[, options[, ...args]]) ?
  // - frame.waitForSelector(selector[, options])
  // - elementHandle.press(key[, options])
  // - elementHandle.screenshot([options])
  // - mouse (https://github.com/puppeteer/puppeteer/blob/v3.0.4/docs/api.md#class-mouse)
  // - keyboard
}

function exposeFunction(page, name, func) {
  return page.exposeFunction(`__karma_puppeteer_${name}`, (...args) => {
    return func(getContextFrame(page), ...args);
  });
}

function getContextFrame(page) {
  return page.frames().find((frame) => frame.name() === 'context');
}

async function extractSnapshot(frame, testName, snapshotName) {

  const {head, body} = await frame.evaluate(() => {
    // TODO: more careful head selection.
    return {
      head: document.head.innerHTML,
      body: document.body.innerHTML,
    };
  });

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
      ${head}
    </head>
    <body>
      ${body}
    </body>
    </html>
  `;
}

puppeteerBrowser.$inject = ['baseBrowserDecorator', 'config.puppeteerLauncher'];

module.exports = {
  'launcher:puppeteer': ['type', puppeteerBrowser],
};
