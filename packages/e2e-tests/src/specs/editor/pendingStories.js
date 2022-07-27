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
/**
 * External dependencies
 */
import {
  createNewStory,
  getCurrentUser,
  insertStoryTitle,
  setCurrentUser,
  editStoryWithTitle,
} from '@web-stories-wp/e2e-test-utils';

// eslint-disable-next-line jest/no-disabled-tests -- TODO(#11993): Fix flakey test.
describe.skip('Pending Stories', () => {
  let currentUser;

  beforeAll(() => {
    currentUser = getCurrentUser();
  });

  //eslint-disable-next-line require-await
  afterAll(async () =>
    setCurrentUser(currentUser.username, currentUser.password)
  );

  it('should be able to publish a pending story', async () => {
    await setCurrentUser('contributor', 'password');

    await createNewStory();

    await insertStoryTitle('Submitting for review');

    // Contributor can only save or submit for review.
    await expect(page).toMatchElement('button[aria-label="Save draft"]');
    await expect(page).toMatchElement('button', {
      text: 'Submit for review',
    });

    await expect(page).toClick('button', { text: 'Submit for review' });
    // Contributor is now in story details modal
    await expect(page).toMatchElement('div[aria-label="Story details"]');
    await expect(page).toClick('div[aria-label="Story details"] button', {
      text: 'Submit for review',
    });
    // Modal closes
    await expect(page).toMatchElement('button:not([disabled]', {
      text: 'Submit for review',
    });
    await expect(page).toMatchElement('button[aria-label="Switch to Draft"]');

    await setCurrentUser('admin', 'password');

    await editStoryWithTitle('Submitting for review');

    // An admin can take save a pending story (so it stays pending), switch to draft,
    // or publish.
    await expect(page).toMatchElement('button[aria-label="Switch to Draft"]');
    await expect(page).toMatchElement('button[aria-label="Save as pending"]');
    await expect(page).toMatchElement('button', { text: /^Publish$/ });
  });
});
