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
import { createNewStory, withUser } from '@web-stories-wp/e2e-test-utils';

describe('Sidebar', () => {
  describe('Document', () => {
    it('should display publisher logo upload', async () => {
      await createNewStory();

      await expect(page).toClick('li[role="tab"]', { text: 'Document' });
      await expect(page).toMatchElement('[aria-label="Publisher Logo"]');
    });
    describe('Contributor User', () => {
      withUser('contributor', 'password');

      it('should not display publisher logo upload', async () => {
        await createNewStory();
        await expect(page).toMatch('Howdy, contributor');

        await expect(page).toClick('li[role="tab"]', { text: 'Document' });
        await expect(page).toClick('[aria-label="Publisher Logo"]');

        await expect(page).not.toMatchElement('[aria-label="Add new"]');
      });
    });
  });
});
