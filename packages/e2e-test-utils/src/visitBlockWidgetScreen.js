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

/**
 * Visit block based widget screen, found in WordPress 5.8+ and dismiss welcome message.
 *
 * @return {Promise<void>}
 */
async function visitBlockWidgetScreen() {
  await visitAdminPage('widgets.php');

  // Disable welcome guide if it is enabled.
  // The former selector is for WP < 5.9
  const isWelcomeGuideActive = await page.evaluate(() => {
    if (wp.data.select('core/preferences')) {
      return Boolean(
        wp.data
          .select('core/preferences')
          .get('core/edit-widgets', 'welcomeGuide')
      );
    }

    if (wp.data.select('core/interface')) {
      return wp.data
        .select('core/interface')
        ?.isFeatureActive?.('core/edit-widgets', 'welcomeGuide');
    }

    if (wp.data.select('core/edit-widgets')) {
      return wp.data
        .select('core/edit-widgets')
        ?.__unstableIsFeatureActive?.('welcomeGuide');
    }

    return false;
  });

  if (isWelcomeGuideActive) {
    // The former action is for WP < 5.9
    await page.evaluate(() => {
      wp.data
        .dispatch('core/edit-widgets')
        ?.__unstableToggleFeature?.('welcomeGuide');
      wp.data
        .dispatch('core/interface')
        ?.toggleFeature?.('core/edit-widgets', 'welcomeGuide');
    });
  }
}
export default visitBlockWidgetScreen;
