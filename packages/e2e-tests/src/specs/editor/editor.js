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
import {
  takeSnapshot,
  createNewStory,
  toggleVideoOptimization,
  previewStory,
  withRTL,
} from '@web-stories-wp/e2e-test-utils';

describe('Story Editor', () => {
  it('should be able to create a blank story', async () => {
    await createNewStory();

    await expect(page).toMatchElement('input[placeholder="Add title"]');

    await takeSnapshot(page, 'Empty Editor');
  });

  describe('RTL', () => {
    withRTL();

    it('should be able to create a blank story on RTL', async () => {
      await createNewStory();

      await expect(page).toMatchElement('input[placeholder="Add title"]');

      await takeSnapshot(page, 'Empty Editor on RTL');
    });
  });

  it('should have cross-origin isolation enabled', async () => {
    await createNewStory();

    const crossOriginIsolated = await page.evaluate(
      () => window.crossOriginIsolated
    );
    expect(crossOriginIsolated).toBeTrue();
  });

  it('should have cross-origin isolation disabled', async () => {
    await toggleVideoOptimization();
    await createNewStory();

    const crossOriginIsolated = await page.evaluate(
      () => window.crossOriginIsolated
    );
    expect(crossOriginIsolated).toBeFalse();
    await toggleVideoOptimization();
  });

  it('should preview story with development mode', async () => {
    await createNewStory();

    const editorPage = page;
    const previewPage = await previewStory(editorPage);

    await previewPage.waitForSelector('.i-amphtml-story-dev-tools-header');

    await expect(previewPage).toMatch(/Preview/i);
    await expect(previewPage).toMatch(/Debug/i);
    await expect(previewPage).toMatch(/Add device/i);

    await previewPage.waitForSelector('amp-story-player');
    await expect(previewPage).toMatchElement('amp-story-player');

    await editorPage.bringToFront();
    await previewPage.close();
  });
});
