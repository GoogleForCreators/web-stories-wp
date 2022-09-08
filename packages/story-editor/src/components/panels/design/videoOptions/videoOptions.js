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
  CircularProgress,
  THEME_CONSTANTS,
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  useLiveRegion,
  Slider,
} from '@googleforcreators/design-system';
import { useEffect, useInitializedValue } from '@googleforcreators/react';
import { useFeature } from 'flagged';
import { v4 as uuidv4 } from 'uuid';
/**
 * Internal dependencies
 */
import useVideoElementTranscoding from '../../../../app/media/utils/useVideoElementTranscoding';
import { Row as DefaultRow } from '../../../form';
import { SimplePanel } from '../../panel';
import { getCommonValue } from '../../shared';
import LoopPanelContent from '../../shared/media/loopPanelContent';

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
const StyledSlider = styled(Slider)`
  width: 100%;
`;
const VolumeWrapper = styled.div`
  margin-bottom: 20px;
`;

const HelperText = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.tertiary};
`;

function VideoOptionsPanel({ selectedElements, pushUpdate }) {
  const resource = getCommonValue(selectedElements, 'resource');
  const elementId = getCommonValue(selectedElements, 'id');
  const loop = getCommonValue(selectedElements, 'loop');
  const volume = getCommonValue(selectedElements, 'volume');
  const isSingleElement = selectedElements.length === 1;
  const enableVideoVolume = useFeature('videoVolume');

  const {
    state: { canTrim, canMute, isTrimming, isMuting, isDisabled },
    actions: { handleMute, handleTrim },
  } = useVideoElementTranscoding({ resource, elementId, isSingleElement });

  const muteButtonText = isMuting
    ? __('Removing audio…', 'web-stories')
    : __('Remove audio', 'web-stories');

  const trimButtonText = isTrimming
    ? __('Trimming…', 'web-stories')
    : __('Trim', 'web-stories');

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
  const onChangeVolume = (value) => {
    const newVolume = Math.max(0.1, value / 100);
    pushUpdate({ volume: newVolume  }, true);
  }

  const slideId = useInitializedValue(() => `slide-${uuidv4()}`);

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
        {canTrim && (
          <TrimWrapper>
            <TrimButton
              disabled={isDisabled}
              variant={BUTTON_VARIANTS.RECTANGLE}
              type={BUTTON_TYPES.SECONDARY}
              size={BUTTON_SIZES.SMALL}
              onClick={handleTrim}
            >
              {trimButtonText}
            </TrimButton>
            {isTrimming && <Processing />}
          </TrimWrapper>
        )}
      </Row>
      {canMute && (
        <>
          {enableVideoVolume && (
            <VolumeWrapper>
             <Text
                as="label"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                htmlFor={slideId}
             >
               {__('Volume', 'web-stories')}
             </Text>
             <StyledSlider
                value={volume * 100}
                handleChange={onChangeVolume}
                minorStep={10}
                majorStep={30}
                min={0}
                max={100}
                id={slideId}
                aria-label={__('Volume', 'web-stories')}
              />
            </VolumeWrapper>
          )}
          <Row spaceBetween={false}>
            <StyledButton
              disabled={isDisabled}
              variant={BUTTON_VARIANTS.RECTANGLE}
              type={BUTTON_TYPES.SECONDARY}
              size={BUTTON_SIZES.SMALL}
              onClick={handleMute}
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
