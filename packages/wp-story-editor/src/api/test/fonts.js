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
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * External dependencies
 */
import { bindToCallbacks } from '@web-stories-wp/wp-utils';

/**
 * Internal dependencies
 */
import * as apiCallbacks from '..';

jest.mock('@wordpress/api-fetch');

describe('Fonts API Callbacks', () => {
  afterEach(() => {
    apiFetch.mockReset();
  });

  it('should not add include param if not provided', () => {
    const { getFonts } = bindToCallbacks(apiCallbacks, {
      api: { fonts: '/web-stories/v1/fonts/' },
    });

    getFonts({
      service: 'fonts.google.com',
    });

    expect(apiFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        path: expect.not.stringContaining('include[]='),
      })
    );
  });

  it('should include fonts with square bracket notation', () => {
    const { getFonts } = bindToCallbacks(apiCallbacks, {
      api: { fonts: '/web-stories/v1/fonts/' },
    });

    getFonts({
      include: ['Roboto Mono', 'Roboto Serif'].join(','),
    });

    expect(apiFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        path: expect.stringContaining(
          '?include[]=Roboto%20Mono&include[]=Roboto%20Serif'
        ),
      })
    );
  });

  it('should include fonts with square bracket notation after other query params', () => {
    const { getFonts } = bindToCallbacks(apiCallbacks, {
      api: { fonts: '/web-stories/v1/fonts/' },
    });

    getFonts({
      service: 'fonts.google.com',
      include: ['Roboto Mono', 'Roboto Serif'].join(','),
    });

    expect(apiFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        path: expect.stringContaining(
          '&include[]=Roboto%20Mono&include[]=Roboto%20Serif'
        ),
      })
    );
  });
});
