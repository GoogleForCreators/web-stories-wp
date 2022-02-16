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
import { registerElementType } from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';

/**
 * Internal dependencies
 */
import useInsertElement from '../useInsertElement';
import { ZOOM_SETTING } from '../../../constants';
import { useStory } from '../../../app/story';
import { useLocalMedia } from '../../../app/media';
import { useLayout } from '../../../app/layout';

jest.mock('../../../app/story');
jest.mock('../../../app/media');
jest.mock('../../../app/layout');

const IMAGE_TYPE = 'image';

const PROPS_LOCAL = {
  resource: {
    type: 'image',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    creationDate: '2020-08-10T03:42:08',
    src: 'http://local_url/wp-content/uploads/2020/08/local_image.jpg',
    width: 1920,
    height: 1080,
    posterId: 0,
    id: 211,
    alt: 'local_image',
    sizes: {
      full: {
        file: 'local_image.jpg',
        width: 1920,
        height: 1080,
        mimeType: 'image/jpeg',
        sourceUrl: 'http://wp.local/wp-content/uploads/2020/08/local_image.jpg',
      },
    },
  },
  x: 126,
  y: 512,
  width: 354,
  height: 199,
};

describe('useInsertElement', () => {
  const setZoomSetting = jest.fn();

  beforeAll(() => {
    useStory.mockReturnValue({
      addElement: jest.fn(),
    });

    useLocalMedia.mockReturnValue({
      postProcessingResource: jest.fn(),
      isCurrentResourceUploading: jest.fn(),
    });

    useLayout.mockReturnValue({
      setZoomSetting,
    });

    elementTypes.forEach(registerElementType);
  });

  it('should always invoke setZoomSetting with FIT', () => {
    const { result } = renderHook(() => useInsertElement());
    act(() => {
      result.current(IMAGE_TYPE, PROPS_LOCAL);
    });

    expect(setZoomSetting).toHaveBeenCalledWith(ZOOM_SETTING.FIT);
  });
});
