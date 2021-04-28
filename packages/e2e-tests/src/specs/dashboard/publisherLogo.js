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
  it('should be able to upload multiple logos', async () => {
    await visitSettings();

    // Upload publisher logo
    const logoOneName = await uploadPublisherLogo('yay-fox.gif', false);
    const logoTwoName = await uploadPublisherLogo('its-a-walk-off.gif', false);

    // verify that the publisher logos exist
    await expect(page).toMatchElement(
      `button[aria-label^="Publisher logo menu for ${logoOneName}-"`
    );
    await expect(page).toMatchElement(
      `button[aria-label^="Publisher logo menu for ${logoTwoName}-"`
    );

    // TODO: Clear all logos so that we start at zero each time
    // Should be able to use the data adapter or something to
    // Remove the all the logos
  });

  it.todo('should be able to delete all except one logo');
});
