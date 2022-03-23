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
import {
  createNewStory,
  withUser,
  skipSuiteOnFirefox,
} from '@web-stories-wp/e2e-test-utils';

describe('Pre-Publish Checklist : Contributor User', () => {
  // Thew window size for Firefox is actually smaller than the viewport,
  // causing the checklist button to be off-screen, thus failing the test.
  skipSuiteOnFirefox();

  withUser('contributor', 'password');

  it('should not show messages user does not have permission for anyway', async () => {
    await createNewStory();

    await expect(page).toClick('button[aria-label="Checklist"]');
    await expect(page).toMatchElement(
      '[aria-label="Potential Story issues by category"][data-isexpanded="true"]'
    );

    // verify no issues are present
    await expect(page).toMatchElement('p', {
      text: 'You are all set for now. Return to this checklist as you build your Web Story for tips on how to improve it.',
    });
  });
});
