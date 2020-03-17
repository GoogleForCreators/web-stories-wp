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
import { useAPI } from '../api';
import { useConfig } from '../config';
import useUploadVideoFrame from './utils/useUploadVideoFrame';
import useMediaReducer from './useMediaReducer';
import Context from './context';

function MediaProvider({ children }) {
  const { state, actions } = useMediaReducer();

  const { processing, processed, media, mediaType, searchTerm } = state;
  const {
    fetchMediaStart,
    fetchMediaSuccess,
    fetchMediaError,
    resetFilters,
    setMediaType,
    setSearchTerm,
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

  const fetchMedia = useCallback(() => {
    fetchMediaStart();
    getMedia({ mediaType, searchTerm })
      .then((mediaItems) => {
        fetchMediaSuccess({ media: mediaItems, mediaType, searchTerm });
      })
      .catch(fetchMediaError);
  }, [
    fetchMediaError,
    fetchMediaStart,
    fetchMediaSuccess,
    getMedia,
    mediaType,
    searchTerm,
  ]);

  useEffect(fetchMedia, [fetchMedia, mediaType, searchTerm]);

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
      setMediaType,
      setSearchTerm,
      fetchMedia,
      resetFilters,
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
