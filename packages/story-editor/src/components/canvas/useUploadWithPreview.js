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
import { useCallback } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import useStory from '../../app/story/useStory';
import { useLocalMedia } from '../../app/media';
import useUpdateElementDimensions from '../../app/media/utils/useUpdateElementDimensions';
import useInsertElement from './useInsertElement';

function useUploadWithPreview() {
  const { uploadMedia, postProcessingResource } = useLocalMedia(
    ({ actions: { uploadMedia, postProcessingResource } }) => ({
      uploadMedia,
      postProcessingResource,
    })
  );
  const insertElement = useInsertElement();
  const { updateElementDimensions } = useUpdateElementDimensions();
  const { deleteElementsByResourceId } = useStory((state) => ({
    deleteElementsByResourceId: state.actions.deleteElementsByResourceId,
  }));

  const onUploadProgress = useCallback(
    ({ id, resource }) => {
      updateElementDimensions({ id, resource });
    },
    [updateElementDimensions]
  );

  const onUploadSuccess = useCallback(
    ({ id, resource }) => {
      updateElementDimensions({ id, resource });
      postProcessingResource(resource);
    },
    [updateElementDimensions, postProcessingResource]
  );

  const onUploadError = useCallback(
    ({ id }) => {
      deleteElementsByResourceId({ id });
    },
    [deleteElementsByResourceId]
  );

  const uploadWithPreview = useCallback(
    (files, insertAsBackground = false, args = {}) => {
      const onUploadStart = ({ resource }) => {
        insertElement(resource.type, { resource }, insertAsBackground);
      };

      uploadMedia(files, {
        onUploadStart,
        onUploadProgress,
        onUploadError,
        onUploadSuccess,
        ...args,
      });
    },
    [
      uploadMedia,
      onUploadProgress,
      onUploadError,
      onUploadSuccess,
      insertElement,
    ]
  );

  return uploadWithPreview;
}

export default useUploadWithPreview;
