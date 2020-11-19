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
import { percySnapshot } from '@percy/puppeteer';

/**
 * Internal dependencies
 */
import { createNewStory } from '../../../utils';

const MODAL = '.media-modal';

describe('Inserting Media from Dialog', () => {
  // Uses the existence of the element's frame element as an indicator for successful insertion.
  it('should insert an image by clicking on it', async () => {
    await createNewStory();

    await expect(page).not.toMatchElement('[data-testid="FrameElement"]');

    // Clicking will only act on the first element.
    await expect(page).toClick('button', { text: 'Upload' });

    await page.waitForSelector(MODAL, {
      visible: true,
    });
    const btnTab = '#menu-item-browse';
    await page.waitForSelector(btnTab);
    await page.evaluate((selector) => {
      document.querySelector(selector).click();
    }, btnTab);
    const btnSelector =
      '.attachments-browser .attachments .attachment:first-of-type';
    await page.waitForSelector(btnSelector);
    await page.evaluate((selector) => {
      document.querySelector(selector).click();
    }, btnSelector);
    const btnSelect = '.media-button-select';
    await page.evaluate((selector) => {
      document.querySelector(selector).click();
    }, btnSelect);

    await expect(page).toMatchElement('[data-testid="imageElement"]');

    await percySnapshot(page, 'Inserting Image from Dialog');
  });
});
