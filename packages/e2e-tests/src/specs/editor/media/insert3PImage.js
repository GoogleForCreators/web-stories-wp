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
 * External dependencies
 */
import { createNewStory } from '@web-stories-wp/e2e-test-utils';

describe('Inserting 3P Image', () => {
  it('should insert an 3P image', async () => {
    await createNewStory();

    await expect(page).not.toMatchElement('[data-testid="FrameElement"]');
    await expect(page).toClick('#library-tab-media3p');
    await expect(page).toClick('button', { text: 'Dismiss' });
    await expect(page).not.toMatch(
      'Your use of stock content is subject to third party terms'
    );

    await page.waitForSelector(
      '#library-pane-media3p [data-testid="mediaElement-image"]'
    );
    // Clicking will only act on the first element.
    await expect(page).toClick(
      '#library-pane-media3p [data-testid="mediaElement-image"]'
    );

    await expect(page).toMatchElement('[data-testid="imageElement"]');
  });
});
