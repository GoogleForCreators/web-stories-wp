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
 * Environment variables
 */
const {
  PUPPETEER_DEVTOOLS = false,
  PUPPETEER_HEADLESS = true,
  PUPPETEER_PRODUCT = 'chrome',
  PUPPETEER_SLOWMO = 0,
} = process.env;

// Same window size as in percy.config.yml.
// Different args needed for Firefox, see https://github.com/puppeteer/puppeteer/issues/6442.
const ARGS_CHROME = ['--window-size=1600,1000'];
const ARGS_FIREFOX = ['--width=1600', '--height=1000'];

module.exports = {
  launch: {
    devtools: PUPPETEER_DEVTOOLS === 'true',
    headless: PUPPETEER_HEADLESS !== 'false',
    slowMo: Number(PUPPETEER_SLOWMO) || 0,
    product: PUPPETEER_PRODUCT,
    args: 'chrome' === PUPPETEER_PRODUCT ? ARGS_CHROME : ARGS_FIREFOX,
  },
  extraPrefsFirefox: {},
  exitOnPageError: false,
};
