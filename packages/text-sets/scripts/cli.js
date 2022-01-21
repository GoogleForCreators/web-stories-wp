/*
 * Copyright 2021 Google LLC
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

/* eslint-disable no-await-in-loop, no-console */

/**
 * External dependencies
 */
import fs from 'fs';
import puppeteer from 'puppeteer';

const screenshotsPath = `build/text-sets/`;
// eslint-disable-next-line security/detect-non-literal-fs-filename
fs.mkdirSync(screenshotsPath, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({
    defaultViewport: null,
    headless: true,
    args: [`--window-size=1600,800`],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1600,
    height: 800,
    deviceScaleFactor: 2,
  });
  await page.goto(
    'http://localhost:8899/wp-admin/post-new.php?post_type=web-story'
  );
  await page.type('#user_login', 'admin');
  await page.type('#user_pass', 'password');
  await page.click('#wp-submit');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await page.waitForSelector('aria/Text library');
  await page.click('aria/Text library');
  await page.waitForSelector('aria/Text Set Options');
  // Wait for fonts to load
  await page.waitForTimeout(1000);

  // Change BG of all TextSets container parents to transparent
  await page.evaluateHandle(() => {
    const el = document.querySelector(`[aria-label="Text Set Options"]`);
    let tempParent = el;
    while (tempParent.parentNode) {
      tempParent.style.transition = 'none';
      tempParent.style.background = 'transparent';
      tempParent = tempParent.parentNode;
    }
    return el;
  });

  // Focus on first TextSet
  await page.focus(`[aria-label="Text Set Options"] button:nth-child(1)`);

  let lastTextSetId = null;
  let textSetId;
  while (lastTextSetId !== textSetId) {
    lastTextSetId = textSetId;
    // Generate PNG with transparent BG
    const textSet = await page.evaluateHandle(() => {
      const el = document.activeElement;
      el.style.transition = 'none';
      el.style.background = 'transparent';
      el.style.borderRadius = 0;
      el.parentNode.style.transition = 'none';
      el.parentNode.style.background = 'transparent';
      return el;
    });
    textSetId = (
      await page.evaluate((obj) => {
        return obj.getAttribute('data-testid');
      }, textSet)
    ).replace('text_set_', '');

    if (lastTextSetId === textSetId) {
      break;
    }

    await textSet.screenshot({
      path: `${screenshotsPath}${textSetId}.png`,
      omitBackground: true,
    });
    process.stdout.write('.');
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);
  }

  await browser.close();
  console.log(
    `\nText sets images generated in ${screenshotsPath}, please move and commit them to the GoogleForCreators/wp.stories.google repo.`
  );
})();

/* eslint-enable */
