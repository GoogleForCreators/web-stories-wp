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
  ButtonSize,
  ButtonType,
  ButtonVariant,
  Text,
  TextSize,
  themeHelpers,
} from '@googleforcreators/design-system';
import { __, sprintf, translateToExclusiveList } from '@googleforcreators/i18n';
import {
  useCallback,
  useMemo,
  useState,
  useRef,
} from '@googleforcreators/react';
import {
  ResourcePropTypes,
  getExtensionsFromMimeType,
  preloadVideo,
  getVideoLength,
  BackgroundAudioPropType,
} from '@googleforcreators/media';
import { v4 as uuidv4 } from 'uuid';
import { trackError, trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../../app/config';
import { Row } from '../../../form';
import useCORSProxy from '../../../../utils/useCORSProxy';
import HotlinkModal from '../../../hotlinkModal';
import { noop } from '../../../../utils/noop';
import CaptionsPanelContent from './captionsPanelContent';
import LoopPanelContent from './loopPanelContent';
import AudioPlayer from './audioPlayer';
import FileRow from './fileRow';

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

const ButtonRow = styled(Row)`
  gap: 12px;
`;

const SectionHeading = styled(Text.Paragraph).attrs({
  size: TextSize.Small,
})`
  font-weight: bold;
  margin-bottom: 12px;
`;
const eventName = 'hotlink_audio';

function BackgroundAudioPanelContent({
  backgroundAudio,
  updateBackgroundAudio,
  showCaptions = false,
  showLoopControl = false,
  audioId,
}) {
  const {
    allowedMimeTypes: { audio: allowedAudioMimeTypes },
    capabilities: { hasUploadMediaAction },
    MediaUpload,
  } = useConfig();
  const [isOpen, setIsOpen] = useState(false);
  const { getProxiedUrl } = useCORSProxy();

  const allowedAudioFileTypes = useMemo(
    () =>
      allowedAudioMimeTypes
        .map((type) => getExtensionsFromMimeType(type))
        .flat(),
    [allowedAudioMimeTypes]
  );
  const { resource = {}, tracks = [], loop = true } = backgroundAudio || {};

  const playerRef = useRef();

  const audioSrcProxied = getProxiedUrl(resource, resource?.src);

  const onSelectErrorMessage = sprintf(
    /* translators: %s: list of allowed file types. */
    __('Please choose only %s to insert into page.', 'web-stories'),
    translateToExclusiveList(allowedAudioFileTypes)
  );

  const onSelect = useCallback(
    /**
     * @param {import('@googleforcreators/media').AudioResource} resource Audio resource.
     */
    ({ src, id, mimeType, needsProxy, length, lengthFormatted }) => {
      const updatedBackgroundAudio = {
        resource: {
          src,
          id,
          mimeType,
          length,
          lengthFormatted,
          needsProxy,
        },
      };

      if (showCaptions) {
        updatedBackgroundAudio.tracks = [];
      }
      if (showLoopControl) {
        updatedBackgroundAudio.loop = true;
      }
      updateBackgroundAudio(updatedBackgroundAudio);
    },
    [showCaptions, showLoopControl, updateBackgroundAudio]
  );

  const onSelectHotlink = useCallback(
    async ({ link, hotlinkInfo, needsProxy }) => {
      const { mimeType } = hotlinkInfo;
      const audioProxied = getProxiedUrl({ needsProxy }, link);
      const videoEl = await preloadVideo(audioProxied);
      const { length, lengthFormatted } = getVideoLength(videoEl);

      onSelect({
        src: link,
        mimeType,
        length,
        lengthFormatted,
        needsProxy,
      });
      setIsOpen(false);
      trackEvent(eventName, {
        event_label: link,
        file_size: hotlinkInfo.fileSize,
        file_type: hotlinkInfo.mimeType,
        needs_proxy: needsProxy,
      });
      setIsOpen(false);
    },
    [getProxiedUrl, onSelect]
  );

  const onError = useCallback((err) => trackError(eventName, err?.message), []);

  const updateTracks = useCallback(
    (newTracks) => {
      updateBackgroundAudio({ ...backgroundAudio, tracks: newTracks });
    },
    [backgroundAudio, updateBackgroundAudio]
  );

  const onChangeLoop = useCallback(
    (evt) => {
      updateBackgroundAudio({ ...backgroundAudio, loop: evt.target.checked });
    },
    [backgroundAudio, updateBackgroundAudio]
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
    ({ src = '', id, needsProxy = false }) => {
      const newTrack = {
        track: src,
        trackId: id,
        id: uuidv4(),
        kind: 'captions',
        srclang: '',
        label: '',
        needsProxy,
      };
      updateTracks([newTrack]);
    },
    [updateTracks]
  );

  const renderUploadButton = useCallback(
    (open) => (
      <UploadButton
        onClick={open}
        type={ButtonType.Secondary}
        size={ButtonSize.Small}
        variant={ButtonVariant.Rectangle}
      >
        {__('Upload an audio file', 'web-stories')}
      </UploadButton>
    ),
    []
  );

  const renderUploadCaptionButton = useCallback(
    (open) => (
      <UploadButton
        onClick={open}
        type={ButtonType.Secondary}
        size={ButtonSize.Small}
        variant={ButtonVariant.Rectangle}
      >
        {__('Upload audio captions', 'web-stories')}
      </UploadButton>
    ),
    []
  );

  const handleRemove = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.pause();
    }
    updateBackgroundAudio(null);
  }, [updateBackgroundAudio, playerRef]);

  const options = [
    hasUploadMediaAction && {
      label: __('Upload a file', 'web-stories'),
      value: 'upload',
      onClick: noop,
      mediaPickerProps: {
        onSelect,
        onSelectErrorMessage: __(
          'Please choose a VTT file to use as caption.',
          'web-stories'
        ),
        type: allowedAudioMimeTypes,
        title: __('Upload an audio file', 'web-stories'),
        buttonInsertText: __('Select audio file', 'web-stories'),
      },
    },
    {
      label: __('Link to a file', 'web-stories'),
      value: 'hotlink',
      onClick: () => {
        setIsOpen(true);
      },
    },
  ].filter(Boolean);

  return (
    <>
      {!resource?.src && (
        <ButtonRow spaceBetween={false}>
          {hasUploadMediaAction && (
            <MediaUpload
              onSelect={onSelect}
              onSelectErrorMessage={onSelectErrorMessage}
              type={allowedAudioMimeTypes}
              title={__('Upload an audio file', 'web-stories')}
              buttonInsertText={__('Select audio file', 'web-stories')}
              render={renderUploadButton}
            />
          )}
          <UploadButton
            variant={ButtonVariant.Rectangle}
            type={ButtonType.Secondary}
            size={ButtonSize.Small}
            onClick={() => setIsOpen(true)}
          >
            {__('Link to audio file', 'web-stories')}
          </UploadButton>
        </ButtonRow>
      )}
      {resource?.src && (
        <>
          <FileRow
            id={resource.id}
            src={resource.src}
            title={resource.src.split('/').pop()}
            isExternal={!resource.id}
            options={options}
            onRemove={handleRemove}
            removeItemLabel={__('Remove file', 'web-stories')}
          >
            <AudioPlayer
              title={resource.src.substring(resource?.src.lastIndexOf('/') + 1)}
              src={audioSrcProxied}
              mimeType={resource.mimeType}
              tracks={tracks}
              audioId={audioId}
              playerRef={playerRef}
              loop={loop}
            />
          </FileRow>
          {showCaptions && (
            <>
              <SectionHeading>
                {__('Caption and Subtitles', 'web-stories')}
              </SectionHeading>
              <CaptionsPanelContent
                captionText={__('Upload a file', 'web-stories')}
                tracks={tracks || []}
                handleChangeTrack={handleChangeTrack}
                handleRemoveTrack={handleRemoveTrack}
                renderUploadButton={renderUploadCaptionButton}
              />
            </>
          )}
          {showLoopControl && resource?.length > 0 && (
            <>
              <SectionHeading>{__('Options', 'web-stories')}</SectionHeading>
              <Row spaceBetween={false}>
                <LoopPanelContent loop={loop} onChange={onChangeLoop} />
              </Row>
            </>
          )}
        </>
      )}
      <HotlinkModal
        title={__('Insert external background audio', 'web-stories')}
        isOpen={isOpen}
        onError={onError}
        onSelect={onSelectHotlink}
        onClose={() => setIsOpen(false)}
        allowedFileTypes={allowedAudioFileTypes}
        insertText={__('Use audio file', 'web-stories')}
        insertingText={__('Selecting audio file', 'web-stories')}
        // See https://github.com/GoogleForCreators/web-stories-wp/issues/11479
        canUseProxy={!showCaptions && !showLoopControl}
      />
    </>
  );
}

BackgroundAudioPanelContent.propTypes = {
  backgroundAudio: PropTypes.shape({
    resource: BackgroundAudioPropType,
    loop: PropTypes.bool,
    tracks: PropTypes.arrayOf(ResourcePropTypes.trackResource),
  }),
  updateBackgroundAudio: PropTypes.func.isRequired,
  showCaptions: PropTypes.bool,
  showLoopControl: PropTypes.bool,
  audioId: PropTypes.string,
};

export default BackgroundAudioPanelContent;
