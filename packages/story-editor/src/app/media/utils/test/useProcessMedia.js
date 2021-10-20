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
import APIContext from '../../../api/context';
import StoryContext from '../../../story/context';
import useProcessMedia from '../useProcessMedia';

const fetchRemoteFileMock = (url, mimeType) => {
  if (url === 'http://www.google.com/foo.mov') {
    return new File(['foo'], 'foo.mov', {
      type: mimeType,
    });
  }

  if (url === 'http://www.google.com/foo.mp4') {
    return new File(['foo'], 'foo.mp4', {
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

const fetchRemoteBlobMock = (url) => {
  if (url === 'http://www.google.com/foo.gif') {
    return {};
  }

  return Promise.reject(new Error('Invalid file'));
};
jest.mock('@web-stories-wp/media', () => {
  return {
    fetchRemoteFile: fetchRemoteFileMock,
    fetchRemoteBlob: fetchRemoteBlobMock,
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

const getOptimizedMediaById = jest.fn();

function setup() {
  const apiContextValue = {
    actions: {
      getOptimizedMediaById,
    },
  };
  const storyContextValue = {
    actions: { updateElementsByResourceId },
  };
  const wrapper = ({ children }) => (
    <APIContext.Provider value={apiContextValue}>
      <StoryContext.Provider value={storyContextValue}>
        {children}
      </StoryContext.Provider>
    </APIContext.Provider>
  );

  const uploadVideoPoster = jest.fn();
  const updateMedia = jest.fn();
  const deleteMediaElement = jest.fn();
  const updateVideoIsMuted = jest.fn();

  const { result } = renderHook(
    () =>
      useProcessMedia({
        uploadMedia,
        uploadVideoPoster,
        updateMedia,
        deleteMediaElement,
        updateVideoIsMuted,
      }),
    { wrapper }
  );

  const { optimizeVideo, optimizeGif, muteExistingVideo } = result.current;
  return {
    optimizeVideo,
    optimizeGif,
    muteExistingVideo,
    uploadVideoPoster,
    updateMedia,
    deleteMediaElement,
  };
}

describe('useProcessMedia', () => {
  describe('optimizeVideo', () => {
    it('should reuse already existing optimized video', async () => {
      getOptimizedMediaById.mockImplementationOnce(() => ({
        id: 456,
        src: 'http://www.google.com/foo-optimized.mp4',
      }));

      const { optimizeVideo, uploadVideoPoster, updateMedia } = setup();
      act(() => {
        optimizeVideo({
          resource: {
            src: 'http://www.google.com/foo.mov',
            id: 123,
            mimeType: 'video/quicktime',
          },
        });
      });
      await waitFor(() => {
        expect(getOptimizedMediaById).toHaveBeenCalledWith(123);
        expect(uploadVideoPoster).not.toHaveBeenCalled();
        expect(updateMedia).not.toHaveBeenCalled();
      });
    });

    it('should process video file', async () => {
      const { optimizeVideo, uploadVideoPoster, updateMedia } = setup();
      act(() => {
        optimizeVideo({
          resource: {
            src: 'http://www.google.com/foo.mov',
            id: 123,
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
          web_stories_media_source: 'source-video',
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

  describe('muteExistingVideo', () => {
    it('should mute video file', async () => {
      const { muteExistingVideo, uploadVideoPoster, updateMedia } = setup();
      act(() => {
        muteExistingVideo({
          resource: {
            src: 'http://www.google.com/foo.mp4',
            id: 123,
            mimeType: 'video/mp4',
          },
        });
      });
      await waitFor(() => {
        expect(uploadVideoPoster).toHaveBeenCalledWith(
          2,
          'http://www.google.com/foo.gif'
        );
        expect(updateMedia).toHaveBeenCalledWith(123, {
          meta: {
            web_stories_muted_id: 2,
          },
        });
      });
    });

    it('should mute video file with empty poster', async () => {
      const { muteExistingVideo, uploadVideoPoster, updateMedia } = setup();
      act(() => {
        muteExistingVideo({
          resource: {
            src: 'http://www.google.com/foo.mp4',
            poster: 'http://www.google.com/foo.jpeg',
            id: 123,
            mimeType: 'video/mp4',
          },
        });
      });
      await waitFor(() => {
        expect(uploadVideoPoster).toHaveBeenCalledWith(
          2,
          'http://www.google.com/foo.gif'
        );
        expect(updateMedia).toHaveBeenCalledWith(123, {
          meta: {
            web_stories_muted_id: 2,
          },
        });
      });
    });

    it('should fail video muting gracefully', async () => {
      const {
        muteExistingVideo,
        uploadVideoPoster,
        updateMedia,
        deleteMediaElement,
      } = setup();
      act(() => {
        muteExistingVideo({
          resource: {
            src: 'http://www.google.com/invalid.jpg',
            id: 123,
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

  describe('optimizeGif', () => {
    it('should process gif file', async () => {
      const { optimizeGif, uploadVideoPoster, updateMedia } = setup();
      act(() => {
        optimizeGif({
          resource: {
            src: 'http://www.google.com/foo.gif',
            id: 123,
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
          web_stories_media_source: 'source-image',
          meta: {
            web_stories_optimized_id: 2,
          },
        });
      });
    });

    it('should fail gif processing gracefully', async () => {
      const {
        optimizeGif,
        uploadVideoPoster,
        updateMedia,
        deleteMediaElement,
      } = setup();
      act(() => {
        optimizeGif({
          resource: {
            src: 'http://www.google.com/invalid.jpg',
            id: 123,
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
});
