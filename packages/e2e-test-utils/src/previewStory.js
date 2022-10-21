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

/** @typedef {import('puppeteer').Page} Page */

/**
 * Attempts to open the story preview in a new tab.
 *
 * @param {boolean} waitForStoryDebugView Whether to wait for the expected dev view.
 * @return {Promise<Page>} Preview page object.
 */
async function previewStory(waitForStoryDebugView = true) {
  await page.waitForSelector('button:not([disabled])[aria-label="Preview"]');
  await page.click('button:not([disabled])[aria-label="Preview"]');

  const currentTarget = page.target();
  const previewPageTarget = await browser.waitForTarget(
    (target) => target.opener() === currentTarget
  );

  const previewPage = await previewPageTarget.page();
  await previewPage.waitForSelector('body');

  await previewPage.waitForFunction(
    () =>
      document.title.length > 0 &&
      !document.title.includes('Generating the preview')
  );

  if (waitForStoryDebugView) {
    await previewPage.waitForSelector('.i-amphtml-story-dev-tools-header');

    await expect(previewPage).toMatch(/Preview/i);
    await expect(previewPage).toMatch(/Debug/i);
    await expect(previewPage).toMatch(/Add device/i);
  }

  return previewPage;
}

export default previewStory;
