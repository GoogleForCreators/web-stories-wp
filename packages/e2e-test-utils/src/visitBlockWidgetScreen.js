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
  const WPVersion = process.env?.WP_VERSION;
  await visitAdminPage('widgets.php');

  // Disable welcome guide if it is enabled.
  const isWelcomeGuideActive = await page.evaluate(() => {
    // TODO Change after 5.9 release.
    if ('latest' === WPVersion) {
      return wp.data
        .select('core/edit-widgets')
        .__unstableIsFeatureActive('welcomeGuide');
    }
    return wp.data
      .select('core/interface')
      .isFeatureActive('core/edit-widgets', 'welcomeGuide');
  });
  if (isWelcomeGuideActive) {
    await page.evaluate(() => {
      // TODO Change after 5.9 release.
      if ('latest' === WPVersion) {
        wp.data
          .dispatch('core/edit-widgets')
          .__unstableToggleFeature('welcomeGuide');
        return;
      }
      wp.data
        .dispatch('core/interface')
        .toggleFeature('core/edit-widgets', 'welcomeGuide');
    });
  }
}
export default visitBlockWidgetScreen;
