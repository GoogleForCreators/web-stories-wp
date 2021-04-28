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
 * WordPress dependencies
 */

/**
 * External dependencies
 */
import {
  uploadPublisherLogo,
  visitSettings,
} from '@web-stories-wp/e2e-test-utils';

describe('publisher logo', () => {
  afterEach(async () => {
    // Deletes all publisher logos using the browser context
    await page.evaluateHandle(async () => {
      await wp.apiFetch({
        path: '/web-stories/v1/settings/',
        method: 'POST',
        data: {
          web_stories_publisher_logos: [],
          web_stories_active_publisher_logo: -1,
        },
      });
    });
  });

  it('should be able to upload multiple logos', async () => {
    await visitSettings();

    // Upload publisher logo
    const logoOneName = await uploadPublisherLogo('yay-fox.gif');
    const logoTwoName = await uploadPublisherLogo('its-a-walk-off.gif');

    await page.waitForTimeout(1000);

    // verify that the publisher logos exist
    await expect(page).toMatchElement(
      `button[aria-label^="Publisher logo menu for ${logoOneName}"`
    );
    await expect(page).toMatchElement(
      `button[aria-label^="Publisher logo menu for ${logoTwoName}"`
    );
  });

  it('should be able to delete all except one logo', async () => {
    await visitSettings();

    // Upload publisher logo
    const logoOneName = await uploadPublisherLogo('yay-fox.gif');
    const logoTwoName = await uploadPublisherLogo('its-a-walk-off.gif');

    await page.waitForTimeout(1000);

    // Delete one logo
    await expect(page).toClick(
      `button[aria-label^="Publisher logo menu for ${logoTwoName}"`
    );
    await expect(page).toClick(
      'ul[aria-expanded="true"] button[aria-label="Delete"]'
    );
    await expect(page).toClick('button', { text: 'Delete Logo' });

    // should not find a button if its the last context menu
    await expect(page).not.toMatchElement(
      `button[aria-label^="Publisher logo menu for ${logoOneName}"`
    );
  });
});
