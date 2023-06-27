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

/**
 * Internal dependencies
 */
import visitSettings from './visitSettings';

async function setAnalyticsCode(code) {
  await visitSettings();

  const inputSelector =
    'input[placeholder^="Enter your Google Analytics Measurement ID"]';

  await expect(page).toMatchElement(inputSelector);
  await page.evaluate(() => {
    const input = document.getElementById('gaTrackingId');
    input.value = '';
  });

  // If empty string, type space and remove it.
  if (code === '') {
    await page.type(inputSelector, ' ');
    await page.keyboard.press('Backspace');
  } else {
    await page.type(inputSelector, code);
  }

  await expect(page).toClick('button', { text: 'Save' });
  // Wait for setting to save.
  await page.waitForTimeout(1000);
}

export default setAnalyticsCode;
