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
import { createNewStory } from '@web-stories-wp/e2e-test-utils';
import percySnapshot from '@percy/puppeteer';
/**
 * WordPress dependencies
 */
import { loginUser, switchUserToAdmin } from '@wordpress/e2e-test-utils';

describe('Contributor User', () => {
  beforeAll(async () => {
    await loginUser('contributor', 'password');
  });
  afterAll(async () => {
    await switchUserToAdmin();
  });

  it('should see permission error dialog as a contributor user', async () => {
    await createNewStory();
    await expect(page).not.toMatchElement('[data-testid="FrameElement"]');

    await expect(page).toClick('button', { text: 'Upload' });
    await page.waitForTimeout(500);
    await percySnapshot(page, 'Permission Message');
  });
});
