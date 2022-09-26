/*
 * Copyright 2022 Google LLC
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

async function loadPostEditor(showWelcomeGuide = false) {
  await page.waitForSelector('.edit-post-layout');
  const isWelcomeGuideActive = await page.evaluate(() =>
    wp.data.select('core/edit-post').isFeatureActive('welcomeGuide')
  );
  const isFullscreenMode = await page.evaluate(() =>
    wp.data.select('core/edit-post').isFeatureActive('fullscreenMode')
  );

  if (showWelcomeGuide !== isWelcomeGuideActive) {
    await page.evaluate(() =>
      wp.data.dispatch('core/edit-post').toggleFeature('welcomeGuide')
    );
    await page.reload();
    await page.waitForSelector('.edit-post-layout');
  }

  if (isFullscreenMode) {
    await page.evaluate(() =>
      wp.data.dispatch('core/edit-post').toggleFeature('fullscreenMode')
    );
    await page.waitForSelector('body:not(.is-fullscreen-mode)');
  }
}
export default loadPostEditor;
