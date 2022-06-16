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
import { useEffect, useCallback, useRef } from '@googleforcreators/react';
import { getSmallestUrlForWidth } from '@googleforcreators/media';
import { getTimeTracker } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { useConfig } from '../../config';
import useUploadVideoFrame from '../utils/useUploadVideoFrame';
import useProcessMedia from '../utils/useProcessMedia';
import useUploadMedia from '../useUploadMedia';
import useDetectVideoHasAudio from '../utils/useDetectVideoHasAudio';
import useDetectBaseColor from '../utils/useDetectBaseColor';
import useDetectBlurHash from '../utils/useDetectBlurhash';
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
    setBaseColorProcessing,
    removeBaseColorProcessing,
    setBlurhashProcessing,
    removeBlurhashProcessing,
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
      if (!getMedia) {
        return null;
      }

      fetchMediaStart({ pageToken: p });
      const trackTiming = getTimeTracker('load_media');
      return getMedia({
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

  const {
    uploadMedia,
    isUploading,
    isTranscoding,
    isNewResourceProcessing,
    isCurrentResourceProcessing,
    isNewResourceTranscoding,
    isNewResourceMuting,
    isElementTrimming,
    isCurrentResourceUploading,
    isCurrentResourceTranscoding,
    isCurrentResourceMuting,
    isCurrentResourceTrimming,
    canTranscodeResource,
  } = useUploadMedia({
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

  const { updateBaseColor } = useDetectBaseColor({
    updateMediaElement,
  });

  const { updateBlurHash } = useDetectBlurHash({
    updateMediaElement,
  });

  const {
    allowedMimeTypes: { video: allowedVideoMimeTypes },
    capabilities: { hasUploadMediaAction },
  } = useConfig();

  const stateRef = useRef();
  stateRef.current = reducerState;

  const resetWithFetch = useCallback(() => {
    const { mediaType: currentMediaType } = stateRef.current;

    resetFilters();
    const isFirstPage = !stateRef.current.pageToken;
    if (!currentMediaType && !stateRef.current.searchTerm && isFirstPage) {
      fetchMedia(
        { mediaType: currentMediaType, cacheBust: true },
        fetchMediaSuccess
      );
    }
  }, [fetchMedia, fetchMediaSuccess, resetFilters]);

  useEffect(() => {
    fetchMedia({ searchTerm, pageToken, mediaType }, fetchMediaSuccess);
  }, [fetchMedia, fetchMediaSuccess, mediaType, pageToken, searchTerm]);

  const uploadVideoPoster = useCallback(
    (id, src) => {
      const { posterProcessed, posterProcessing } = stateRef.current;

      (async () => {
        // Simple way to prevent double-uploading.
        if (posterProcessed.includes(id) || posterProcessing.includes(id)) {
          return;
        }
        setPosterProcessing({ id });
        await uploadVideoFrame(id, src);
        removePosterProcessing({ id });
      })();
    },
    [setPosterProcessing, uploadVideoFrame, removePosterProcessing]
  );

  const processVideoAudio = useCallback(
    (id, src) => {
      const { audioProcessed, audioProcessing } = stateRef.current;

      (async () => {
        // Simple way to prevent double-uploading.
        if (audioProcessed.includes(id) || audioProcessing.includes(id)) {
          return;
        }
        setAudioProcessing({ id });
        await updateVideoIsMuted(id, src);
        removeAudioProcessing({ id });
      })();
    },
    [setAudioProcessing, updateVideoIsMuted, removeAudioProcessing]
  );

  const processMediaBaseColor = useCallback(
    (resource) => {
      const { baseColorProcessed, baseColorProcessing } = stateRef.current;
      const { id } = resource;

      (async () => {
        // Simple way to prevent double-uploading.
        if (
          baseColorProcessed.includes(id) ||
          baseColorProcessing.includes(id)
        ) {
          return;
        }
        setBaseColorProcessing({ id });
        await updateBaseColor(resource);
        removeBaseColorProcessing({ id });
      })();
    },
    [setBaseColorProcessing, updateBaseColor, removeBaseColorProcessing]
  );

  const processMediaBlurhash = useCallback(
    (resource) => {
      const { blurHashProcessed, blurHashProcessing } = stateRef.current;
      const { id } = resource;
      (async () => {
        // Simple way to prevent double-uploading.
        if (blurHashProcessed.includes(id) || blurHashProcessing.includes(id)) {
          return;
        }
        setBlurhashProcessing({ id });
        await updateBlurHash({ resource });
        removeBlurhashProcessing({ id });
      })();
    },
    [stateRef, setBlurhashProcessing, updateBlurHash, removeBlurhashProcessing]
  );

  const postProcessingResource = useCallback(
    (resource) => {
      if (!resource) {
        return;
      }

      const {
        type,
        isMuted,
        baseColor,
        src,
        id,
        posterId,
        mimeType,
        poster,
        blurHash,
      } = resource;

      if (!canTranscodeResource(resource)) {
        return;
      }

      if (hasUploadMediaAction) {
        if (
          (allowedVideoMimeTypes.includes(mimeType) || type === 'gif') &&
          !posterId
        ) {
          uploadVideoPoster(id, src);
        }

        if (allowedVideoMimeTypes.includes(mimeType) && isMuted === null) {
          processVideoAudio(id, src);
        }
      }

      const imageSrc =
        type === 'image' ? getSmallestUrlForWidth(0, resource) : poster;
      if (imageSrc && !baseColor) {
        processMediaBaseColor(resource);
      }
      if (imageSrc && !blurHash) {
        processMediaBlurhash(resource);
      }
    },
    [
      canTranscodeResource,
      allowedVideoMimeTypes,
      processMediaBaseColor,
      processMediaBlurhash,
      processVideoAudio,
      uploadVideoPoster,
      hasUploadMediaAction,
    ]
  );

  const { optimizeVideo, optimizeGif, muteExistingVideo, trimExistingVideo } =
    useProcessMedia({
      postProcessingResource,
      uploadMedia,
      updateMedia,
      deleteMediaElement,
    });

  // Whenever media items in the library change,
  // generate missing posters / has audio / base color if needed.
  useEffect(() => {
    media?.forEach((mediaElement) => postProcessingResource(mediaElement));
  }, [media, mediaType, searchTerm, postProcessingResource]);

  const isGeneratingPosterImages = Boolean(
    stateRef.current?.posterProcessing?.length
  );

  return {
    state: {
      ...reducerState,
      isUploading: isUploading || isGeneratingPosterImages,
      isTranscoding,
      isNewResourceProcessing,
      isCurrentResourceProcessing,
      isNewResourceTranscoding,
      isNewResourceMuting,
      isElementTrimming,
      isCurrentResourceUploading,
      isCurrentResourceTranscoding,
      isCurrentResourceMuting,
      isCurrentResourceTrimming,
      canTranscodeResource,
    },
    actions: {
      setNextPage,
      setMediaType,
      setSearchTerm,
      resetFilters,
      uploadMedia,
      resetWithFetch,
      uploadVideoPoster,
      postProcessingResource,
      deleteMediaElement,
      updateMediaElement,
      optimizeVideo,
      optimizeGif,
      muteExistingVideo,
      trimExistingVideo,
    },
  };
}
