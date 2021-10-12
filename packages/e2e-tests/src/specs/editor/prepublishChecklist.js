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
  insertStoryTitle,
  publishStory,
  triggerHighPriorityChecklistSection,
  withUser,
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

  it('should show that there is no poster attached to the story', async () => {
    await createNewStory();
    await expect(page).toClick('[data-testid^="mediaElement"]');
    await expect(page).toMatchElement('[data-testid="imageElement"]');

    await publishStory();

    await page.reload();
    await expect(page).toMatchElement('input[placeholder="Add title"]');

    await expect(page).toClick('button[aria-label^="Checklist: "]');
    await expect(page).toMatchElement(
      '#pre-publish-checklist[data-isexpanded="true"]'
    );
    await expect(page).toMatch('Add poster image');
    await percySnapshot(page, 'Prepublish checklist');
  });

  describe('Contributor User', () => {
    // eslint-disable-next-line jest/require-hook
    withUser('contributor', 'password');

    it('should not let me publish a story as a contributor', async () => {
      await createNewStory();

      await insertStoryTitle('Publishing Flow: Contributor');

      await expect(page).toClick('button[aria-label="Checklist"]');
      await expect(page).toMatchElement(
        '#pre-publish-checklist[data-isexpanded="true"]'
      );

      // verify no issues are present
      await expect(page).toMatchElement('p', {
        text: 'You are all set for now. Return to this checklist as you build your Web Story for tips on how to improve it.',
      });

      // verify that publish button is disabled
      await expect(page).toMatchElement('button:disabled', { text: 'Publish' });
    });
  });
});
