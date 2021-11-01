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
import { visitSettings } from '@web-stories-wp/e2e-test-utils';

/**
 * Internal dependencies
 */
import { monetizationDropdownSelector } from '../../../../utils';

describe('Admin User', () => {
  it('should let me see and update monetization settings', async () => {
    await visitSettings();

    // Small trick to ensure we scroll to this input.
    const monetizationDropdown = await page.$(monetizationDropdownSelector);
    await monetizationDropdown.focus();

    await expect(page).toMatchElement(monetizationDropdownSelector);

    // verify that the monetization settings can be changed
    await expect(page).toClick(monetizationDropdownSelector, { text: 'None' });

    await expect(page).toClick('li', { text: 'Google AdSense' });
    await expect(page).toMatchElement(monetizationDropdownSelector, {
      text: 'Google AdSense',
    });

    // reset monetization setting
    await expect(page).toClick(monetizationDropdownSelector, {
      text: 'Google AdSense',
    });
    await expect(page).toClick('li', { text: 'None' });
    await expect(page).toMatchElement(monetizationDropdownSelector, {
      text: 'None',
    });
  });
});
