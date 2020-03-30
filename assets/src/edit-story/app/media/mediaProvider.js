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

import useUploadVideoFrame from './utils/useUploadVideoFrame';
import useMediaReducer from './useMediaReducer';
import useUploadMedia from './useUploadMedia';
import Context from './context';

function MediaProvider({ children }) {
  const { state, actions } = useMediaReducer();
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
    fetchMediaError,
    resetFilters,
    setMedia,
    setMediaType,
    setSearchTerm,
    setNextPage,
    setProcessing,
    removeProcessing,
    updateMediaElement,
  } = actions;
  const fetchMedia = useCallback(
    ({ pagingNum: p = 1, mediaType: currentMediaType } = {}, callback) => {
      fetchMediaStart({ pagingNum: p });
      getMedia({ mediaType: currentMediaType, searchTerm, pagingNum: p })
        .then(({ data, headers }) => {
          const totalPages = parseInt(headers.get('X-WP-TotalPages'));
          callback({
            media: data,
            mediaType: currentMediaType,
            searchTerm,
            pagingNum: p,
            totalPages,
          });
        })
        .catch(fetchMediaError);
    },
    [fetchMediaError, fetchMediaStart, getMedia, searchTerm]
  );
  const { uploadMedia, isUploading } = useUploadMedia({
    media,
    pagingNum,
    setMedia,
    fetchMedia,
  });
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

  const resetWithFetch = useCallback(() => {
    resetFilters();
    if (!mediaType && !searchTerm && pagingNum === 1) {
      fetchMedia({ mediaType }, fetchMediaSuccess);
    }
  }, [
    fetchMedia,
    fetchMediaSuccess,
    mediaType,
    pagingNum,
    resetFilters,
    searchTerm,
  ]);

  useEffect(() => {
    fetchMedia({ pagingNum, mediaType }, fetchMediaSuccess);
  }, [fetchMedia, fetchMediaSuccess, mediaType, pagingNum, searchTerm]);

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
    ({ mimeType, posterId, id, src, videoId }) => {
      const process = async () => {
        if (allowedVideoMimeTypes.includes(mimeType) && !posterId && videoId) {
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
    state: { ...state, isUploading },
    actions: {
      setNextPage,
      setMediaType,
      setSearchTerm,
      fetchMedia,
      resetFilters,
      uploadMedia,
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
