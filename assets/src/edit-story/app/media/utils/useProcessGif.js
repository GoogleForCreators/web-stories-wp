/*
 * Copyright 2021 Google LLC
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
import fetchRemoteFile from './fetchRemoteFile';
import isAnimatedGif from './isAnimatedGif';
import useExistingData from './useExistingData';
import useUpdateElementDimensions from './useUpdateElementDimensions';

function useProcessGif({
  uploadMedia,
  uploadVideoPoster,
  updateMedia,
  deleteMediaElement,
}) {
  const { updateElementDimensions } = useUpdateElementDimensions();
  const { copyResourceData, updateOldObject, updateExistingElements } =
    useExistingData({ updateMedia });

  const optimizeGif = useCallback(
    ({ resource: oldResource }) => {
      const { src: url, mimeType } = oldResource;

      const onUploadSuccess = ({ resource }) => {
        copyResourceData({ oldResource, resource });
        updateOldObject(oldResource.id, resource.id, 'source-image');
        deleteMediaElement({ id: oldResource.id });

        if (resource.type === 'gif' && !resource.local) {
          uploadVideoPoster(resource.id, resource.src);
        }
      };

      const onUploadProgress = ({ resource }) => {
        const oldResourceWithId = { ...resource, id: oldResource.id };
        updateElementDimensions({
          id: oldResource.id,
          resource: oldResourceWithId,
        });
        updateExistingElements({
          oldResource: oldResourceWithId,
        });
      };

      const process = async () => {
        let file = false;
        try {
          file = await fetchRemoteFile(url, mimeType);
        } catch (e) {
          // Ignore for now.
          return;
        }
        const buffer = await file.arrayBuffer();
        if (!isAnimatedGif(buffer)) {
          return;
        }

        await uploadMedia([file], {
          onUploadSuccess,
          onUploadProgress,
          additionalData: { alt: oldResource.alt, title: oldResource.title },
        });
      };
      return process();
    },
    [
      copyResourceData,
      uploadMedia,
      uploadVideoPoster,
      updateOldObject,
      deleteMediaElement,
      updateExistingElements,
      updateElementDimensions,
    ]
  );

  return {
    optimizeGif,
  };
}
export default useProcessGif;
