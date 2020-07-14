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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useLocalMedia, useSnackbar, useStory } from '../../app';
import objectPick from '../../utils/objectPick';
import useInsertElement from './useInsertElement';

function useUploadWithPreview() {
  const { uploadMedia, uploadVideoPoster } = useLocalMedia((state) => ({
    uploadMedia: state.actions.uploadMedia,
    uploadVideoPoster: state.actions.uploadVideoPoster,
  }));
  const insertElement = useInsertElement();
  const { updateElementsByResourceId, deleteElementById } = useStory(
    (state) => ({
      updateElementsByResourceId: state.actions.updateElementsByResourceId,
      deleteElementById: state.actions.deleteElementById,
    })
  );
  const { showSnackbar } = useSnackbar();

  const onLocalFile = useCallback(
    ({ resource }) => {
      const element = insertElement(resource.type, { resource });
      return element;
    },
    [insertElement]
  );

  const onUploadedFile = useCallback(
    async ({ resource, element }) => {
      const blobUrl = element.resource.src;
      const keysToUpdate = objectPick(resource, [
        'src',
        'width',
        'height',
        'length',
        'lengthFormatted',
        'id',
      ]);
      updateElementsByResourceId({
        // We want to update all resources without id (still uploading)
        id: undefined,
        properties: (el) => {
          if (el.resource?.src === blobUrl) {
            const updatedResource = {
              ...el.resource,
              ...keysToUpdate,
            };
            return {
              resource: updatedResource,
            };
          }
          return {};
        },
      });
      if (resource.type === 'video') {
        await uploadVideoPoster(resource.id, resource.src);
      }
    },
    [updateElementsByResourceId, uploadVideoPoster]
  );

  const onUploadFailure = useCallback(
    ({ element }) => {
      deleteElementById({ elementId: element.id });
      showSnackbar({
        message: __('Upload failed, the element was removed', 'web-stories'),
      });
    },
    [deleteElementById, showSnackbar]
  );

  const uploadWithPreview = useCallback(
    (files) => {
      uploadMedia(files, {
        onLocalFile,
        onUploadedFile,
        onUploadFailure,
      });
    },
    [uploadMedia, onLocalFile, onUploadedFile, onUploadFailure]
  );

  return uploadWithPreview;
}

export default useUploadWithPreview;
