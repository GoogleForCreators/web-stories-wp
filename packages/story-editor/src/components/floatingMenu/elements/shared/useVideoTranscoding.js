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
 * Internal dependencies
 */
import { useLocalMedia } from '../../../../app';
import useVideoTrim from '../../../videoTrim/useVideoTrim';
import useFFmpeg from '../../../../app/media/utils/useFFmpeg';
import useProperties from './useProperties';

function useVideoTranscoding() {
  const { resource } = useProperties(['resource']);
  const { isTranscodingEnabled } = useFFmpeg();
  const {
    muteExistingVideo,
    isResourceTrimming,
    isNewResourceMuting,
    canTranscodeResource,
  } = useLocalMedia(
    ({
      state: { canTranscodeResource, isNewResourceMuting, isResourceTrimming },
      actions: { muteExistingVideo },
    }) => ({
      canTranscodeResource,
      isNewResourceMuting,
      isResourceTrimming,
      muteExistingVideo,
    })
  );

  const { isMuted, id: resourceId = 0 } = resource;
  const isTrimming = isResourceTrimming(resourceId);
  const isMuting = isNewResourceMuting(resourceId);

  const handleMute = () => {
    muteExistingVideo({ resource });
  };

  const shouldDisableVideoActions = !canTranscodeResource(resource);

  const canMute =
    isTranscodingEnabled &&
    ((!isMuted && canTranscodeResource(resource)) || isMuting);

  const { hasTrimMode, toggleTrimMode } = useVideoTrim(
    ({ state: { hasTrimMode }, actions: { toggleTrimMode } }) => ({
      hasTrimMode,
      toggleTrimMode,
    })
  );

  return {
    canTrim: hasTrimMode,
    canMute,
    isTrimming,
    isMuting,
    isDisabled: shouldDisableVideoActions,
    handleMute,
    handleTrim: toggleTrimMode,
  };
}

export default useVideoTranscoding;
