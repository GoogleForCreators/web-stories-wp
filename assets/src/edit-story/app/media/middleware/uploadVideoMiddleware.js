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
import { useCallback } from 'react';

/**
 * Internal dependencies
 */
import * as types from '../useMediaReducer/types';
import useConfig from '../../config/useConfig';
import useAPI from '../../api/useAPI';
import { useStory } from '../../story';
import { generatePoster, uploadVideoPoster } from '../mediaProvider';

function useUploadVideoMiddleware({ getActions }) {
  const config = useConfig();
  const {
    actions: { getMedia, uploadMedia: uploadMediaAPI },
  } = useAPI();
  const {
    actions: { updateMedia },
  } = useAPI();
  const { updateElementsByResourceId } = useStory((state) => ({
    updateElementsByResourceId: state.actions.updateElementsByResourceId,
  }));

  return useCallback(
    (state, action, next) =>
      uploadVideoMiddleware(action, next, {
        state: { ...state, config },
        actions: {
          ...getActions(),
          getMedia,
          uploadMediaAPI,
          updateMedia,
          updateElementsByResourceId,
        },
      }),
    [
      getActions,
      config,
      getMedia,
      uploadMediaAPI,
      updateMedia,
      updateElementsByResourceId,
    ]
  );
}

function uploadVideoMiddleware(
  action,
  next,
  {
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
  }
) {
  switch (action.type) {
    case types.TRIGGER_UPLOAD_VIDEO_POSTER:
      uploadVideoPoster({
        id: action.id,
        src: action.src,
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
      });
      break;
    case types.TRIGGER_GENERATE_POSTER:
      generatePoster({
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
      });
      break;
    default:
      break;
  }
  next(action);
}

export default useUploadVideoMiddleware;
