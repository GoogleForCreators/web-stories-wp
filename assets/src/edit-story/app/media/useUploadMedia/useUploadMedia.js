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
import { useUploader } from '../../uploader';
import { useAPI } from '../../api';
import {
  getResourceFromLocalFile,
  getResourceFromUploadAPI,
} from '../../../app/media/utils';

function useUploadMedia({
  media,
  pagingNum,
  searchTerm,
  fetchMediaStart,
  setMedia,
  fetchMediaError,
}) {
  const { uploadFile } = useUploader();
  const {
    actions: { getMedia },
  } = useAPI();

  const resetMedia = useCallback(
    ({ pagingNum: p = 1 } = {}) => {
      fetchMediaStart({ pagingNum: p });
      getMedia({ searchTerm, pagingNum: p })
        .then(({ data }) => {
          setMedia({
            media: data,
          });
        })
        .catch(fetchMediaError);
    },
    [setMedia, fetchMediaError, fetchMediaStart, getMedia, searchTerm]
  );

  const uploadMedia = useCallback(
    (files, { onLocalFile, onUploadedFile, onUploadFailure } = {}) => {
      files.reverse().forEach(async (file) => {
        try {
          let element;
          const resource = await getResourceFromLocalFile(file);

          if (onLocalFile) element = onLocalFile({ resource });

          setMedia({ media: [resource, ...media] });

          try {
            const uploadedFile = await uploadFile(file);

            if (onUploadedFile) {
              onUploadedFile({
                resource: getResourceFromUploadAPI(uploadedFile),
                element,
              });
            }
            resetMedia({ pagingNum });
          } catch (e) {
            if (onUploadFailure) onUploadFailure({ element });

            setMedia({
              media: media.filter(({ id }) => element.resource.id !== id),
            });

            fetchMediaError(e);

            throw new Error(__('Error uploading a file.', 'web-stories'));
          }
        } catch (e) {
          setMedia({ media });

          fetchMediaError(e);

          throw new Error(__('Error trying to upload a file.', 'web-stories'));
        }
      });
    },
    [setMedia, uploadFile, resetMedia, fetchMediaError, media, pagingNum]
  );

  return {
    uploadMedia,
  };
}

export default useUploadMedia;
