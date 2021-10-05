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
 * Insert a widget with the given name.
 *
 * @param {string} name Widget name.
 * @return {Promise<void>}
 */
async function insertWidget(name) {
  await expect(page).toMatch(name);
  await expect(page).toClick('button', { text: 'Add widget: ' + name });
  await expect(page).toClick('button', { text: 'Add Widget' });
  // When you click on the button to add a widget, a "chooser" dropdown is displayed which has these classes.
  // Once you add the widget, the chooser disappears again, which is what this call here checks for.
  await page.waitForFunction(
    () => !document.querySelector('.widget.widget-in-question')
  );
}

export default insertWidget;
