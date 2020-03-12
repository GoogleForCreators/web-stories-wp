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
  const { page, mediaType, searchTerm } = state;
  const {
    fetchMediaStart,
    fetchMediaSuccess,
    fetchMediaError,
    resetFilters,
    setMediaType,
    setSearchTerm,
    setPage,
  } = actions;

  const {
    actions: { getMedia },
  } = useAPI();

  const fetchMedia = useCallback(
    ({ page: p = 1 } = {}) => {
      fetchMediaStart({ page: p });
      getMedia({ mediaType, searchTerm, page: p })
        .then(({ data, headers }) => {
          const totalPages = parseInt(headers.get('X-WP-TotalPages'));
          fetchMediaSuccess({
            media: data,
            mediaType,
            searchTerm,
            page: p,
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

  const resetAfterUpload = useCallback(() => {
    resetFilters();
    if (!mediaType && !searchTerm && page === 1) {
      fetchMedia();
    }
  }, [fetchMedia, mediaType, page, resetFilters, searchTerm]);

  useEffect(() => {
    fetchMedia({ page });
  }, [fetchMedia, mediaType, searchTerm, page]);

  const context = {
    state,
    actions: {
      setPage,
      setMediaType,
      setSearchTerm,
      fetchMedia,
      resetFilters,
      resetAfterUpload,
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
