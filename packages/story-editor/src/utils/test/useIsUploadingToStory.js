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
import { renderHook } from '@testing-library/react';

/**
 * Internal dependencies
 */
import MediaContext from '../../app/media/context';
import StoryContext from '../../app/story/context';
import useIsUploadingToStory from '../useIsUploadingToStory';

const isCurrentResourceUploading = jest.fn(() => false);
const isCurrentResourceProcessing = jest.fn(() => false);

function render({ pages = [] }) {
  const storyContextValue = {
    state: {
      pages,
    },
  };

  const mediaContextValue = {
    local: {
      state: { isCurrentResourceUploading, isCurrentResourceProcessing },
    },
  };

  const Wrapper = ({ children }) => (
    <StoryContext.Provider value={storyContextValue}>
      <MediaContext.Provider value={mediaContextValue}>
        {children}
      </MediaContext.Provider>
    </StoryContext.Provider>
  );

  return renderHook(() => useIsUploadingToStory(), {
    wrapper: Wrapper,
    initialProps: true,
  });
}

describe('useIsUploadingToStory', () => {
  afterEach(() => {
    isCurrentResourceUploading.mockReset();
    isCurrentResourceProcessing.mockReset();
  });

  it('should return false if there are no elements', () => {
    const pages = [
      {
        elements: [],
      },
      {
        elements: [],
      },
    ];

    const { result } = render({ pages });
    expect(result.current).toBeFalse();
  });

  it('should return false if there are no media elements', () => {
    const pages = [
      {
        elements: [{ id: '123', type: 'text' }],
      },
      {
        elements: [{ id: '789', type: 'text' }],
      },
    ];

    const { result } = render({ pages });
    expect(result.current).toBeFalse();
  });

  it('should return false if there are no elements being uploaded', () => {
    const pages = [
      {
        elements: [
          { id: '123', type: 'video', resource: { type: 'video', id: '1' } },
          { id: '456', type: 'video', resource: { type: 'video', id: '2' } },
        ],
      },
      {
        elements: [
          { id: '789', type: 'video', resource: { type: 'video', id: '3' } },
          { id: '147', type: 'image', resource: { type: 'image', id: '4' } },
        ],
      },
    ];

    isCurrentResourceUploading.mockReturnValue(false);
    isCurrentResourceProcessing.mockReturnValue(false);

    const { result } = render({ pages });
    expect(result.current).toBeFalse();
  });

  it('should return true if resources are being uploaded', () => {
    const pages = [
      {
        elements: [
          {
            id: '123',
            type: 'video',
            resource: { type: 'video', id: 'uploadingId' },
          },
          { id: '456', type: 'video', resource: { type: 'video', id: '2' } },
        ],
      },
      {
        elements: [
          { id: '789', type: 'video', resource: { type: 'video', id: '3' } },
          { id: '147', type: 'image', resource: { type: 'image', id: '4' } },
        ],
      },
    ];

    isCurrentResourceUploading.mockImplementation(
      (resourceId) => 'uploadingId' === resourceId
    );

    const { result } = render({ pages });
    expect(result.current).toBeTrue();
  });

  it('should return true if resources are being processed', () => {
    const pages = [
      {
        elements: [
          { id: '123', type: 'video', resource: { type: 'video', id: '1' } },
          { id: '456', type: 'video', resource: { type: 'video', id: '2' } },
        ],
      },
      {
        elements: [
          {
            id: '789',
            type: 'video',
            resource: { type: 'video', id: 'processingId' },
          },
          { id: '147', type: 'image', resource: { type: 'image', id: '4' } },
        ],
      },
    ];

    isCurrentResourceProcessing.mockImplementation(
      (resourceId) => 'processingId' === resourceId
    );

    const { result } = render({ pages });
    expect(result.current).toBeTrue();
  });
});
