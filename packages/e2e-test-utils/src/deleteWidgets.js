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
 * Internal dependencies
 */
import visitAdminPage from './visitAdminPage';
import activatePlugin from './activatePlugin';
import deactivatePlugin from './deactivatePlugin';

async function deleteWidgets() {
  await activatePlugin('classic-widgets');

  // Remove all widgets
  await visitAdminPage('widgets.php');

  const widgets = await page.$$('#widgets-right .widget');

  /* eslint-disable no-await-in-loop */
  for (const item of widgets) {
    await item.$eval('.widget-action', (toggleButton) => toggleButton.click());

    // Transition animation.
    // TODO: Remove and replace with waitForSelector or locator API.
    await new Promise((r) => setTimeout(r, 300));

    await item.$eval('.widget-control-remove', (deleteLink) =>
      deleteLink.click()
    );

    // Transition animation.
    // TODO: Remove and replace with waitForSelector or locator API.
    await new Promise((r) => setTimeout(r, 300));
  }
  /* eslint-enable no-await-in-loop */

  await deactivatePlugin('classic-widgets');
}

export default deleteWidgets;
