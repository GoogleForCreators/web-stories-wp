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
import { percySnapshot } from '@percy/puppeteer';

/**
 * Internal dependencies
 */
import { createNewStory } from '../../../utils';

describe('Inserting Media from Media Library', () => {
  // Uses the existence of the element's frame element as an indicator for successful insertion.
  it('should insert an image by clicking on it', async () => {
    await createNewStory();

    await expect(page).not.toMatchElement('[data-testid="FrameElement"]');

    await page.waitForSelector('[data-testid="mediaElement-image"]');
    // Clicking will only act on the first element.
    await expect(page).toClick('[data-testid="mediaElement-image"]');

    await page.waitForSelector('[data-testid="frameElement"]:nth-of-type(2)');

    // First match is for the background element, second for the image.
    await expect(page).toMatchElement(
      '[data-testid="frameElement"]:nth-of-type(2)'
    );

    await expect(page).toMatchElement('[data-testid="imageElement"]');

    await percySnapshot(page, 'Inserting Image from Media Library');
  });
});
