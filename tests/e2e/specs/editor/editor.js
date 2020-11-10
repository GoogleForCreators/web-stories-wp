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
import { createNewStory, deactivateRTL, activateRTL } from '../../utils';

describe('Story Editor', () => {
  it('should be able to create a blank story', async () => {
    await createNewStory();

    await expect(page).toMatchElement('input[placeholder="Add title"]');

    await percySnapshot(page, 'Empty Editor');
  });
  it('should be able to create a blank story on RTL', async () => {
    await activateRTL();
    await createNewStory();

    await expect(page).toMatchElement('input[placeholder="Add title"]');

    await percySnapshot(page, 'Empty Editor on RTL');
    await deactivateRTL();
  });
});
