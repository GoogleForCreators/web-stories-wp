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
import { useEffect, useCallback, useRef } from '@web-stories-wp/react';
import { getTimeTracker } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { useConfig } from '../../config';
import useUploadVideoFrame from '../utils/useUploadVideoFrame';
import useProcessMedia from '../utils/useProcessMedia';
import useUploadMedia from '../useUploadMedia';
import useDetectVideoHasAudio from '../utils/useDetectVideoHasAudio';
import { LOCAL_MEDIA_TYPE_ALL } from './types';

/**
 * @typedef {import('./typedefs').LocalMediaContext} LocalMediaContext
 * @typedef {import('./typedefs').LocalMediaReducerState} LocalMediaReducerState
 * @typedef {import('./typedefs').LocalMediaReducerActions} LocalMediaReducerActions
 */

/**
 * Context fragment provider for local media.
 * This is called from {@link MediaProvider} to provide the media global state.
 *
 * @param {LocalMediaReducerState} reducerState The 'local' fragment of the
 * state returned from `useMediaReducer`
 * @param {LocalMediaReducerActions} reducerActions The 'local' fragment of the
 * actions returned from `useMediaReducer`
 * @return {LocalMediaContext} Context.
 */
export default function useContextValueProvider(reducerState, reducerActions) {
  const { media, pageToken, mediaType, searchTerm } = reducerState;
  const {
    fetchMediaStart,
    fetchMediaSuccess,
    fetchMediaError,
    resetFilters,
    prependMedia,
    setMediaType,
    setSearchTerm,
    setNextPage,
    setAudioProcessing,
    removeAudioProcessing,
    setPosterProcessing,
    removePosterProcessing,
    updateMediaElement,
    deleteMediaElement,
  } = reducerActions;
  const {
    actions: { getMedia, updateMedia },
  } = useAPI();

  const fetchMedia = useCallback(
    (
      {
        searchTerm: currentSearchTerm = '',
        pageToken: p = 1,
        mediaType: currentMediaType,
        cacheBust: cacheBust,
      } = {},
      callback
    ) => {
      fetchMediaStart({ pageToken: p });
      const trackTiming = getTimeTracker('load_media');
      getMedia({
        mediaType:
          currentMediaType === LOCAL_MEDIA_TYPE_ALL ? '' : currentMediaType,
        searchTerm: currentSearchTerm,
        pagingNum: p,
        cacheBust: cacheBust,
      })
        .then(({ data, headers }) => {
          const totalPages = parseInt(headers.totalPages);
          const totalItems = parseInt(headers.totalItems);
          const hasMore = p < totalPages;
          callback({
            media: data,
            mediaType: currentMediaType,
            searchTerm: currentSearchTerm,
            pageToken: p,
            nextPageToken: hasMore ? p + 1 : undefined,
            totalPages,
            totalItems,
          });
        })
        .catch(fetchMediaError)
        .finally(() => {
          trackTiming();
        });
    },
    [fetchMediaError, fetchMediaStart, getMedia]
  );

  const { uploadMedia, isUploading, isTranscoding } = useUploadMedia({
    media,
    prependMedia,
    updateMediaElement,
    deleteMediaElement,
  });
  const { uploadVideoFrame } = useUploadVideoFrame({
    updateMediaElement,
  });

  const { updateVideoIsMuted } = useDetectVideoHasAudio({
    updateMediaElement,
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
      fetchMedia({ mediaType, cacheBust: true }, fetchMediaSuccess);
    }
  }, [fetchMedia, fetchMediaSuccess, resetFilters]);

  useEffect(() => {
    fetchMedia({ searchTerm, pageToken, mediaType }, fetchMediaSuccess);
  }, [fetchMedia, fetchMediaSuccess, mediaType, pageToken, searchTerm]);

  const uploadVideoPoster = useCallback(
    (id, src) => {
      const { posterProcessed, posterProcessing } = stateRef.current;

      const process = async () => {
        // Simple way to prevent double-uploading.
        if (posterProcessed.includes(id) || posterProcessing.includes(id)) {
          return;
        }
        setPosterProcessing({ id });
        await uploadVideoFrame(id, src);
        removePosterProcessing({ id });
      };
      process();
    },
    [setPosterProcessing, uploadVideoFrame, removePosterProcessing]
  );

  const processVideoAudio = useCallback(
    (id, src) => {
      const { audioProcessed, audioProcessing } = stateRef.current;

      const process = async () => {
        // Simple way to prevent double-uploading.
        if (audioProcessed.includes(id) || audioProcessing.includes(id)) {
          return;
        }
        setAudioProcessing({ id });
        await updateVideoIsMuted(id, src);
        removeAudioProcessing({ id });
      };
      process();
    },
    [setAudioProcessing, updateVideoIsMuted, removeAudioProcessing]
  );

  const { optimizeVideo, optimizeGif, muteExistingVideo, trimExistingVideo } =
    useProcessMedia({
      uploadVideoPoster,
      updateVideoIsMuted,
      uploadMedia,
      updateMedia,
      deleteMediaElement,
    });

  const generateMissingPosters = useCallback(
    ({ mimeType, posterId, id, src, local, type }) => {
      if (
        (allowedVideoMimeTypes.includes(mimeType) || type === 'gif') &&
        !local &&
        !posterId &&
        id
      ) {
        uploadVideoPoster(id, src);
      }
    },
    [allowedVideoMimeTypes, uploadVideoPoster]
  );

  const backfillHasAudio = useCallback(
    ({ mimeType, isMuted, id, src, local }) => {
      if (
        allowedVideoMimeTypes.includes(mimeType) &&
        !local &&
        isMuted === null &&
        id
      ) {
        processVideoAudio(id, src);
      }
    },
    [allowedVideoMimeTypes, processVideoAudio]
  );

  // Whenever media items in the library change,
  // generate missing posters if needed.
  useEffect(() => {
    media?.forEach((mediaElement) => generateMissingPosters(mediaElement));
  }, [media, mediaType, searchTerm, generateMissingPosters]);

  useEffect(() => {
    media?.forEach((mediaElement) => backfillHasAudio(mediaElement));
  }, [media, mediaType, searchTerm, backfillHasAudio]);

  const isGeneratingPosterImages = Boolean(
    stateRef.current?.posterProcessing?.length
  );

  return {
    state: {
      ...reducerState,
      isUploading: isUploading || isGeneratingPosterImages,
      isTranscoding,
    },
    actions: {
      setNextPage,
      setMediaType,
      setSearchTerm,
      resetFilters,
      uploadMedia,
      resetWithFetch,
      uploadVideoPoster,
      updateVideoIsMuted,
      deleteMediaElement,
      updateMediaElement,
      optimizeVideo,
      optimizeGif,
      muteExistingVideo,
      trimExistingVideo,
    },
  };
}
