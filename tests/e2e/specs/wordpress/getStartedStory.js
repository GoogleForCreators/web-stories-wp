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
import { percySnapshot } from '@percy/puppeteer';

/**
 * WordPress dependencies
 */
import {
  loginUser,
  switchUserToAdmin,
  visitAdminPage,
} from '@wordpress/e2e-test-utils';

describe('Get Started Story', () => {
  describe('Admin User', () => {
    it('should pre-fill post title and post content', async () => {
      await visitAdminPage(
        'post-new.php',
        'post_type=web-story&web-stories-demo=1'
      );

      await expect(page).toMatchElement('input[placeholder="Add title"]');
      await expect(page).toMatch(
        /Tips to make the most of the Web Stories Editor/i
      );

      await page.waitForSelector('[data-testid="mediaElement-image"]');
      await page.waitForSelector('[data-testid="frameElement"]');

      await percySnapshot(page, 'Get Started Story');
    });
  });

  describe('Author User', () => {
    beforeAll(async () => {
      await loginUser('author', 'password');
    });

    afterAll(async () => {
      await switchUserToAdmin();
    });

    it('should pre-fill post title and post content', async () => {
      await visitAdminPage(
        'post-new.php',
        'post_type=web-story&web-stories-demo=1'
      );

      await expect(page).toMatchElement('input[placeholder="Add title"]');
      await expect(page).toMatch(
        /Tips to make the most of the Web Stories Editor/i
      );

      await page.waitForSelector('[data-testid="mediaElement-image"]');
      await page.waitForSelector('[data-testid="frameElement"]');
    });
  });
});
