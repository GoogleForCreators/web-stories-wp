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
import { act, renderHook } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
/**
 * Internal dependencies
 */
import StoryContext from '../../../story/context';
import useProcessMedia from '../useProcessMedia';

const fetchRemoteFileMock = (url, mimeType) => {
  if (url === 'http://www.google.com/foo.mov') {
    return new File(['foo'], 'foo.mov', {
      type: mimeType,
    });
  }

  if (url === 'http://www.google.com/foo.gif') {
    return {
      arrayBuffer: jest.fn(),
    };
  }

  return Promise.reject(new Error('Invalid file'));
};
jest.mock('@web-stories-wp/media', () => {
  return {
    fetchRemoteFile: fetchRemoteFileMock,
    isAnimatedGif: () => {
      return true;
    },
  };
});

const updateElementsByResourceId = jest.fn();
const uploadMedia = (
  files,
  { onUploadSuccess, onUploadStart, onUploadError }
) => {
  const resource = {
    src: 'http://www.google.com/foo.gif',
    id: 2,
    local: false,
    type: 'gif',
  };
  if (onUploadSuccess) {
    onUploadSuccess({ resource });
  }
  if (onUploadStart) {
    onUploadStart({ resource });
  }
  if (onUploadError) {
    onUploadError({ resource });
  }
};

function setup() {
  const storyContextValue = {
    actions: { updateElementsByResourceId },
  };
  const wrapper = ({ children }) => (
    <StoryContext.Provider value={storyContextValue}>
      {children}
    </StoryContext.Provider>
  );

  const uploadVideoPoster = jest.fn();
  const updateMedia = jest.fn();
  const deleteMediaElement = jest.fn();

  const { result } = renderHook(
    () =>
      useProcessMedia({
        uploadMedia,
        uploadVideoPoster,
        updateMedia,
        deleteMediaElement,
      }),
    { wrapper }
  );

  const { optimizeVideo, optimizeGif } = result.current;
  return {
    optimizeVideo,
    optimizeGif,
    uploadVideoPoster,
    updateMedia,
    deleteMediaElement,
  };
}

describe('useProcessMedia', () => {
  it('should process video file', async () => {
    const { optimizeVideo, uploadVideoPoster, updateMedia } = setup();
    act(() => {
      optimizeVideo({
        resource: {
          src: 'http://www.google.com/foo.mov',
          id: 123,
          alt: 'alt',
          title: 'title',
          mimeType: 'video/quicktime',
        },
      });
    });
    await waitFor(() => {
      expect(uploadVideoPoster).toHaveBeenCalledWith(
        2,
        'http://www.google.com/foo.gif'
      );
      expect(updateMedia).toHaveBeenCalledWith(123, {
        media_source: 'source-video',
        meta: {
          web_stories_optimized_id: 2,
        },
      });
    });
  });

  it('should process gif file', async () => {
    const { optimizeGif, uploadVideoPoster, updateMedia } = setup();
    act(() => {
      optimizeGif({
        resource: {
          src: 'http://www.google.com/foo.gif',
          id: 123,
          alt: 'alt',
          title: 'title',
          mimeType: 'image/gif',
        },
      });
    });
    await waitFor(() => {
      expect(uploadVideoPoster).toHaveBeenCalledWith(
        2,
        'http://www.google.com/foo.gif'
      );
      expect(updateMedia).toHaveBeenCalledWith(123, {
        media_source: 'source-image',
        meta: {
          web_stories_optimized_id: 2,
        },
      });
    });
  });

  it('should fail video processing gracefully', async () => {
    const {
      optimizeVideo,
      uploadVideoPoster,
      updateMedia,
      deleteMediaElement,
    } = setup();
    act(() => {
      optimizeVideo({
        resource: {
          src: 'http://www.google.com/invalid.jpg',
          id: 123,
          alt: 'alt',
          title: 'title',
          mimeType: 'image/jpg',
        },
      });
    });
    await waitFor(() => {
      expect(uploadVideoPoster).not.toHaveBeenCalled();
      expect(updateMedia).not.toHaveBeenCalled();
      expect(deleteMediaElement).not.toHaveBeenCalled();
    });
  });

  it('should fail gif processing gracefully', async () => {
    const { optimizeGif, uploadVideoPoster, updateMedia, deleteMediaElement } =
      setup();
    act(() => {
      optimizeGif({
        resource: {
          src: 'http://www.google.com/invalid.jpg',
          id: 123,
          alt: 'alt',
          title: 'title',
          mimeType: 'image/jpg',
        },
      });
    });
    await waitFor(() => {
      expect(uploadVideoPoster).not.toHaveBeenCalled();
      expect(updateMedia).not.toHaveBeenCalled();
      expect(deleteMediaElement).not.toHaveBeenCalled();
    });
  });
});
