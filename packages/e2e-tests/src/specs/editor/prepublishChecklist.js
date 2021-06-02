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
import { createNewStory, withUser } from '@web-stories-wp/e2e-test-utils';
import percySnapshot from '@percy/puppeteer';

describe('Pre-Publish Checklist', () => {
  withUser('admin', 'password');

  it('should show the checklist', async () => {
    await createNewStory();
    await expect(page).toClick('li', { text: 'Checklist' });
    await expect(page).not.toMatchElement(
      '#inspector-tab-prepublish[hidden=""]'
    );
    await expect(page).toMatchElement('#inspector-tab-prepublish');
  });

  it('should show that there is no poster attached to the story', async () => {
    await createNewStory();
    await expect(page).toClick('[data-testid^="mediaElement"]');
    await expect(page).toMatchElement('[data-testid="imageElement"]');
    await expect(page).toClick('button', { text: 'Publish' });
    // Bypass checklist
    await page.waitForSelector('.ReactModal__Content');
    await expect(page).toClick('button', {
      text: /Continue to publish/,
    });
    await expect(page).toMatch('Story published.');
    await expect(page).toClick('button', { text: 'Dismiss' });

    await page.reload();
    await expect(page).toMatchElement('input[placeholder="Add title"]');

    await expect(page).toClick('li', { text: 'Checklist' });
    await expect(page).not.toMatchElement(
      '#inspector-tab-prepublish[hidden=""]'
    );
    await expect(page).toMatchElement('#inspector-tab-prepublish');
    await expect(page).toMatch('Add poster image');
    await percySnapshot(page, 'Prepublish checklist');
  });
});
