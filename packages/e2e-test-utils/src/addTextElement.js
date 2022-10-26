/*
 * Copyright 2020 Google LLC
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

export default async function addTextElement(preset = 'Paragraph') {
  await page.waitForSelector('#library-tab-text');
  await page.click('#library-tab-text');
  await expect(page).toClick('#library-pane-text button', { text: preset });
  await expect(page).toMatchElement('[data-testid="textFrame"]', {
    text: 'Paragraph' === preset ? 'Fill in some text' : preset,
  });
}
