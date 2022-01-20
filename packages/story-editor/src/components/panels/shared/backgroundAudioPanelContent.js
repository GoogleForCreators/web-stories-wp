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
} from '@googleforcreators/design-system';
import { __, sprintf, translateToExclusiveList } from '@googleforcreators/i18n';
import { useCallback } from '@web-stories-wp/react';
import { ResourcePropTypes } from '@googleforcreators/media';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { Row } from '../../form';
import AudioPlayer from '../../audioPlayer';
import Tooltip from '../../tooltip';
import { useConfig } from '../../../app';
import { BackgroundAudioPropType } from '../../../types';
import CaptionsPanelContent from './captionsPanelContent';

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
  tracks,
  updateBackgroundAudio,
  updateTracks,
  supportsCaptions = false,
}) {
  const {
    allowedAudioMimeTypes,
    allowedAudioFileTypes,
    capabilities: { hasUploadMediaAction },
    MediaUpload,
  } = useConfig();

  const onSelectErrorMessage = sprintf(
    /* translators: %s: list of allowed file types. */
    __('Please choose only %s to insert into page.', 'web-stories'),
    translateToExclusiveList(allowedAudioFileTypes)
  );

  const onSelect = useCallback(
    (media) => {
      updateBackgroundAudio({
        src: media.src,
        id: media.id,
        mimeType: media.mimeType,
      });
      if (supportsCaptions) {
        updateTracks([]);
      }
    },
    [supportsCaptions, updateTracks, updateBackgroundAudio]
  );

  const handleRemoveTrack = useCallback(
    (idToDelete) => {
      let newTracks = [];
      if (idToDelete) {
        const trackIndex = tracks.findIndex(({ id }) => id === idToDelete);
        newTracks = [
          ...tracks.slice(0, trackIndex),
          ...tracks.slice(trackIndex + 1),
        ];
      }
      updateTracks(newTracks);
    },
    [tracks, updateTracks]
  );

  const handleChangeTrack = useCallback(
    ({ src = '', id }) => {
      const newTracks = {
        track: src,
        trackId: id,
        trackName: src.split('/').pop(),
        id: uuidv4(),
        kind: 'captions',
        srclang: '',
        label: '',
      };
      updateTracks([...tracks, newTracks]);
    },
    [tracks, updateTracks]
  );

  const renderUploadButton = useCallback(
    (open) => (
      <UploadButton
        onClick={open}
        type={BUTTON_TYPES.SECONDARY}
        size={BUTTON_SIZES.SMALL}
        variant={BUTTON_VARIANTS.RECTANGLE}
      >
        {__('Upload an audio file', 'web-stories')}
      </UploadButton>
    ),
    []
  );

  const captionText = __('Upload audio captions', 'web-stories');

  const renderUploadCaptionButton = useCallback(
    (open) => (
      <UploadButton
        onClick={open}
        type={BUTTON_TYPES.SECONDARY}
        size={BUTTON_SIZES.SMALL}
        variant={BUTTON_VARIANTS.RECTANGLE}
      >
        {captionText}
      </UploadButton>
    ),
    [captionText]
  );

  return (
    <>
      {!backgroundAudio?.src && hasUploadMediaAction && (
        <Row expand>
          <MediaUpload
            onSelect={onSelect}
            onSelectErrorMessage={onSelectErrorMessage}
            type={allowedAudioMimeTypes}
            title={__('Upload an audio file', 'web-stories')}
            buttonInsertText={__('Select audio file', 'web-stories')}
            render={renderUploadButton}
          />
        </Row>
      )}
      {backgroundAudio?.src && (
        <>
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
          {supportsCaptions && (
            <CaptionsPanelContent
              captionText={captionText}
              tracks={tracks || []}
              handleChangeTrack={handleChangeTrack}
              handleRemoveTrack={handleRemoveTrack}
              renderUploadButton={renderUploadCaptionButton}
            />
          )}
        </>
      )}
    </>
  );
}

BackgroundAudioPanelContent.propTypes = {
  backgroundAudio: BackgroundAudioPropType,
  tracks: PropTypes.arrayOf(ResourcePropTypes.trackResource),
  updateBackgroundAudio: PropTypes.func.isRequired,
  updateTracks: PropTypes.func,
  supportsCaptions: PropTypes.bool,
};

export default BackgroundAudioPanelContent;
