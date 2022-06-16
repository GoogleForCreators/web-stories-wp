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
import { act, renderHook, waitFor } from '@testing-library/react';

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
jest.mock('@googleforcreators/media', () => {
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
const getMutedMediaById = jest.fn();

function setup() {
  const apiContextValue = {
    actions: {
      getOptimizedMediaById,
      getMutedMediaById,
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
  const updateBaseColor = jest.fn();
  const updateMedia = jest.fn();
  const deleteMediaElement = jest.fn();
  const updateVideoIsMuted = jest.fn();

  const postProcessingResource = (resource) => {
    const { isExternal, type, isMuted, baseColor, src, id, posterId } =
      resource;

    if (isExternal) {
      return;
    }
    if (id && src && ['video', 'gif'].includes(type) && !posterId) {
      uploadVideoPoster(id, src);
    }
    if (id && src && 'video' === type && isMuted === null) {
      updateVideoIsMuted(id, src);
    }

    if (!baseColor) {
      updateBaseColor(resource);
    }
  };

  const { result } = renderHook(
    () =>
      useProcessMedia({
        uploadMedia,
        postProcessingResource,
        updateMedia,
        deleteMediaElement,
      }),
    { wrapper }
  );

  const { optimizeVideo, optimizeGif, muteExistingVideo } = result.current;
  return {
    optimizeVideo,
    optimizeGif,
    muteExistingVideo,
    uploadVideoPoster,
    updateBaseColor,
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

      const { optimizeVideo, uploadVideoPoster, updateBaseColor, updateMedia } =
        setup();
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
      });

      expect(uploadVideoPoster).not.toHaveBeenCalled();
      expect(updateBaseColor).not.toHaveBeenCalled();
      expect(updateMedia).not.toHaveBeenCalled();
    });

    it('should process video file', async () => {
      const { optimizeVideo, uploadVideoPoster, updateBaseColor, updateMedia } =
        setup();
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
      });

      expect(updateBaseColor).toHaveBeenCalledWith({
        id: 2,
        src: 'http://www.google.com/foo.gif',
        type: 'gif',
      });
      expect(updateMedia).toHaveBeenCalledWith(123, {
        mediaSource: 'source-video',
        optimizedId: 2,
      });
      expect(updateMedia).toHaveBeenCalledWith(123, {
        mediaSource: 'source-video',
        optimizedId: 2,
      });
    });

    it('should process video file with base color', async () => {
      const { optimizeVideo, uploadVideoPoster, updateBaseColor, updateMedia } =
        setup();
      act(() => {
        optimizeVideo({
          resource: {
            src: 'http://www.google.com/foo.mov',
            id: 123,
            mimeType: 'video/quicktime',
            baseColor: '#000000',
          },
        });
      });

      await waitFor(() => {
        expect(uploadVideoPoster).toHaveBeenCalledWith(
          2,
          'http://www.google.com/foo.gif'
        );
      });

      expect(updateBaseColor).toHaveBeenCalledWith({
        baseColor: undefined,
        id: 2,
        src: 'http://www.google.com/foo.gif',
        type: 'gif',
      });
      expect(updateMedia).toHaveBeenCalledWith(123, {
        mediaSource: 'source-video',
        optimizedId: 2,
      });
    });

    it('should fail video processing gracefully', async () => {
      const {
        optimizeVideo,
        uploadVideoPoster,
        updateMedia,
        updateBaseColor,
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
      });

      expect(updateBaseColor).not.toHaveBeenCalled();
      expect(updateMedia).not.toHaveBeenCalled();
      expect(deleteMediaElement).not.toHaveBeenCalled();
    });
  });

  describe('muteExistingVideo', () => {
    it('should reuse already existing muted video', async () => {
      getMutedMediaById.mockImplementationOnce(() => ({
        id: 456,
        src: 'http://www.google.com/foo-optimized.mp4',
      }));

      const {
        muteExistingVideo,
        uploadVideoPoster,
        updateMedia,
        updateBaseColor,
      } = setup();
      act(() => {
        muteExistingVideo({
          resource: {
            src: 'http://www.google.com/foo.mov',
            id: 123,
            mimeType: 'video/quicktime',
          },
        });
      });
      await waitFor(() => {
        expect(getMutedMediaById).toHaveBeenCalledWith(123);
      });

      expect(uploadVideoPoster).not.toHaveBeenCalled();
      expect(updateBaseColor).not.toHaveBeenCalled();
      expect(updateMedia).not.toHaveBeenCalled();
    });

    it('should mute video file', async () => {
      const {
        muteExistingVideo,
        uploadVideoPoster,
        updateBaseColor,
        updateMedia,
      } = setup();
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
      });
      expect(updateBaseColor).toHaveBeenCalledWith({
        src: 'http://www.google.com/foo.gif',
        id: 2,
        type: 'gif',
      });
      expect(updateMedia).toHaveBeenCalledWith(123, {
        mutedId: 2,
      });
    });

    it('should mute video file with base color', async () => {
      const { muteExistingVideo, uploadVideoPoster, updateMedia } = setup();
      act(() => {
        muteExistingVideo({
          resource: {
            src: 'http://www.google.com/foo.mp4',
            id: 123,
            mimeType: 'video/mp4',
            baseColor: '#000000',
          },
        });
      });
      await waitFor(() => {
        expect(uploadVideoPoster).toHaveBeenCalledWith(
          2,
          'http://www.google.com/foo.gif'
        );
      });
      expect(updateMedia).toHaveBeenCalledWith(123, {
        mutedId: 2,
      });
    });

    it('should mute video file with empty poster', async () => {
      const {
        muteExistingVideo,
        uploadVideoPoster,
        updateMedia,
        updateBaseColor,
      } = setup();
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
        expect(updateBaseColor).toHaveBeenCalledWith({
          id: 2,
          src: 'http://www.google.com/foo.gif',
          type: 'gif',
        });
      });

      expect(uploadVideoPoster).toHaveBeenCalledWith(
        2,
        'http://www.google.com/foo.gif'
      );
      expect(updateMedia).toHaveBeenCalledWith(123, {
        mutedId: 2,
      });
    });

    it('should fail video muting gracefully', async () => {
      const {
        muteExistingVideo,
        uploadVideoPoster,
        updateBaseColor,
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
      });

      expect(updateBaseColor).not.toHaveBeenCalled();
      expect(updateMedia).not.toHaveBeenCalled();
      expect(deleteMediaElement).not.toHaveBeenCalled();
    });
  });

  describe('optimizeGif', () => {
    it('should process gif file', async () => {
      const { optimizeGif, uploadVideoPoster, updateBaseColor, updateMedia } =
        setup();
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
      });

      expect(updateBaseColor).toHaveBeenCalledWith({
        src: 'http://www.google.com/foo.gif',
        id: 2,
        type: 'gif',
      });

      expect(updateMedia).toHaveBeenCalledWith(123, {
        mediaSource: 'source-image',
        optimizedId: 2,
      });
    });

    it('should process gif file with base color', async () => {
      const { optimizeGif, uploadVideoPoster, updateBaseColor, updateMedia } =
        setup();
      act(() => {
        optimizeGif({
          resource: {
            src: 'http://www.google.com/foo.gif',
            id: 123,
            mimeType: 'image/gif',
            baseColor: '#000000',
          },
        });
      });
      await waitFor(() => {
        expect(uploadVideoPoster).toHaveBeenCalledWith(
          2,
          'http://www.google.com/foo.gif'
        );
      });

      expect(updateBaseColor).toHaveBeenCalledWith({
        baseColor: undefined,
        id: 2,
        src: 'http://www.google.com/foo.gif',
        type: 'gif',
      });

      expect(updateMedia).toHaveBeenCalledWith(123, {
        mediaSource: 'source-image',
        optimizedId: 2,
      });
    });

    it('should fail gif processing gracefully', async () => {
      const {
        optimizeGif,
        uploadVideoPoster,
        updateBaseColor,
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
      });

      expect(updateBaseColor).not.toHaveBeenCalled();
      expect(updateMedia).not.toHaveBeenCalled();
      expect(deleteMediaElement).not.toHaveBeenCalled();
    });
  });
});
