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
  createNewStory,
  publishStory,
  triggerHighPriorityChecklistSection,
} from '@web-stories-wp/e2e-test-utils';
import percySnapshot from '@percy/puppeteer';

describe('Pre-Publish Checklist', () => {
  it('should show the checklist', async () => {
    await createNewStory();
    await expect(page).toClick('button[aria-label="Checklist"]');
    await triggerHighPriorityChecklistSection();
    await expect(page).toMatchElement(
      '#pre-publish-checklist[data-isexpanded="true"]'
    );
  });

  // Skipped for https://github.com/google/web-stories-wp/issues/7481
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should show that there is no poster attached to the story', async () => {
    await createNewStory();
    await expect(page).toClick('[data-testid^="mediaElement"]');
    await expect(page).toMatchElement('[data-testid="imageElement"]');

    await publishStory();

    await page.reload();
    await expect(page).toMatchElement('input[placeholder="Add title"]');

    await expect(page).toClick(
      'button[aria-label="Checklist: 3 unaddressed issues"]'
    );
    await expect(page).toMatchElement(
      '#pre-publish-checklist[data-isexpanded="true"]'
    );
    await expect(page).toMatch('Add poster image');
    await percySnapshot(page, 'Prepublish checklist');
  });
});
