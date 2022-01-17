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
import { takeSnapshot, createNewStory } from '@web-stories-wp/e2e-test-utils';

describe('Story Editor with disabled JavaScript', () => {
  it('should display error message', async () => {
    // Disable javascript for test.
    await page.setJavaScriptEnabled(false);

    await createNewStory();

    await expect(page).toMatchElement('.web-stories-wp-no-js');

    // Re-enable javascript for snapshots.
    await page.setJavaScriptEnabled(true);

    await takeSnapshot(page, 'Editor no js');
  });
});
