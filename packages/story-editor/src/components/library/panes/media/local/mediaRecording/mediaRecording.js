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
import { useFeature } from 'flagged';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import {
  Button as DefaultButton,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
} from '@googleforcreators/design-system';
import { useCallback } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import { focusStyle } from '../../../../../panels/shared/styles';
import Tooltip from '../../../../../tooltip';
import useMediaRecording from '../../../../../mediaRecording/useMediaRecording';
import useFFmpeg from '../../../../../../app/media/utils/useFFmpeg';

const Button = styled(DefaultButton)`
  ${focusStyle};
  margin: 0 10px 0 0;
`;

const Camera = styled(Icons.Camera)`
  width: 24px !important;
  height: 24px !important;
`;

function MediaRecording() {
  const { isInRecordingMode, toggleRecordingMode } = useMediaRecording(
    ({ state: { isInRecordingMode }, actions: { toggleRecordingMode } }) => ({
      isInRecordingMode,
      toggleRecordingMode,
    })
  );

  const enableMediaRecording = useFeature('mediaRecording');
  const { isTranscodingEnabled } = useFFmpeg();

  const onClick = useCallback(() => {
    trackEvent('media_recording_toggled', {
      status: isInRecordingMode ? 'closed' : 'open',
    });
    toggleRecordingMode();
  }, [isInRecordingMode, toggleRecordingMode]);

  if (!enableMediaRecording) {
    return null;
  }

  // Media recording requires video optimization to be enabled,
  // since it's the only reliable way to ensure the recorded video
  // can be played in all browsers.
  // `isTranscodingEnabled` already checks for `hasUploadMediaAction`
  if (!isTranscodingEnabled) {
    return null;
  }

  const label = __('Record Video', 'web-stories');
  return (
    <Tooltip title={label}>
      <Button
        variant={BUTTON_VARIANTS.SQUARE}
        type={BUTTON_TYPES.SECONDARY}
        size={BUTTON_SIZES.SMALL}
        onClick={onClick}
        aria-label={label}
        aria-pressed={isInRecordingMode}
        isToggled={isInRecordingMode}
      >
        <Camera />
      </Button>
    </Tooltip>
  );
}

export default MediaRecording;
