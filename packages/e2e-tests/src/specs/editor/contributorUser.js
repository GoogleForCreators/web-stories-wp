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
import { createNewStory, logOut } from '@web-stories-wp/e2e-test-utils';
/**
 * WordPress dependencies
 */
import { loginUser, switchUserToAdmin } from '@wordpress/e2e-test-utils';
import percySnapshot from '@percy/puppeteer';

describe('Inserting Media from Dialog', () => {
  beforeAll(async () => {
    await logOut();
    await loginUser('contributor', 'password');
  });

  afterAll(async () => {
    await logOut();
    await switchUserToAdmin();
  });

  it('should see permission error dialog as a contributor user', async () => {
    await createNewStory();
    await expect(page).toClick('button', { text: 'Upload' });
    await percySnapshot(page, 'Permission dialog');
    await expect(page).toMatch('Access Restrictions');
  });
});
