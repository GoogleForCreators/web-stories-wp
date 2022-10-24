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
  withRTL,
  skipSuiteOnFirefox,
} from '@web-stories-wp/e2e-test-utils';

jest.retryTimes(3, { logErrorsBeforeRetry: true });

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

  describe('Cross-Origin Isolation', () => {
    // Firefox+Puppeteer has issues with cross-origin isolation resulting in unexpected timeouts.
    // See https://github.com/google/web-stories-wp/pull/7748.
    skipSuiteOnFirefox();

    describe('Enabled', () => {
      beforeEach(async () => {
        await toggleVideoOptimization(true);
      });

      afterEach(async () => {
        await toggleVideoOptimization(false);
      });

      it('should have cross-origin isolation enabled', async () => {
        await createNewStory();

        const crossOriginIsolated = await page.evaluate(
          () => window.crossOriginIsolated
        );
        expect(crossOriginIsolated).toBeTrue();
      });
    });

    describe('Disabled', () => {
      // It's disabled by default in e2e tests.

      it('should have cross-origin isolation disabled', async () => {
        await toggleVideoOptimization();
        await createNewStory();

        const crossOriginIsolated = await page.evaluate(
          () => window.crossOriginIsolated
        );
        expect(crossOriginIsolated).toBeFalse();
        await toggleVideoOptimization();
      });
    });
  });
});
