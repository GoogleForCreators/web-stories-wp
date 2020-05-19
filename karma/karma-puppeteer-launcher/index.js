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
    await exposeFunctions(page);

    await page.goto(url);
  };

  this.on('kill', async (done) => {
    if (browser != null) {
      await browser.close();
    }
    done();
  });
}

async function exposeFunctions(page) {
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

puppeteerBrowser.$inject = ['baseBrowserDecorator', 'config.puppeteerLauncher'];

module.exports = {
  'launcher:puppeteer': ['type', puppeteerBrowser],
};
