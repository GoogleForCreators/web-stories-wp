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
  insertStoryTitle,
  withUser,
} from '@web-stories-wp/e2e-test-utils';

describe('Contributor User', () => {
  withUser('contributor', 'password');

  it('should only be able to submit a story for review', async () => {
    await createNewStory();

    await insertStoryTitle('Submitting for review');

    await expect(page).toMatchElement('button', { text: 'Submit for review' });

    await expect(page).toClick('li[role="tab"]', { text: 'Document' });

    await expect(page).toMatchElement('button[disabled]', {
      text: /^Public/,
    });
    await expect(page).not.toMatchElement('li[role="option"]', {
      text: /^Private/,
    });
    await expect(page).not.toMatchElement('li[role="option"]', {
      text: /^Password Protected/,
    });
  });
});
