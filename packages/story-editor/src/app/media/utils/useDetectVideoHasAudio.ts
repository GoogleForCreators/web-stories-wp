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
  type ResourceId,
  seekVideo,
} from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { useStory } from '../../story';
import { useConfig } from '../../config';

function useDetectVideoHasAudio({
  updateMediaElement,
}: {
  updateMediaElement: ({
    id,
    data,
  }: {
    id: string | number;
    data: Record<string, unknown>;
  }) => void;
}) {
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
     * @param id Video ID.
     * @param src Video URL.
     */
    async (id: ResourceId, src: string) => {
      try {
        const video = await preloadVideo(src);
        await seekVideo(video);
        const hasAudio = hasVideoGotAudio(video);

        updateElementsByResourceId({
          id,
          properties: ({ resource }) => ({
            resource: {
              ...resource,
              isMuted: !hasAudio,
            },
          }),
        });
        updateMediaElement({
          id,
          data: {
            isMuted: !hasAudio,
          },
        });

        if (hasUploadMediaAction && updateMedia) {
          await updateMedia(id, {
            isMuted: !hasAudio,
          });
        }
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
