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

const MAX_WAIT_THRESHOLD = 5000;

/** @typedef {import('puppeteer').Page} Page */

/**
 * Attempts to open the story preview in a new tab.
 *
 * @param {Page} editorPage Editor page object.
 * @return {Promise<Page>} Preview page object.
 */
async function previewStory(editorPage) {
  let openTabs = await browser.pages();
  const expectedTabsCount = openTabs.length + 1;
  await expect(editorPage).toClick('button:not([disabled])', {
    text: 'Preview',
  });
  await expect(editorPage).not.toMatch('The preview window failed to open.');

  let waits = 0;

  // Wait for the new tab to open.
  while (openTabs.length < expectedTabsCount) {
    waits++;

    if (waits >= MAX_WAIT_THRESHOLD) {
      throw new Error('There was an error previewing the story');
    }
    /* eslint-disable no-await-in-loop */
    await editorPage.waitForTimeout(1);
    openTabs = await browser.pages();
    /* eslint-enable no-await-in-loop */
  }

  const previewPage = openTabs[openTabs.length - 1];
  await previewPage.waitForSelector('amp-story');
  return previewPage;
}

export default previewStory;
