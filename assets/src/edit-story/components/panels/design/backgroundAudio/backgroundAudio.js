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
import { useCallback } from 'react';
import { __, sprintf, translateToExclusiveList } from '@web-stories-wp/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  Text,
  THEME_CONSTANTS,
  themeHelpers,
} from '@web-stories-wp/design-system';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useConfig, useStory } from '../../../../app';
import { Row } from '../../../form';
import { SimplePanel } from '../../panel';
import { useMediaPicker } from '../../../mediaPicker';
import Tooltip from '../../../tooltip';
import AudioPlayer from '../../../audioPlayer';

const HelperText = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

const InputRow = styled.div`
  display: flex;
  flex-grow: 1;
  margin-right: 8px;
`;

const StyledButton = styled(Button)`
  ${({ theme }) =>
    themeHelpers.focusableOutlineCSS(
      theme.colors.border.focus,
      theme.colors.bg.secondary
    )};
`;

const UploadButton = styled(StyledButton)`
  padding: 12px 8px;
`;

function BackgroundAudioPanel() {
  const {
    allowedAudioMimeTypes,
    allowedAudioFileTypes,
    capabilities: { hasUploadMediaAction },
  } = useConfig();

  const { backgroundAudio, updateCurrentPageProperties } = useStory(
    (state) => ({
      updateCurrentPageProperties: state.actions.updateCurrentPageProperties,
      backgroundAudio: state.state.currentPage?.backgroundAudio,
    })
  );

  const updateBackgroundAudio = useCallback(
    (media) => {
      updateCurrentPageProperties({
        properties: { backgroundAudio: media?.url },
      });
    },
    [updateCurrentPageProperties]
  );

  const onSelectErrorMessage = sprintf(
    /* translators: %s: list of allowed file types. */
    __('Please choose only %s to insert into page.', 'web-stories'),
    translateToExclusiveList(allowedAudioFileTypes)
  );

  const uploadAudioTrack = useMediaPicker({
    onSelect: updateBackgroundAudio,
    onSelectErrorMessage,
    type: allowedAudioMimeTypes,
    title: __('Upload an audio file', 'web-stories'),
    buttonInsertText: __('Select audio file', 'web-stories'),
  });

  if (!hasUploadMediaAction) {
    return null;
  }

  return (
    <SimplePanel
      name="backgroundAudio"
      title={__('Background Audio', 'web-stories')}
    >
      <Row>
        <HelperText>
          {__(
            'Select an audio file that plays while this page is in view.',
            'web-stories'
          )}
        </HelperText>
      </Row>
      {!backgroundAudio && (
        <Row expand>
          <UploadButton
            onClick={uploadAudioTrack}
            type={BUTTON_TYPES.SECONDARY}
            size={BUTTON_SIZES.SMALL}
            variant={BUTTON_VARIANTS.RECTANGLE}
          >
            {__('Upload a file', 'web-stories')}
          </UploadButton>
        </Row>
      )}
      {backgroundAudio && (
        <Row>
          <InputRow>
            <AudioPlayer
              title={backgroundAudio.substring(
                backgroundAudio.lastIndexOf('/') + 1
              )}
              src={backgroundAudio}
            />
          </InputRow>
          <Tooltip hasTail title={__('Remove file', 'web-stories')}>
            <StyledButton
              aria-label={__('Remove file', 'web-stories')}
              type={BUTTON_TYPES.TERTIARY}
              size={BUTTON_SIZES.SMALL}
              variant={BUTTON_VARIANTS.SQUARE}
              onClick={() => updateBackgroundAudio(null)}
            >
              <Icons.Trash />
            </StyledButton>
          </Tooltip>
        </Row>
      )}
    </SimplePanel>
  );
}

export default BackgroundAudioPanel;
