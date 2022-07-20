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
  uploadPublisherLogoEditor,
  takeSnapshot,
  addTextElement,
  insertStoryTitle,
} from '@web-stories-wp/e2e-test-utils';

describe('Pre-Publish Checklist : Admin User', () => {
  const addNewPage = async () => {
    await expect(page).toClick('button[aria-label="Add New Page"]');
    await addTextElement();
  };
  const addPages = async (number) => {
    for (let i = 0; i < number; i++) {
      // eslint-disable-next-line no-await-in-loop
      await addNewPage();
    }
  };

  beforeEach(async () => {
    await createNewStory();
  });

  it('should show the checklist', async () => {
    await expect(page).toClick('button[aria-label="Checklist"]');
    await triggerHighPriorityChecklistSection();
    await expect(page).toMatchElement(
      '#pre-publish-checklist[data-isexpanded="true"]'
    );
  });

  it('should show that there is no poster attached to the story', async () => {
    await expect(page).toClick('[data-testid^="mediaElement"]');
    const insertButton = await page.waitForXPath(
      `//li//span[contains(text(), 'Insert image')]`
    );
    await insertButton.click();
    await expect(page).toMatchElement('[data-testid="imageElement"]');

    await insertStoryTitle('Prepublish Checklist - admin - no poster warning');

    await publishStory();

    await page.reload();
    await expect(page).toMatchElement('input[placeholder="Add title"]');

    await expect(page).toClick('button[aria-label^="Checklist: "]');
    await expect(page).toMatchElement(
      '#pre-publish-checklist[data-isexpanded="true"]'
    );
    await expect(page).toMatch('Add poster image');
    await takeSnapshot(page, 'Prepublish checklist');
  });

  //eslint-disable-next-line jest/no-disabled-tests -- TODO(#): Fix flakey test.
  it.skip('should show cards related to poster image issues', async () => {
    await addTextElement();
    await addPages(3);

    await expect(page).toClick('button', { text: 'Publish' });
    await expect(page).toClick(
      'div[aria-label="Story details"] button[aria-label^="Checklist"]'
    );
    await expect(page).toMatch('Add poster image');

    await expect(page).toClick('p', { text: 'Document' });

    //find publish panel button
    const publishPanelButton = await expect(page).toMatchElement(
      '#sidebar-tab-document button',
      { text: 'Publishing' }
    );

    const isPublishPanelExpanded = await publishPanelButton.evaluate(
      (node) => node.getAttribute('aria-expanded') === 'true'
    );

    //open publish panel if not open

    //eslint-disable-next-line jest/no-conditional-in-test
    if (!isPublishPanelExpanded) {
      await publishPanelButton.click();
    }
    await uploadPublisherLogoEditor('example-1.jpg', false);

    await expect(page).not.toMatch('Add poster image');
  });

  it('should focus on media button when poster image issue card is clicked', async () => {
    await addTextElement();
    await addPages(3);

    await expect(page).toClick('button', { text: 'Publish' });
    await expect(page).toClick(
      'div[aria-label="Story details"] button[aria-label^="Checklist"]'
    );
    const title = await expect(page).toMatchElement('h2', {
      text: 'Add poster image',
    });
    const button = await title.evaluateHandle((node) => node.parentNode);

    expect(button).toBeDefined();

    await button.click();

    const isMediaPickerInFocus = await page.evaluate(
      () => document.activeElement.getAttribute('aria-label') === 'Poster image'
    );

    expect(isMediaPickerInFocus).toBeTrue();
  });
});
