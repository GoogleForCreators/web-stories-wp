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
import useUploadVideoFrame from './utils/useUploadVideoFrame';
import useMediaReducer from './useMediaReducer';
import Context from './context';

function MediaProvider({ children }) {
  const { state, actions } = useMediaReducer();
  const { uploadVideoFrame } = useUploadVideoFrame();
  const { mediaType, searchTerm } = state;
  const {
    fetchMediaStart,
    fetchMediaSuccess,
    fetchMediaError,
    resetFilters,
    setMediaType,
    setSearchTerm,
  } = actions;

  const {
    actions: { getMedia },
  } = useAPI();

  const fetchMedia = useCallback(() => {
    fetchMediaStart();
    getMedia({ mediaType, searchTerm })
      .then((media) => {
        fetchMediaSuccess({ media, mediaType, searchTerm });
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

  const context = {
    state,
    actions: {
      ...actions,
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
