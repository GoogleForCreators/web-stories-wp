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
import { useEffect, useCallback, useRef } from 'react';

/**
 * Internal dependencies
 */
import { useAPI, useConfig } from '../..';
import useUploadVideoFrame from '../utils/useUploadVideoFrame';
import useUploadMedia from '../useUploadMedia';
import { getResourceFromAttachment } from '../utils';

/**
 * Context fragment provider for local media.
 * This is called from {@link MediaProvider} to provide the media global state.
 *
 * @param {Object} reducerState The 'local' fragment of the state returned from
 * `useMediaReducer`
 * @param {Object} reducerActions The 'local' fragment of the actions returned
 * from `useMediaReducer`
 * @return {Object} Context.
 */
export default function useContextValueProvider(reducerState, reducerActions) {
  const {
    processing,
    processed,
    media,
    pageToken,
    mediaType,
    searchTerm,
  } = reducerState;
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
    deleteMediaElement,
  } = reducerActions;
  const {
    actions: { getMedia },
  } = useAPI();

  const fetchMedia = useCallback(
    (
      {
        searchTerm: currentSearchTerm = '',
        pageToken: p = 1,
        mediaType: currentMediaType,
      } = {},
      callback
    ) => {
      fetchMediaStart({ pageToken: p });
      getMedia({
        mediaType: currentMediaType,
        searchTerm: currentSearchTerm,
        pagingNum: p,
      })
        .then(({ data, headers }) => {
          const totalPages = parseInt(headers.get('X-WP-TotalPages'));
          const mediaArray = data.map(getResourceFromAttachment);
          const hasMore = p < totalPages;
          callback({
            media: mediaArray,
            mediaType: currentMediaType,
            searchTerm: currentSearchTerm,
            pageToken: p,
            nextPageToken: hasMore ? p + 1 : undefined,
            totalPages,
          });
        })
        .catch(fetchMediaError);
    },
    [fetchMediaError, fetchMediaStart, getMedia]
  );

  const { uploadMedia, isUploading } = useUploadMedia({ media, setMedia });
  const { uploadVideoFrame } = useUploadVideoFrame({
    updateMediaElement,
    setProcessing,
    removeProcessing,
    processing,
    processed,
  });

  const {
    allowedMimeTypes: { video: allowedVideoMimeTypes },
  } = useConfig();

  const stateRef = useRef();
  stateRef.current = reducerState;

  const resetWithFetch = useCallback(() => {
    // eslint-disable-next-line no-shadow
    const { mediaType, pageToken, searchTerm } = stateRef.current;

    resetFilters();
    const isFirstPage = !pageToken;
    if (!mediaType && !searchTerm && isFirstPage) {
      fetchMedia({ mediaType }, fetchMediaSuccess);
    }
  }, [fetchMedia, fetchMediaSuccess, resetFilters]);

  useEffect(() => {
    fetchMedia({ searchTerm, pageToken, mediaType }, fetchMediaSuccess);
  }, [fetchMedia, fetchMediaSuccess, mediaType, pageToken, searchTerm]);

  const uploadVideoPoster = useCallback(
    (id, src) => {
      // eslint-disable-next-line no-shadow
      const { processed, processing } = stateRef.current;

      const process = async () => {
        if (processed.includes(id) || processing.includes(id)) {
          return;
        }
        setProcessing({ id });
        await uploadVideoFrame(id, src);
        removeProcessing({ id });
      };
      process();
    },
    [setProcessing, uploadVideoFrame, removeProcessing]
  );

  const processor = useCallback(
    ({ mimeType, posterId, id, src, local }) => {
      const process = async () => {
        if (
          allowedVideoMimeTypes.includes(mimeType) &&
          !local &&
          !posterId &&
          id
        ) {
          await uploadVideoPoster(id, src);
        }
      };
      process();
    },
    [allowedVideoMimeTypes, uploadVideoPoster]
  );

  useEffect(() => {
    const looper = async () => {
      await media.reduce((accumulatorPromise, el) => {
        return accumulatorPromise.then(() => el && processor(el));
      }, Promise.resolve());
    };
    if (media) {
      looper();
    }
  }, [media, mediaType, searchTerm, processor]);

  return {
    state: { ...reducerState, isUploading },
    actions: {
      setNextPage,
      setMediaType,
      setSearchTerm,
      resetFilters,
      uploadMedia,
      resetWithFetch,
      uploadVideoPoster,
      deleteMediaElement,
      updateMediaElement,
    },
  };
}
