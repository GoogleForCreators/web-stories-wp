/*
 * Copyright 2022 Google LLC
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
  addCustomFont,
  removeCustomFont,
} from '@web-stories-wp/e2e-test-utils';

/**
 * Internal dependencies
 */
import { addAllowedErrorMessage } from '../../../../config/bootstrap.js';

const OPEN_SANS_CONDENSED_URL = `${process.env.WP_BASE_URL}/wp-content/e2e-assets/OpenSansCondensed-Light.ttf`;

describe('Custom Fonts', () => {
  withExperimentalFeatures(['customFonts']);

  let removeResourceErrorMessage;

  beforeAll(() => {
    // Ignore resource failing to load. This is only present because of the REST API error.
    removeResourceErrorMessage = addAllowedErrorMessage(
      'Failed to load resource'
    );
  });

  afterAll(() => {
    removeResourceErrorMessage();
  });

  afterEach(async () => {
    await removeCustomFont();
  });

  it('should show error on trying add font twice', async () => {
    await addCustomFont(OPEN_SANS_CONDENSED_URL);
    await addCustomFont(OPEN_SANS_CONDENSED_URL);

    await expect(page).toMatch(
      'A font with the name Open Sans Condensed Light already exists.'
    );
  });
});
