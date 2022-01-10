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
} from '@web-stories-wp/e2e-test-utils';

describe('Pre-Publish Checklist : Admin User', () => {
  const addNewTextElement = async () => {
    await expect(page).toClick('button[aria-label="Add new text element"]');
  };
  const addNewPage = async () => {
    await expect(page).toClick('button[aria-label="Add New Page"]');
    await addNewTextElement();
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
    await expect(page).toMatchElement('[data-testid="imageElement"]');

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

  it('should show cards related to poster image issues', async () => {
    await addNewTextElement();
    await addPages(3);

    await expect(page).toClick('button', { text: 'Publish' });
    await expect(page).toClick('button', { text: 'Review Checklist' });
    await expect(page).toMatch('Add poster image');

    await expect(page).toClick('p', { text: 'Document' });

    //find publish panel button
    const publishPanelButton = await expect(page).toMatchElement(
      '#inspector-tab-document button',
      { text: 'Publishing' }
    );

    const isPublishPanelExpanded = await publishPanelButton.evaluate(
      (node) => node.getAttribute('aria-expanded') === 'true'
    );

    //open publish panel if not open
    if (!isPublishPanelExpanded) {
      await publishPanelButton.click();
    }
    await uploadPublisherLogoEditor('example-1.jpg', false);

    await expect(page).not.toMatch('Add poster image');
  });

  it('should focus on media button when poster image issue card is clicked', async () => {
    await addNewTextElement();
    await addPages(3);

    await expect(page).toClick('button', { text: 'Publish' });
    await expect(page).toClick('button', { text: 'Review Checklist' });
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
