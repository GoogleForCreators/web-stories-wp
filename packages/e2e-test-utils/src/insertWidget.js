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
  await expect(page).toMatchElement('#widgets-left .widget-title', {
    text: name,
  });
  await expect(page).toClick('#widgets-left button', {
    text: `Add widget: ${name}`,
  });
  await expect(page).toClick('.widgets-chooser-add', { text: 'Add Widget' });

  await page.waitForResponse(
    (response) =>
      response.url().includes('/wp-admin/admin-ajax.php') &&
      response.status() === 200
  );

  // Transition animation.
  await page.waitForTimeout(300);

  await expect(page).toMatchElement('#widgets-right .widget .widget-title', {
    text: name,
  });

  await expect(page).toMatchTextContent('Widget Title');
}
export default insertWidget;
