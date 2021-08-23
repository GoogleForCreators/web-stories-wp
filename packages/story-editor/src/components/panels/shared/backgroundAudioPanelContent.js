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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  themeHelpers,
} from '@web-stories-wp/design-system';
import { __, sprintf, translateToExclusiveList } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useCallback } from '@web-stories-wp/react';
import { Row } from '../../form';
import AudioPlayer from '../../audioPlayer';
import Tooltip from '../../tooltip';
import { useMediaPicker } from '../../mediaPicker';
import { useConfig } from '../../../app';

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

function BackgroundAudioPanelContent({
  backgroundAudio,
  updateBackgroundAudio,
}) {
  const {
    allowedAudioMimeTypes,
    allowedAudioFileTypes,
    capabilities: { hasUploadMediaAction },
  } = useConfig();

  const onSelectErrorMessage = sprintf(
    /* translators: %s: list of allowed file types. */
    __('Please choose only %s to insert into page.', 'web-stories'),
    translateToExclusiveList(allowedAudioFileTypes)
  );

  const onSelect = useCallback(
    (media) => {
      updateBackgroundAudio({
        src: media.url,
        id: media.id,
        mimeType: media.mime,
      });
    },
    [updateBackgroundAudio]
  );

  const uploadAudioTrack = useMediaPicker({
    onSelect,
    onSelectErrorMessage,
    type: allowedAudioMimeTypes,
    title: __('Upload an audio file', 'web-stories'),
    buttonInsertText: __('Select audio file', 'web-stories'),
  });

  return (
    <>
      {!backgroundAudio?.src && hasUploadMediaAction && (
        <Row expand>
          <UploadButton
            onClick={uploadAudioTrack}
            type={BUTTON_TYPES.SECONDARY}
            size={BUTTON_SIZES.SMALL}
            variant={BUTTON_VARIANTS.RECTANGLE}
          >
            {__('Upload an audio file', 'web-stories')}
          </UploadButton>
        </Row>
      )}
      {backgroundAudio?.src && (
        <Row>
          <AudioPlayer
            title={backgroundAudio?.src.substring(
              backgroundAudio?.src.lastIndexOf('/') + 1
            )}
            src={backgroundAudio?.src}
            mimeType={backgroundAudio?.mimeType}
          />
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
    </>
  );
}

BackgroundAudioPanelContent.propTypes = {
  backgroundAudio: PropTypes.string,
  updateBackgroundAudio: PropTypes.func.isRequired,
};

export default BackgroundAudioPanelContent;
