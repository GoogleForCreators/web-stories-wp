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
import { useEffect, useCallback, useRef, useState } from 'react';

/**
 * Internal dependencies
 */
import { useAPI } from '../';
import useMediaReducer from './useMediaReducer';
import Context from './context';
import { uploadVideoFrame } from './utils/useUploadVideoFrame';
import { getResourceFromAttachment } from './utils';

function fetchMedia(
  {
    state: { pagingNum: p = 1, mediaType: currentMediaType, searchTerm },
    actions: { getMedia, fetchMediaStart, fetchMediaError },
  },
  callback
) {
  fetchMediaStart({ pagingNum: p });
  getMedia({ mediaType: currentMediaType, searchTerm, pagingNum: p })
    .then(({ data, headers }) => {
      const totalPages = parseInt(headers.get('X-WP-TotalPages'));
      const mediaArray = data.map(getResourceFromAttachment);
      callback({
        media: mediaArray,
        mediaType: currentMediaType,
        searchTerm,
        pagingNum: p,
        totalPages,
      });
    })
    .catch(fetchMediaError);
}

export function resetWithFetch({
  state: { mediaType, searchTerm, pagingNum },
  actions: {
    resetFilters,
    getMedia,
    fetchMediaStart,
    fetchMediaSuccess,
    fetchMediaError,
  },
}) {
  resetFilters();
  if (!mediaType && !searchTerm && pagingNum === 1) {
    fetchMedia(
      {
        state: {
          pagingNum,
          mediaType,
          searchTerm,
        },
        actions: {
          getMedia,
          fetchMediaStart,
          fetchMediaSuccess,
          fetchMediaError,
        },
      },
      fetchMediaSuccess
    );
  }
}

async function uploadVideoPoster({
  id,
  src,
  state: { config, pagingNum, mediaType, searchTerm, processed, processing },
  actions: {
    getMedia,
    uploadMediaAPI,
    updateMedia,
    updateElementsByResourceId,
    resetFilters,
    fetchMediaStart,
    fetchMediaSuccess,
    fetchMediaError,
    updateMediaElement,
    setProcessing,
    removeProcessing,
  },
}) {
  if (processed.includes(id) || processing.includes(id)) {
    return;
  }
  setProcessing({ id });
  await uploadVideoFrame({
    id,
    src,
    state: { config, pagingNum, mediaType, searchTerm },
    actions: {
      resetFilters,
      fetchMediaStart,
      fetchMediaSuccess,
      fetchMediaError,
      updateMediaElement,
      getMedia,
      uploadMediaAPI,
      updateMedia,
      updateElementsByResourceId,
    },
  });
  removeProcessing({ id });
}

async function generatePosterProcessor({
  el: { mimeType, posterId, id, src, local },
  state,
  actions,
}) {
  const {
    allowedMimeTypes: { video: allowedVideoMimeTypes },
  } = state.config;

  if (allowedVideoMimeTypes.includes(mimeType) && !local && !posterId && id) {
    await uploadVideoPoster({ id, src, state, actions });
  }
}

function generatePoster({
  state: {
    config,
    media,
    pagingNum,
    mediaType,
    searchTerm,
    processed,
    processing,
  },
  actions: {
    getMedia,
    uploadMediaAPI,
    updateMedia,
    updateMediaElement,
    updateElementsByResourceId,
    resetFilters,
    fetchMediaStart,
    fetchMediaSuccess,
    fetchMediaError,
    setProcessing,
    removeProcessing,
  },
}) {
  const looper = async () => {
    await media.reduce((accumulatorPromise, el) => {
      return accumulatorPromise.then(
        () =>
          el &&
          generatePosterProcessor({
            el,
            state: {
              config,
              pagingNum,
              mediaType,
              searchTerm,
              processed,
              processing,
            },
            actions: {
              getMedia,
              uploadMediaAPI,
              updateMedia,
              updateMediaElement,
              updateElementsByResourceId,
              resetFilters,
              fetchMediaStart,
              fetchMediaSuccess,
              fetchMediaError,
              setProcessing,
              removeProcessing,
            },
          })
      );
    }, Promise.resolve());
  };
  if (media) {
    looper();
  }
}

function MediaProvider({ children }) {
  const uploadMediaRef = useRef();
  const { state, actions } = useMediaReducer({ uploadMediaRef });

  const { media, pagingNum, mediaType, searchTerm } = state;
  const {
    fetchMediaStart,
    fetchMediaSuccess,
    fetchMediaError,
    resetFilters,
    setMediaType,
    setSearchTerm,
    setNextPage,
    uploadMedia: uploadMediaAction,
    uploadWithPreview: uploadWithPreviewAction,
    uploadVideoPoster: uploadVideoPosterAction,
    generatePoster: generatePosterAction,
  } = actions;
  const {
    actions: { getMedia },
  } = useAPI();

  useEffect(() => {
    fetchMedia(
      {
        state: {
          pagingNum,
          mediaType,
          searchTerm,
        },
        actions: {
          getMedia,
          fetchMediaStart,
          fetchMediaSuccess,
          fetchMediaError,
        },
      },
      fetchMediaSuccess
    );
  }, [
    pagingNum,
    mediaType,
    searchTerm,
    getMedia,
    fetchMediaStart,
    fetchMediaSuccess,
    fetchMediaError,
  ]);

  useEffect(generatePosterAction, [media, mediaType, searchTerm]);

  const [isUploading, setIsUploading] = useState();
  const uploadMedia = useCallback(
    (props) => uploadMediaAction({ ...props, setIsUploading }),
    [uploadMediaAction]
  );
  uploadMediaRef.current = uploadMedia;

  const context = {
    state: { ...state, isUploading },
    actions: {
      setNextPage,
      setMediaType,
      setSearchTerm,
      fetchMedia,
      resetFilters,
      uploadMedia,
      uploadVideoPoster: uploadVideoPosterAction,
      uploadWithPreview: uploadWithPreviewAction,
    },
  };

  return <Context.Provider value={context}>{children}</Context.Provider>;
}

MediaProvider.propTypes = {
  children: PropTypes.node,
};

export default MediaProvider;
export { fetchMedia, uploadVideoPoster, generatePoster };
