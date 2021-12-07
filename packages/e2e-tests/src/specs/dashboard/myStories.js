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
  visitDashboard,
  insertStoryTitle,
} from '@web-stories-wp/e2e-test-utils';

describe('Stories Dashboard', () => {
  it('should delete story', async () => {
    //need to create new story as all stories are deleted before test runs.
    await createNewStory();
    await insertStoryTitle('Delete this story');
    await publishStory();
    await visitDashboard();

    await expect(page).toMatchElement('h2', { text: 'Dashboard' });
    await page.hover(
      '[role="listitem"][aria-label="Details about Delete this story"]'
    );
    await expect(page).toClick(
      'button[aria-label="Context menu for Delete this story"]'
    );
    await expect(page).toClick('button', { text: 'Delete Story' });
    await expect(page).toClick(
      `button[aria-label='Confirm deleting story "Delete this story"']`
    );
    await page.waitForTimeout(100);
    await expect(page).not.toMatchElement('h3', {
      text: 'Delete this story',
    });
  });
  it('should duplicate story', async () => {
    //need to create new story as all stories are deleted before test runs.
    await createNewStory();
    await insertStoryTitle('Duplicate this story');
    await publishStory();
    await visitDashboard();

    await expect(page).toMatchElement('h2', { text: 'Dashboard' });
    await page.hover(
      '[role="listitem"][aria-label="Details about Duplicate this story"]'
    );
    await expect(page).toClick(
      'button[aria-label="Context menu for Duplicate this story"]'
    );
    await expect(page).toClick('button', { text: 'Duplicate' });
    await page.waitForTimeout(100);
    await expect(page).toMatchElement('h3', {
      text: 'Duplicate this story (Copy)',
    });
  });
  it('should rename story', async () => {
    //need to create new story as all stories are deleted before test runs.
    await createNewStory();
    await insertStoryTitle('Rename this story');
    await publishStory();
    await visitDashboard();

    await expect(page).toMatchElement('h2', { text: 'Dashboard' });
    await page.hover('div[data-testid^=story-grid-item]');
    await page.hover(
      '[role="listitem"][aria-label="Details about Rename this story"]'
    );
    await expect(page).toClick(
      'button[aria-label="Context menu for Rename this story"]'
    );
    await expect(page).toClick('button', { text: 'Rename' });
    await expect(page).toMatchElement('input[value="Rename this story"]');
    await page.type('input[value="Rename this story"]', 'Renamed story');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(100);
    await expect(page).toMatchElement('h3', {
      text: 'Renamed story',
    });
  });
});
