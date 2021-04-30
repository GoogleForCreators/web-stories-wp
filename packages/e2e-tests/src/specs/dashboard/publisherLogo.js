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
  deleteMedia,
  uploadPublisherLogo,
  visitSettings,
  withExperimentalFeatures,
} from '@web-stories-wp/e2e-test-utils';

const ERROR_TEXT =
  'Sorry, this file type is not supported. Only jpg, png, and static gifs are supported for publisher logos.';

describe('publisher logo', () => {
  withExperimentalFeatures(['enableSVG']);

  it('should not upload a logo that is an invalid type with svg enabled', async () => {
    await visitSettings();

    // Upload publisher logo
    await uploadPublisherLogo('video-play.svg');

    // verify error message
    await expect(page).toMatchElement('[role="alert"]', {
      text: ERROR_TEXT,
    });
  });

  it('should be able to upload multiple logos', async () => {
    await visitSettings();

    // Upload publisher logo
    const logoOneName = await uploadPublisherLogo('yay-fox.gif');
    // verify no error message
    await expect(page).not.toMatchElement('[role="alert"]', {
      text: ERROR_TEXT,
    });

    const logoTwoName = await uploadPublisherLogo('its-a-walk-off.gif');
    // verify no error message
    await expect(page).not.toMatchElement('[role="alert"]', {
      text: ERROR_TEXT,
    });

    // verify that the publisher logos exist
    await expect(page).toMatchElement(
      `button[aria-label^="Publisher logo menu for ${logoOneName}"`
    );
    await expect(page).toMatchElement(
      `button[aria-label^="Publisher logo menu for ${logoTwoName}"`
    );

    // cleanup
    await deleteMedia(logoOneName);
    await deleteMedia(logoTwoName);
  });

  it('should be able to delete all except one logo', async () => {
    await visitSettings();

    // Upload publisher logo
    const logoOneName = await uploadPublisherLogo('yay-fox.gif');
    // verify no error message
    await expect(page).not.toMatchElement('[role="alert"]', {
      text: ERROR_TEXT,
    });

    const logoTwoName = await uploadPublisherLogo('its-a-walk-off.gif');
    // verify no error message
    await expect(page).not.toMatchElement('[role="alert"]', {
      text: ERROR_TEXT,
    });

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

    // cleanup
    await deleteMedia(logoOneName);
    await deleteMedia(logoTwoName);
  });
});
