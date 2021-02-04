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

import { createNewStory } from '../../utils';

// todo enable tests when feature flag is on
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('prepublish checklist', () => {
  it('should show the checklist', async () => {
    await createNewStory();
    await expect(page).toMatchElement('#inspector-tab-prepublish[hidden=""]');
    await expect(page).toClick('li', { text: 'Checklist' });
    await expect(page).not.toMatchElement(
      '#inspector-tab-prepublish[hidden=""]'
    );
    await expect(page).toMatchElement('#inspector-tab-prepublish');
  });
  it('should show that there is no cover attached to the story', async () => {
    await createNewStory();
    await expect(page).toClick('[data-testid^="mediaElement"]');
    await expect(page).toClick('li', { text: 'Checklist' });
    const missingStoryCover = await page.$$eval(
      '#inspector-tab-prepublish > section > div',
      (elements) => {
        return elements.some((el) =>
          el.textContent.includes('Missing story cover image')
        );
      }
    );
    expect(missingStoryCover).toBeTrue();
  });
});
