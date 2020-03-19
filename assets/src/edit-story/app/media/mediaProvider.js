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
import PropTypes from 'prop-types';
import { useEffect, useCallback } from 'react';

/**
 * Internal dependencies
 */
import { useAPI, useConfig } from '../';
import { useUploader } from '../uploader';
import { useStory } from '../story';
import {
  getResourceFromLocalFile,
  getResourceFromUploadAPI,
} from '../../components/library/panes/media/mediaUtils';
import useInsertElement from '../../components/canvas/useInsertElement';
import useUploadVideoFrame from './utils/useUploadVideoFrame';
import useMediaReducer from './useMediaReducer';
import Context from './context';

function MediaProvider({ children }) {
  const { state, actions } = useMediaReducer();
  const { uploadFile } = useUploader();
  const {
    actions: { updateElementById },
  } = useStory();
  const insertElement = useInsertElement();
  const {
    processing,
    processed,
    media,
    pagingNum,
    mediaType,
    searchTerm,
  } = state;
  const {
    fetchMediaStart,
    fetchMediaSuccess,
    setMedia,
    fetchMediaError,
    resetFilters,
    setMediaType,
    setSearchTerm,
    setNextPage,
    setProcessing,
    removeProcessing,
    updateMediaElement,
  } = actions;

  const { uploadVideoFrame } = useUploadVideoFrame({
    updateMediaElement,
    setProcessing,
    removeProcessing,
    processing,
    processed,
  });
  const {
    actions: { getMedia },
  } = useAPI();
  const {
    allowedMimeTypes: { video: allowedVideoMimeTypes },
  } = useConfig();

  const fetchMedia = useCallback(
    ({ pagingNum: p = 1 } = {}) => {
      fetchMediaStart({ pagingNum: p });
      getMedia({ mediaType, searchTerm, pagingNum: p })
        .then(({ data, headers }) => {
          const totalPages = parseInt(headers.get('X-WP-TotalPages'));
          fetchMediaSuccess({
            media: data,
            mediaType,
            searchTerm,
            pagingNum: p,
            totalPages,
          });
        })
        .catch(fetchMediaError);
    },
    [
      fetchMediaError,
      fetchMediaStart,
      fetchMediaSuccess,
      getMedia,
      mediaType,
      searchTerm,
    ]
  );

  const resetMedia = useCallback(
    ({ pagingNum: p = 1 } = {}) => {
      fetchMediaStart({ pagingNum: p });
      getMedia({ mediaType, searchTerm, pagingNum: p })
        .then(({ data }) => {
          setMedia({
            media: data,
          });
        })
        .catch(fetchMediaError);
    },
    [
      setMedia,
      fetchMediaError,
      fetchMediaStart,
      getMedia,
      mediaType,
      searchTerm,
    ]
  );

  const uploadMediaFromLibrary = useCallback(
    async (files) => {
      try {
        const localMedia = await Promise.all(
          files.map(getResourceFromLocalFile).reverse()
        );
        const filesUploading = files.map((file) => uploadFile(file));
        setMedia({
          media: [...localMedia, ...media],
        });
        await Promise.all(filesUploading);

        // To avoid race conditions updating media library, a new request is necessary
        resetMedia({ pagingNum });
      } catch (e) {
        fetchMediaError(e);
      }
    },
    [resetMedia, setMedia, fetchMediaError, uploadFile, media, pagingNum]
  );

  const uploadMediaFromWorkspace = useCallback(
    async (files) => {
      try {
        const filesOnCanvas = await Promise.all(
          files
            .map(async (file) => {
              const resource = await getResourceFromLocalFile(file);
              const element = insertElement(resource.type, { resource });

              return {
                element,
                file,
              };
            })
            .reverse()
        );

        setMedia({
          media: [
            ...filesOnCanvas.map(({ element: { resource } }) => resource),
            ...media,
          ],
        });

        await Promise.all(
          filesOnCanvas.map(async ({ element, file }) => {
            const uploadedFile = await uploadFile(file);
            const resource = getResourceFromUploadAPI(uploadedFile);

            updateElementById({
              elementId: element.elementId,
              properties: {
                resource: {
                  ...resource,
                  poster: resource.poster,
                },
                type: element.resource.type,
              },
            });

            return resource;
          })
        );

        // To avoid race conditions updating media library, a new request is necessary
        resetMedia({ pagingNum });
      } catch (e) {
        fetchMediaError(e);
      }
    },
    [
      resetMedia,
      setMedia,
      fetchMediaError,
      uploadFile,
      insertElement,
      updateElementById,
      media,
      pagingNum,
    ]
  );

  const resetWithFetch = useCallback(() => {
    resetFilters();
    if (!mediaType && !searchTerm && pagingNum === 1) {
      fetchMedia();
    }
  }, [fetchMedia, mediaType, pagingNum, resetFilters, searchTerm]);

  useEffect(() => {
    fetchMedia({ pagingNum });
  }, [fetchMedia, mediaType, pagingNum, searchTerm]);

  const uploadVideoPoster = useCallback(
    (videoId, src, elementId = 0) => {
      const process = async () => {
        if (processed.includes(videoId) || processing.includes(videoId)) {
          return;
        }
        setProcessing({ videoId });
        await uploadVideoFrame(videoId, src, elementId);
        removeProcessing({ videoId });
      };
      process();
    },
    [processed, processing, setProcessing, uploadVideoFrame, removeProcessing]
  );

  const processor = useCallback(
    ({ mimeType, posterId, id, src }) => {
      const process = async () => {
        if (allowedVideoMimeTypes.includes(mimeType) && !posterId) {
          await uploadVideoPoster(id, src);
        }
      };
      process();
    },
    [allowedVideoMimeTypes, uploadVideoPoster]
  );

  const generatePoster = useCallback(() => {
    const looper = async () => {
      await media.reduce((accumulatorPromise, el) => {
        return accumulatorPromise.then(() => processor(el));
      }, Promise.resolve());
    };
    if (media) {
      looper();
    }
  }, [media, processor]);

  useEffect(generatePoster, [media.length, mediaType, searchTerm]);

  const context = {
    state,
    actions: {
      setNextPage,
      setMediaType,
      setSearchTerm,
      fetchMedia,
      resetFilters,
      uploadMediaFromLibrary,
      uploadMediaFromWorkspace,
      resetWithFetch,
      uploadVideoPoster,
    },
  };

  return <Context.Provider value={context}>{children}</Context.Provider>;
}

MediaProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default MediaProvider;
