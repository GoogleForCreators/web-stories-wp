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
 * WordPress dependencies
 */

/**
 * External dependencies
 */
import { renderHook } from '@testing-library/react-hooks';

jest.mock('@wordpress/api-fetch');
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import useAPI from '../useAPI';

jest.mock('../../config/useConfig');
import useConfig from '../../config/useConfig';

// function APIProvider({ children }) {
//   const {
//     api: { stories, media, fonts, link, users },
//   } = useConfig();

describe('apiProvider', () => {
  beforeEach(() => {
    apiFetch.mockReturnValue('hello');
    useConfig.mockReturnValue({
      api: {
        stories: {},
        media: {},
        fonts: {},
        link: {},
        users: {},
      },
    });
  });

  it('should do something', () => {
    const { result } = renderHook(() => useAPI());

    result.current.actions.getMedia();

    expect(true).toBe(false);
  });
});
