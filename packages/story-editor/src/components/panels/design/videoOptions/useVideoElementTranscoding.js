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
import { useCallback } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useLocalMedia } from '../../../../app';
import useVideoTrim from '../../../videoTrim/useVideoTrim';
import useFFmpeg from '../../../../app/media/utils/useFFmpeg';

function useVideoElementTranscoding({
  resource,
  elementId,
  isSingleElement = true,
}) {
  const { isTranscodingEnabled } = useFFmpeg();
  const {
    muteExistingVideo,
    isElementTrimming,
    isNewResourceMuting,
    canTranscodeResource,
  } = useLocalMedia(
    ({
      state: { canTranscodeResource, isNewResourceMuting, isElementTrimming },
      actions: { muteExistingVideo },
    }) => ({
      canTranscodeResource,
      isNewResourceMuting,
      isElementTrimming,
      muteExistingVideo,
    })
  );
  const { isMuted, id: resourceId = 0 } = resource;
  const isTrimming = isSingleElement ? isElementTrimming(elementId) : false;
  const isMuting = isNewResourceMuting(resourceId);

  const handleMute = useCallback(() => {
    muteExistingVideo({ resource });
  }, [resource, muteExistingVideo]);

  const shouldDisableVideoActions = !canTranscodeResource(resource);

  const canMute =
    isTranscodingEnabled &&
    isSingleElement &&
    ((!isMuted && canTranscodeResource(resource)) || isMuting);

  const { hasTrimMode, toggleTrimMode } = useVideoTrim(
    ({ state: { hasTrimMode }, actions: { toggleTrimMode } }) => ({
      hasTrimMode,
      toggleTrimMode,
    })
  );

  return {
    state: {
      canTrim: hasTrimMode,
      canMute,
      isTrimming,
      isMuting,
      isDisabled: shouldDisableVideoActions,
    },
    actions: {
      handleMute,
      handleTrim: toggleTrimMode,
    },
  };
}

export default useVideoElementTranscoding;
