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
import useAPI from '../../api/useAPI';
import useConfig from '../../config/useConfig';
import usePreventWindowUnload from '../../../utils/usePreventWindowUnload';
import { uploadMedia } from '../useUploadMedia/useUploadMedia';
import { uploadWithPreview } from '../../../components/canvas/useUploadWithPreview';
import { useSnackbar } from '../../snackbar';
import { useStory } from '../../story';

function useUploadMediaMiddleware({ getActions }) {
  const config = useConfig();
  const {
    actions: { getMedia, uploadMedia: uploadMediaAPI },
  } = useAPI();
  const { addElement, updateElementById, deleteElementById } = useStory(
    (state) => ({
      addElement: state.actions.addElement,
      updateElementById: state.actions.updateElementById,
      deleteElementById: state.actions.deleteElementById,
    })
  );
  const { showSnackbar } = useSnackbar();
  const setPreventUnload = usePreventWindowUnload();

  return useCallback(
    (state, action, next) =>
      uploadMediaMiddleware(action, next, {
        state: {
          ...state,
          config,
        },
        actions: {
          ...getActions(),
          getMedia,
          uploadMediaAPI,
          addElement,
          updateElementById,
          deleteElementById,
          showSnackbar,
          setPreventUnload,
        },
      }),
    [
      getActions,
      config,
      getMedia,
      uploadMediaAPI,
      showSnackbar,
      setPreventUnload,
    ]
  );
}

function uploadMediaMiddleware(
  action,
  next,
  {
    state: { config, media, pagingNum, mediaType, searchTerm },
    actions: {
      setMedia,
      getMedia,
      uploadMediaAPI,
      uploadMedia: uploadMediaAction,
      showSnackbar,
      setPreventUnload,
      resetFilters,
      fetchMediaStart,
      fetchMediaSuccess,
      fetchMediaError,
      addElement,
      updateElementById,
      deleteElementById,
      uploadVideoPoster,
    },
  }
) {
  switch (action.type) {
    case types.TRIGGER_UPLOAD_MEDIA:
      uploadMedia({
        ...action.payload,
        state: { config, media, pagingNum, mediaType, searchTerm },
        actions: {
          setMedia,
          getMedia,
          uploadMediaAPI,
          showSnackbar,
          setPreventUnload,
          resetFilters,
          fetchMediaStart,
          fetchMediaSuccess,
          fetchMediaError,
        },
      });
      break;
    case types.TRIGGER_UPLOAD_WITH_PREVIEW:
      uploadWithPreview({
        ...action.payload,
        actions: {
          uploadMedia: uploadMediaAction,
          uploadVideoPoster,
          addElement,
          updateElementById,
          deleteElementById,
        },
      });
      break;
    default:
      break;
  }
  next(action);
}

export default useUploadMediaMiddleware;
