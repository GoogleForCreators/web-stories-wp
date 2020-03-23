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
import { useUploader } from '../../uploader';
import { useAPI } from '../../api';
import {
  getResourceFromLocalFile,
  getResourceFromUploadAPI,
  getResourceFromAttachment,
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

  const uploadMediaFromLibrary = useCallback(
    async (files) => {
      try {
        const localMedia = await Promise.all(
          files.map(getResourceFromLocalFile).reverse()
        );
        const filesUploading = files.map((file) => uploadFile(file));
        setMedia({
          media: [...localMedia, ...media],
        });
        await Promise.all(filesUploading);

        // To avoid race conditions updating media library, a new request is necessary
        resetMedia({ pagingNum });
      } catch (e) {
        setMedia({ media });
        fetchMediaError(e);
      }
    },
    [resetMedia, setMedia, fetchMediaError, uploadFile, media, pagingNum]
  );

  const uploadMediaFromWorkspace = useCallback(
    async (files, { insertElement, updateElementById, deleteElementById }) => {
      try {
        const filesOnCanvas = await Promise.all(
          files
            .map(async (file) => {
              const resource = await getResourceFromLocalFile(file);
              const element = insertElement(resource.type, {
                resource: getResourceFromAttachment(resource),
              });

              return {
                resource,
                element,
                file,
              };
            })
            .reverse()
        );

        setMedia({
          media: [...filesOnCanvas.map(({ resource }) => resource), ...media],
        });

        await Promise.all(
          filesOnCanvas.map(async ({ element, file }) => {
            try {
              const uploadedFile = await uploadFile(file);

              const resource = getResourceFromUploadAPI(uploadedFile);

              updateElementById({
                elementId: element.elementId,
                properties: {
                  resource,
                  type: element.resource.type,
                },
              });

              return resource;
            } catch (e) {
              deleteElementById({ elementId: element.id });
              setMedia({
                media: media.filter(({ id }) => element.resource.id !== id),
              });
              fetchMediaError(e);
              throw new Error('Error uploading a file.');
            }
          })
        );

        // To avoid race conditions updating media library, a new request is necessary
        resetMedia({ pagingNum });
      } catch (e) {
        setMedia({ media });
        fetchMediaError(e);
      }
    },
    [resetMedia, setMedia, fetchMediaError, uploadFile, media, pagingNum]
  );

  return {
    uploadMediaFromLibrary,
    uploadMediaFromWorkspace,
  };
}

export default useUploadMedia;
