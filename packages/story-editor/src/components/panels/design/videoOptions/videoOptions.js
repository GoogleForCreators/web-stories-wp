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
import PropTypes from 'prop-types';
import { __ } from '@googleforcreators/i18n';
import styled from 'styled-components';
import {
  Text,
  THEME_CONSTANTS,
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  useLiveRegion,
} from '@googleforcreators/design-system';
import { useCallback, useEffect } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import useVideoTrim from '../../../videoTrim/useVideoTrim';
import { Row as DefaultRow } from '../../../form';
import { SimplePanel } from '../../panel';
import { getCommonValue } from '../../shared';
import useFFmpeg from '../../../../app/media/utils/useFFmpeg';
import { useLocalMedia } from '../../../../app';
import CircularProgress from '../../../circularProgress';
import LoopPanelContent from '../../shared/loopPanelContent';

const Row = styled(DefaultRow)`
  margin-top: 2px;
`;

const StyledButton = styled(Button)`
  padding: 12px 8px;
`;

const TrimButton = styled(StyledButton)`
  margin-left: 20px;
`;

const TrimWrapper = styled.div`
  position: relative;
  display: flex;
`;

const Spinner = styled.div`
  margin-left: 4px;
  margin-top: 4px;
`;

const HelperText = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.tertiary};
`;

function VideoOptionsPanel({ selectedElements, pushUpdate }) {
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
  const resource = getCommonValue(selectedElements, 'resource');
  const { isMuted, id: resourceId = 0 } = resource;
  const elementId = getCommonValue(selectedElements, 'id');
  const isTrimming =
    selectedElements.length === 1 ? isElementTrimming(elementId) : false;
  const isMuting = isNewResourceMuting(resourceId);
  const loop = getCommonValue(selectedElements, 'loop');
  const isSingleElement = selectedElements.length === 1;

  const handleMuteVideo = useCallback(() => {
    muteExistingVideo({ resource });
  }, [resource, muteExistingVideo]);

  const shouldDisableVideoActions = !canTranscodeResource(resource);

  const shouldDisplayMuteButton =
    isTranscodingEnabled &&
    isSingleElement &&
    ((!isMuted && canTranscodeResource(resource)) || isMuting);
  const muteButtonText = isMuting
    ? __('Removing audio…', 'web-stories')
    : __('Remove audio', 'web-stories');

  const trimButtonText = isTrimming
    ? __('Trimming…', 'web-stories')
    : __('Trim', 'web-stories');

  const { hasTrimMode, toggleTrimMode } = useVideoTrim(
    ({ state: { hasTrimMode }, actions: { toggleTrimMode } }) => ({
      hasTrimMode,
      toggleTrimMode,
    })
  );

  const speak = useLiveRegion();

  useEffect(() => {
    if (isMuting) {
      speak(muteButtonText);
    }
  }, [isMuting, muteButtonText, speak]);

  useEffect(() => {
    if (isTrimming) {
      speak(trimButtonText);
    }
  }, [isTrimming, trimButtonText, speak]);

  const onChange = (evt) => pushUpdate({ loop: evt.target.checked }, true);

  const Processing = () => {
    return (
      <Spinner>
        <CircularProgress size={24} />
      </Spinner>
    );
  };

  return (
    <SimplePanel
      name="videoOptions"
      title={__('Video Settings', 'web-stories')}
    >
      <Row spaceBetween={false}>
        <LoopPanelContent loop={loop} onChange={onChange} />
        {hasTrimMode && (
          <TrimWrapper>
            <TrimButton
              disabled={shouldDisableVideoActions}
              variant={BUTTON_VARIANTS.RECTANGLE}
              type={BUTTON_TYPES.SECONDARY}
              size={BUTTON_SIZES.SMALL}
              onClick={toggleTrimMode}
            >
              {trimButtonText}
            </TrimButton>
            {isTrimming && <Processing />}
          </TrimWrapper>
        )}
      </Row>
      {shouldDisplayMuteButton && (
        <>
          <Row spaceBetween={false}>
            <StyledButton
              disabled={shouldDisableVideoActions}
              variant={BUTTON_VARIANTS.RECTANGLE}
              type={BUTTON_TYPES.SECONDARY}
              size={BUTTON_SIZES.SMALL}
              onClick={handleMuteVideo}
            >
              {muteButtonText}
            </StyledButton>
            {isMuting && <Processing />}
          </Row>
          <Row>
            <HelperText>
              {__(
                'Removing the audio from this video will upload a new muted version of it to the media library. This might take a couple of seconds.',
                'web-stories'
              )}
            </HelperText>
          </Row>
        </>
      )}
    </SimplePanel>
  );
}

VideoOptionsPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default VideoOptionsPanel;
