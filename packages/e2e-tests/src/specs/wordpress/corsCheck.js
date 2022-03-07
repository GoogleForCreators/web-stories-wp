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
  withExperimentalFeatures,
  createNewStory,
  activatePlugin,
  deactivatePlugin,
  takeSnapshot,
} from '@web-stories-wp/e2e-test-utils';
/**
 * Internal dependencies
 */
import { addAllowedErrorMessage } from '../../config/bootstrap.js';

describe('CORS check', () => {
  withExperimentalFeatures(['enableCORSCheck']);
  let removeCORSErrorMessage;
  let removeResourceErrorMessage;

  beforeAll(async () => {
    await activatePlugin('e2e-tests-cors-error');
    removeCORSErrorMessage = addAllowedErrorMessage(
      'has been blocked by CORS policy'
    );
    removeResourceErrorMessage = addAllowedErrorMessage(
      'Failed to load resource'
    );
  });

  afterAll(async () => {
    await deactivatePlugin('e2e-tests-cors-error');
    removeCORSErrorMessage();
    removeResourceErrorMessage();
  });

  it('should see media dialog', async () => {
    await createNewStory();

    await page.waitForSelector('.ReactModal__Content');

    await expect(page).toMatch('Unable to load media');

    await takeSnapshot(page, 'Stories editor with CORS dialog');
  });
});
