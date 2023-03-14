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
import { createNewStory } from '@web-stories-wp/e2e-test-utils';

jest.retryTimes(3, { logErrorsBeforeRetry: true });

describe('Publish panel in document tab', () => {
  const openPublishPanel = async () => {
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
    if (!isPublishPanelExpanded) {
      await publishPanelButton.click();
    }
  };
  beforeEach(async () => {
    await createNewStory();
    await openPublishPanel();
  });

  it('should allow changing author', async () => {
    await expect(page).toClick('button[aria-label="Author"]', {
      text: 'admin',
    });

    await expect(page).toMatchElement('[aria-label="Option List Selector"]', {
      text: 'author',
    });

    await expect(page).toClick(' [aria-label="Option List Selector"] li', {
      text: 'author',
    });

    await expect(page).toMatchElement('button[aria-label="Author"]', {
      text: 'author',
    });
  });

  it('should allow searching author', async () => {
    const authorDropDownButton = await expect(page).toMatchElement(
      'button[aria-label="Author"]'
    );
    await expect(authorDropDownButton).toMatchTextContent('admin');

    await authorDropDownButton.click();

    const authorDropDownOptions = await expect(page).toMatchElement(
      '[aria-label="Option List Selector"]'
    );

    const optionListBeforeSearch = await authorDropDownOptions.$$eval(
      'li[role="option"]',
      (nodeList) => nodeList.map((node) => node.innerText)
    );
    expect(optionListBeforeSearch).toBeDefined();
    expect(optionListBeforeSearch.length).toBeGreaterThan(1);

    await page.keyboard.type('auth');

    // wait for search results
    await page.waitForResponse(
      (response) =>
        //eslint-disable-next-line jest/no-conditional-in-test
        response.url().includes('web-stories/v1/users') &&
        response.url().includes('search=auth') &&
        response.status() === 200
    );

    // add small delay after we have results
    await page.waitForTimeout(400);

    const optionListAfterSearch = await authorDropDownOptions.$$eval(
      'li[role="option"]',
      (nodeList) => nodeList.map((node) => node.innerText)
    );

    expect(optionListAfterSearch).toHaveLength(1);

    await expect(authorDropDownOptions).toClick('li', { text: 'author' });
    await expect(authorDropDownButton).toMatchTextContent('author');
  });
});
