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
import { __ } from '@web-stories-wp/i18n';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import {
  Checkbox,
  Text,
  THEME_CONSTANTS,
  ThemeGlobals,
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '@web-stories-wp/design-system';
import { useFeature } from 'flagged';
import { useCallback, useMemo } from 'react';

/**
 * Internal dependencies
 */
import { Row as DefaultRow } from '../../../form';
import { SimplePanel } from '../../panel';
import { getCommonValue } from '../../shared';
import useFFmpeg from '../../../../app/media/utils/useFFmpeg';
import { useLocalMedia } from '../../../../app';

const Row = styled(DefaultRow)`
  margin-top: 2px;
`;

const StyledButton = styled(Button)`
  padding: 12px 8px;
`;

const Label = styled.label`
  margin-left: 12px;
`;

const StyledCheckbox = styled(Checkbox)`
  ${({ theme }) => `
    input[type='checkbox']&.${ThemeGlobals.FOCUS_VISIBLE_SELECTOR} ~ div, input[type='checkbox']:focus ~ div {
      box-shadow: 0px 0px 0 2px ${theme.colors.bg.secondary}, 0px 0px 0 4px ${theme.colors.border.focus} !important;
    }
  `}
`;

function VideoOptionsPanel({ selectedElements, pushUpdate }) {
  const isMuteVideoEnabled = useFeature('enableMuteVideo');
  const { isTranscodingEnabled } = useFFmpeg();
  const { muteExistingVideo } = useLocalMedia((state) => ({
    muteExistingVideo: state.actions.muteExistingVideo,
  }));
  const resource = getCommonValue(selectedElements, 'resource');
  const { isMuted, isTranscoding, isMuting, local } = resource;
  const loop = getCommonValue(selectedElements, 'loop');
  const isSingleElement = selectedElements.length === 1;

  const handleHandleMuteVideo = useCallback(() => {
    muteExistingVideo({ resource });
  }, [resource, muteExistingVideo]);

  const canMuted = useMemo(() => {
    return (
      (isMuteVideoEnabled &&
        isTranscodingEnabled &&
        !local &&
        !isMuted &&
        !isTranscoding &&
        isSingleElement) ||
      isMuting
    );
  }, [
    isMuteVideoEnabled,
    isTranscodingEnabled,
    local,
    isMuted,
    isTranscoding,
    isSingleElement,
    isMuting,
  ]);

  const checkboxId = `cb-${uuidv4()}`;
  return (
    <SimplePanel
      name="videoOptions"
      title={__('Video Settings', 'web-stories')}
    >
      {canMuted && (
        <Row>
          <StyledButton
            disabled={isMuting}
            variant={BUTTON_VARIANTS.RECTANGLE}
            type={BUTTON_TYPES.SECONDARY}
            size={BUTTON_SIZES.SMALL}
            onClick={handleHandleMuteVideo}
          >
            {__('Muted video', 'web-stories')}
          </StyledButton>
        </Row>
      )}
      <Row spaceBetween={false}>
        <StyledCheckbox
          id={checkboxId}
          checked={loop}
          onChange={(evt) => pushUpdate({ loop: evt.target.checked }, true)}
        />
        <Label htmlFor={checkboxId}>
          <Text as="span" size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
            {__('Loop', 'web-stories')}
          </Text>
        </Label>
      </Row>
    </SimplePanel>
  );
}

VideoOptionsPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default VideoOptionsPanel;
