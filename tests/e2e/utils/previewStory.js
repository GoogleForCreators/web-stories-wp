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

async function previewStory( editorPage) {
  let openTabs = await browser.pages();
  const expectedTabsCount = openTabs.length + 1;
  await expect(editorPage).toClick('button', { text: 'Preview' });

  // Wait for the new tab to open.
  while (openTabs.length < expectedTabsCount) {
    /* eslint-disable no-await-in-loop */
    await editorPage.waitFor(1);
    openTabs = await browser.pages();
    /* eslint-enable no-await-in-loop */
  }

  const previewPage = openTabs[openTabs.length - 1];
  await previewPage.waitForSelector('amp-story');
  return previewPage;
}

export default previewStory;
