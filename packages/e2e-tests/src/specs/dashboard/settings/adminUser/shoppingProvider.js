/*
 * Copyright 2022 Google LLC
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

describe('Shopify settings', () => {
  const shoppingProviderDropdownSelector =
    'button[aria-label="Shopping provider"]';

  // eslint-disable-next-line jest/no-disabled-tests  -- TODO(#11994): Fix flakey test.
  it.skip('should let me see and update shopping provider settings', async () => {
    await visitSettings();
    // Small trick to ensure we scroll to this input.
    const shoppingProviderDropdown = await page.$(
      shoppingProviderDropdownSelector
    );
    await shoppingProviderDropdown.focus();

    await expect(page).toMatchElement(shoppingProviderDropdownSelector);

    // verify that the shopping provider settings can be changed
    await expect(page).toClick(shoppingProviderDropdownSelector, {
      text: /None|WooCommerce|Shopify/i,
    });

    await expect(page).toClick('[role="listbox"] li', { text: 'Shopify' });
    await expect(page).toMatchElement(shoppingProviderDropdownSelector, {
      text: 'Shopify',
    });

    // reset shopping provider setting
    await expect(page).toClick(shoppingProviderDropdownSelector, {
      text: 'Shopify',
    });
    await expect(page).toClick('[role="listbox"] li', { text: 'None' });
    await expect(page).toMatchElement(shoppingProviderDropdownSelector, {
      text: 'None',
    });
  });
});
