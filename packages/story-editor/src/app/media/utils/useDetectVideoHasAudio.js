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
import { useCallback } from '@web-stories-wp/react';
import { hasVideoGotAudio } from '@web-stories-wp/media';
/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { useStory } from '../../story';
import { useConfig } from '../../config';

function useDetectVideoHasAudio({ updateMediaElement }) {
  const {
    actions: { updateMedia },
  } = useAPI();
  const { updateElementsByResourceId } = useStory((state) => ({
    updateElementsByResourceId: state.actions.updateElementsByResourceId,
  }));
  const {
    capabilities: { hasUploadMediaAction },
  } = useConfig();
  const setProperties = useCallback(
    (id, properties) => {
      updateElementsByResourceId({ id, properties });
    },
    [updateElementsByResourceId]
  );

  const updateVideoIsMuted = useCallback(
    /**
     *
     * @param {number} id Video ID.
     * @param {string} src Video URL.
     * @return {Promise<void>}
     */
    async (id, src) => {
      if (!hasUploadMediaAction) {
        return;
      }
      try {
        const hasAudio = await hasVideoGotAudio(src);

        const newState = ({ resource }) => ({
          resource: {
            ...resource,
            isMuted: !hasAudio,
          },
        });
        setProperties(id, newState);
        updateMediaElement({
          id,
          data: {
            isMuted: !hasAudio,
          },
        });

        await updateMedia(id, {
          web_stories_is_muted: !hasAudio,
        });
      } catch (error) {
        // Do nothing for now.
      }
    },
    [setProperties, updateMedia, updateMediaElement, hasUploadMediaAction]
  );

  return {
    updateVideoIsMuted,
  };
}

export default useDetectVideoHasAudio;
