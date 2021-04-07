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
import { useStory, useAPI } from '../../';
import getFileFromUrl from './getFileFromUrl';

function useProcessVideo({ uploadMedia, uploadVideoPoster }) {
  const { updateElementsByResourceId } = useStory((state) => ({
    updateElementsByResourceId: state.actions.updateElementsByResourceId,
  }));

  const {
    actions: { updateMedia },
  } = useAPI();

  const updateElement = useCallback(
    ({ oldResource, resource }) => {
      const { id: oldId, alt, title } = oldResource;
      updateElementsByResourceId({
        id: oldId,
        properties: () => {
          return {
            type: resource.type,
            resource: {
              ...resource,
              alt,
              title,
            },
          };
        },
      });
    },
    [updateElementsByResourceId]
  );

  const updateOldVideo = useCallback(
    async (oldId, newId) => {
      await updateMedia(oldId, {
        meta: {
          web_stories_transcoded_id: newId,
        },
      });
    },
    [updateMedia]
  );

  const regenerateVideo = useCallback(
    ({ resource: oldResource }) => {
      const { src: url, mimeType } = oldResource;
      const onUploadSuccess = ({ resource }) => {
        updateElement({ oldResource, resource });
        updateOldVideo(oldResource.id, resource.id);

        if (resource.type === 'video' && !resource.local) {
          uploadVideoPoster(resource.id, resource.src);
        }
      };

      const process = async () => {
        const file = await getFileFromUrl(url, mimeType);
        uploadMedia([file], {
          onUploadSuccess,
          additionalData: { alt: oldResource.alt, title: oldResource.title },
        });
      };
      process();
    },
    [updateElement, uploadMedia, uploadVideoPoster, updateOldVideo]
  );

  return {
    regenerateVideo,
  };
}

export default useProcessVideo;
