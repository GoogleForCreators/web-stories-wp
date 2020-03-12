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

  const { processing, media, mediaType, searchTerm, isMediaLoaded } = state;
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
    processing,
    setProcessing,
    removeProcessing,
    updateMediaElement,
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

  const generatePoster = useCallback(() => {
    const processor = async ({ mimeType, posterId, id, src }) => {
      if (allowedVideoMimeTypes.includes(mimeType) && !posterId) {
        await uploadVideoFrame(id, src);
      }
    };
    if (media) {
      media.forEach(processor);
    }
  }, [media, allowedVideoMimeTypes, uploadVideoFrame]);

  useEffect(generatePoster, [media, mediaType, searchTerm]);

  const context = {
    state,
    actions: {
      setMediaType,
      setSearchTerm,
      fetchMedia,
      resetFilters,
      uploadVideoFrame,
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
