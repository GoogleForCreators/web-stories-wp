/*
 * Copyright 2021 Google LLC
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
  visitDashboard,
  insertStoryTitle,
} from '@web-stories-wp/e2e-test-utils';

jest.retryTimes(2, { logErrorsBeforeRetry: true });

describe('Stories Dashboard', () => {
  const storyName = 'Test Story';
  beforeEach(async () => {
    await createNewStory();
    await insertStoryTitle(storyName);
    await publishStory();
    await visitDashboard();
  });

  it('should delete story', async () => {
    await expect(page).toMatchElement('h2', { text: 'Dashboard' });
    await page.hover(
      `[role="listitem"][aria-label="Details about ${storyName}"]`
    );
    await expect(page).toClick(
      `button[aria-label="Context menu for ${storyName}"]`
    );

    await expect(page).toClick('button', { text: 'Delete Story' });
    await expect(page).toMatch(/Are you sure you want to delete/);

    await expect(page).toMatchElement(
      '[role="dialog"][aria-label="Dialog to confirm deleting a story"] button',
      {
        text: 'Delete',
      }
    );

    await expect(page).toClick(
      '[role="dialog"][aria-label="Dialog to confirm deleting a story"] button',
      {
        text: 'Delete',
      }
    );

    await page.waitForResponse((response) =>
      response.url().includes('web-stories/v1/web-story/')
    );

    await expect(page).toMatch(/Start telling Stories/);
    await expect(page).not.toMatchElement('h3', {
      text: storyName,
    });
  });

  it('should duplicate story', async () => {
    await expect(page).toMatchElement('h2', { text: 'Dashboard' });
    await page.hover(
      `[role="listitem"][aria-label="Details about ${storyName}"]`
    );
    await expect(page).toClick(
      `button[aria-label="Context menu for ${storyName}"]`
    );

    await Promise.all([
      expect(page).toClick('button', { text: 'Duplicate' }),
      page.waitForResponse(
        (response) =>
          //eslint-disable-next-line jest/no-conditional-in-test
          response.url().includes('web-stories/v1/web-story/') &&
          response.status() === 201
      ),
    ]);

    await expect(page).toMatchElement('h3', {
      text: `${storyName} (Copy)`,
    });
  });

  it('should rename story', async () => {
    const newStoryName = 'Renamed story';
    await expect(page).toMatchElement('h2', { text: 'Dashboard' });
    await page.hover(
      `[role="listitem"][aria-label="Details about ${storyName}"]`
    );
    await expect(page).toClick(
      `button[aria-label="Context menu for ${storyName}"]`
    );
    await expect(page).toClick('button', { text: 'Rename' });
    await expect(page).toMatchElement(`input[value="${storyName}"]`);
    await page.type(`input[value="${storyName}"]`, newStoryName);

    await Promise.all([
      page.keyboard.press('Enter'),
      page.waitForResponse(
        (response) =>
          //eslint-disable-next-line jest/no-conditional-in-test
          response.url().includes('web-stories/v1/web-story/') &&
          response.status() === 200
      ),
    ]);

    await expect(page).toMatchElement('h3', {
      text: newStoryName,
    });
  });
});
