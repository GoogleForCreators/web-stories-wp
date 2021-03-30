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
import { renderHook, act } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import useInsertElement from '../useInsertElement';
import useMedia3pApi from '../../../app/media/media3p/api/useMedia3pApi';
import { useLocalMedia, useStory } from '../../../app';

jest.mock('../../../app/media/media3p/api/useMedia3pApi');
jest.mock('../../../app');

const IMAGE_TYPE = 'image';

const PROPS_LOCAL = {
  resource: {
    type: 'image',
    mimeType: 'image/jpeg',
    creationDate: '2020-08-10T03:42:08',
    src: 'http://local_url/wp-content/uploads/2020/08/local_image.jpg',
    width: 1920,
    height: 1080,
    posterId: 0,
    id: 211,
    title: 'local_image',
    alt: 'local_image',
    local: false,
    sizes: {
      full: {
        file: 'local_image.jpg',
        width: 1920,
        height: 1080,
        mime_type: 'image/jpeg',
        source_url:
          'http://wp.local/wp-content/uploads/2020/08/local_image.jpg',
      },
    },
  },
  x: 126,
  y: 512,
  width: 354,
  height: 199,
};

const PROPS_M3P_WITH_ATTRIBUTION = {
  resource: {
    type: 'image',
    mimeType: 'image/jpeg',
    creationDate: '2020-08-14T19:43:09Z',
    src: 'https://images.url.com/photo-fake-url',
    width: 2400,
    height: 3620,
    title: 'Pictures of dogs',
    alt: null,
    local: false,
    sizes: {
      full: {
        file: 'media/provider:TZ2tVEJx2aA',
        source_url: 'https://source_url.com',
        mime_type: 'image/jpeg',
        width: 2400,
        height: 3620,
      },
    },
    attribution: {
      author: {
        displayName: 'Photographer Name',
        url: 'https://author.url',
      },
      registerUsageUrl: 'https://registerUsageUrl.com/register',
    },
  },
  x: 28,
  y: 401,
  width: 233,
  height: 353,
};

const REGISTER_USAGE_URL = 'https://registerUsageUrl.com/register';

describe('useInsertElement', () => {
  const registerUsage = jest.fn();

  beforeAll(() => {
    useMedia3pApi.mockReturnValue({
      actions: { registerUsage },
    });

    useStory.mockReturnValue({
      addElement: jest.fn(),
    });

    useLocalMedia.mockReturnValue({
      uploadVideoPoster: jest.fn(),
    });
  });

  describe('register usage function', () => {
    beforeEach(() => {
      registerUsage.mockClear();
    });

    it('should be called for external resources with registerUsageUrl', () => {
      const { result } = renderHook(() => useInsertElement());
      act(() => {
        result.current(IMAGE_TYPE, PROPS_M3P_WITH_ATTRIBUTION);
      });

      expect(registerUsage).toHaveBeenCalledWith({
        registerUsageUrl: REGISTER_USAGE_URL,
      });
    });

    it('should not be called for local resources', () => {
      const { result } = renderHook(() => useInsertElement());
      act(() => {
        result.current(IMAGE_TYPE, PROPS_LOCAL);
      });
      expect(registerUsage).not.toHaveBeenCalled();
    });
  });
});
