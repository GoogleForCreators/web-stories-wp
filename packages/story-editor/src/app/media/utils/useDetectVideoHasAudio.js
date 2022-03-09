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
import {
  hasVideoGotAudio,
  preloadVideo,
  seekVideo,
} from '@googleforcreators/media';

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
        const video = await preloadVideo(src);
        await seekVideo(video);
        const hasAudio = hasVideoGotAudio(video);

        const properties = ({ resource }) => ({
          resource: {
            ...resource,
            isMuted: !hasAudio,
          },
        });
        updateElementsByResourceId({ id, properties });
        updateMediaElement({
          id,
          data: {
            isMuted: !hasAudio,
          },
        });

        await updateMedia(id, {
          isMuted: !hasAudio,
        });
      } catch (error) {
        // Do nothing for now.
      }
    },
    [
      hasUploadMediaAction,
      updateElementsByResourceId,
      updateMediaElement,
      updateMedia,
    ]
  );

  return {
    updateVideoIsMuted,
  };
}

export default useDetectVideoHasAudio;
