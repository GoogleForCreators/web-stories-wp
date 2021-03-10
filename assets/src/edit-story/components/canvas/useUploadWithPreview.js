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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useLocalMedia, useSnackbar, useStory } from '../../app';
import { PAGE_HEIGHT, PAGE_WIDTH } from '../../constants';
import useInsertElement from './useInsertElement';

function useUploadWithPreview() {
  const { uploadMedia, uploadVideoPoster } = useLocalMedia((state) => ({
    uploadMedia: state.actions.uploadMedia,
    uploadVideoPoster: state.actions.uploadVideoPoster,
  }));
  const insertElement = useInsertElement();
  const { updateElementsByResourceId, deleteElementsByResourceId } = useStory(
    (state) => ({
      updateElementsByResourceId: state.actions.updateElementsByResourceId,
      deleteElementsByResourceId: state.actions.deleteElementsByResourceId,
    })
  );
  const { showSnackbar } = useSnackbar();

  const onUploadStart = useCallback(
    ({ resource }) => {
      insertElement(resource.type, {
        resource,
        x: resource.isPlaceholder ? 0 : undefined,
        y: resource.isPlaceholder ? 0 : undefined,
      });
    },
    [insertElement]
  );

  const updateElement = useCallback(
    ({ id, resource }) => {
      updateElementsByResourceId({
        id,
        properties: (el) => {
          const hasChangedDimensions =
            el.resource.width !== resource.width ||
            el.resource.height !== resource.height;

          if (!hasChangedDimensions) {
            return {
              type: resource.type,
              resource,
            };
          }

          return {
            resource,
            type: resource.type,
            width: resource.width,
            height: resource.height,
            x: PAGE_WIDTH / 2 - resource.width / 2,
            y: PAGE_HEIGHT / 2 - resource.height / 2,
          };
        },
      });
    },
    [updateElementsByResourceId]
  );

  const onUploadProgress = useCallback(
    ({ id, resource }) => {
      updateElement({ id, resource });
    },
    [updateElement]
  );

  const onUploadSuccess = useCallback(
    ({ id, resource }) => {
      updateElement({ id, resource });

      if (resource.type === 'video' && !resource.local) {
        uploadVideoPoster(resource.id, resource.src);
      }
    },
    [updateElement, uploadVideoPoster]
  );

  const onUploadError = useCallback(
    ({ id }) => {
      deleteElementsByResourceId({ id });
      showSnackbar({
        message: __('Upload failed, the element was removed', 'web-stories'),
        dismissable: true,
      });
    },
    [deleteElementsByResourceId, showSnackbar]
  );

  const uploadWithPreview = useCallback(
    (files) => {
      uploadMedia(files, {
        onUploadStart,
        onUploadProgress,
        onUploadError,
        onUploadSuccess,
      });
    },
    [
      uploadMedia,
      onUploadStart,
      onUploadProgress,
      onUploadError,
      onUploadSuccess,
    ]
  );

  return uploadWithPreview;
}

export default useUploadWithPreview;
