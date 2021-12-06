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
    await page.hover('div[data-testid^=story-grid-item]');
    const story = await page.evaluate(
      'document.querySelector("div[data-testid^=story-grid-item]").getAttribute("data-testid")'
    );
    //need to get story id to click on the context menu of the story
    const storyId = story.split('-');
    //storyId= ['story', 'grid', 'item', 'storyId']
    await expect(page).toClick(
      `button[data-testid="story-context-button-${storyId[3]}"]`
    );
    const [deleteMenuButton] = await page.$x(
      "//button[contains(.,'Delete Story')]"
    );
    await page.waitForTimeout(100);
    await deleteMenuButton.click();
    const [deleteButton] = await page.$x("//button[text()='Delete']");
    await deleteButton.click();
    await page.waitForTimeout(100);
    await expect(page).not.toMatch('Delete this story');
  });
});
