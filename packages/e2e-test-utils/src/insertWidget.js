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
async function insertWidget(name) {
  // Hotfix for WordPress 5.3 where `wpWidgets.l10n.widgetAdded`
  // is referenced by wp-admin/js/widgets.js, but doesn't actually exist.
  // See:
  // https://github.com/WordPress/wordpress-develop/blob/8eb0eb36e026ca5c7f7c8f84b28390709c98089b/src/wp-includes/script-loader.php#L1735-L1747
  // https://github.com/WordPress/wordpress-develop/blob/8eb0eb36e026ca5c7f7c8f84b28390709c98089b/src/js/_enqueues/admin/widgets.js#L721
  await page.evaluate(() => {
    if (window.wpWidgets?.l10n) {
      window.wpWidgets.l10n.widgetAdded = 'Widget added';
    }
  });

  await expect(page).toMatch(name);
  await expect(page).toClick('button', { text: 'Add widget: ' + name });
  await expect(page).toClick('button', { text: 'Add Widget' });
}
export default insertWidget;
