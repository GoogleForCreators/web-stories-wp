/*
 * Copyright 2022 Google LLC
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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { __, _n, sprintf } from '@googleforcreators/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  Icons,
  useLiveRegion,
} from '@googleforcreators/design-system';
import {
  useCallback,
  useDebouncedCallback,
  useState,
} from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';
import {
  getVideoLength,
  getVideoLengthDisplay,
} from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import { BackgroundAudioPropTypeShape } from '@googleforcreators/elements';
import getResourceFromLocalFile from '../../app/media/utils/getResourceFromLocalFile';
import { Z_INDEX_RECORDING_MODE } from '../../constants/zIndex';
import { FooterArea } from '../canvas/layout';
import useUploadWithPreview from '../canvas/useUploadWithPreview';
import { useUploader } from '../../app/uploader';
import { useConfig, useStory } from '../../app';
import useHighlights from '../../app/highlights/useHighlights';
import states from '../../app/highlights/states';
import useFFmpeg from '../../app/media/utils/useFFmpeg';
import objectPick from '../../utils/objectPick';
import { COUNTDOWN_TIME_IN_SECONDS } from './constants';
import useMediaRecording from './useMediaRecording';

const StyledFooter = styled(FooterArea)`
  display: flex;
  align-items: start;
  flex-direction: row;
  justify-content: center;
  z-index: ${Z_INDEX_RECORDING_MODE};
`;

const BaseButton = styled(Button).attrs({
  type: BUTTON_TYPES.PRIMARY,
  size: BUTTON_SIZES.SMALL,
})``;

const RecordingButton = styled(BaseButton)`
  margin-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;

  svg {
    margin: -9px 10px -9px 0;
  }
`;

const StopButton = styled(BaseButton)`
  margin-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;

  background-color: ${({ theme }) => theme.colors.interactiveBg.negativeNormal};
  border-color: ${({ theme }) => theme.colors.interactiveBg.negativeNormal};
  color: ${({ theme }) => theme.colors.gray[5]};

  &:active,
  &:hover,
  &:focus {
    background-color: ${({ theme }) =>
      theme.colors.interactiveBg.negativeHover};
    border-color: ${({ theme }) => theme.colors.interactiveBg.negativeHover};
  }
`;

const CaptureButton = styled(BaseButton).attrs({
  type: BUTTON_TYPES.QUATERNARY,
})`
  background-color: ${({ theme }) => theme.colors.opacity.overlayDark};
  padding-top: 12px;
  padding-bottom: 12px;

  svg {
    margin: -9px 10px -9px 0;
  }
`;

const InsertButton = styled(Button).attrs({
  type: BUTTON_TYPES.PRIMARY,
  size: BUTTON_SIZES.SMALL,
})``;

const RetryButton = styled(Button).attrs({
  type: BUTTON_TYPES.PLAIN,
  size: BUTTON_SIZES.SMALL,
})`
  margin-right: 20px;
`;

function Footer({ captureImage, videoRef }) {
  const {
    status,
    file,
    isGif,
    isMuted,
    hasMediaToInsert,
    countdown,
    duration,
    isCountingDown,
    setMediaBlobUrl,
    setDuration,
    setCountdown,
    startRecording,
    stopRecording,
    setFile,
    toggleRecordingMode,
    getMediaStream,
    resetState,
    hasVideo,
  } = useMediaRecording(({ state, actions }) => ({
    status: state.status,
    file: state.file,
    isGif: state.isGif,
    isMuted: !state.hasAudio || state.isGif,
    countdown: state.countdown,
    duration: state.duration,
    isCountingDown: state.isCountingDown,
    hasVideo: state.hasVideo,
    hasMediaToInsert: Boolean(state.mediaBlobUrl),
    startRecording: actions.startRecording,
    stopRecording: actions.stopRecording,
    setFile: actions.setFile,
    setMediaBlobUrl: actions.setMediaBlobUrl,
    setDuration: actions.setDuration,
    setCountdown: actions.setCountdown,
    toggleRecordingMode: actions.toggleRecordingMode,
    getMediaStream: actions.getMediaStream,
    resetState: actions.resetState,
  }));

  const uploadWithPreview = useUploadWithPreview();

  const speak = useLiveRegion();

  const {
    allowedMimeTypes: { audio: allowedAudioMimeTypes },
  } = useConfig();

  const onRetry = useCallback(async () => {
    resetState();
    await getMediaStream();

    trackEvent('media_recording_retry');
  }, [getMediaStream, resetState]);

  const onCapture = useCallback(() => {
    speak(
      sprintf(
        /* translators: %d: countdown time in seconds. */
        _n(
          'Taking photo in %d second',
          'Taking photo in %d seconds',
          COUNTDOWN_TIME_IN_SECONDS,
          'web-stories'
        ),
        COUNTDOWN_TIME_IN_SECONDS
      )
    );

    setCountdown(COUNTDOWN_TIME_IN_SECONDS);
    captureImage();

    trackEvent('media_recording_capture', { type: 'image' });
  }, [captureImage, setCountdown, speak]);

  const debouncedStartRecording = useDebouncedCallback(startRecording, 3000);

  const onStart = useCallback(() => {
    speak(
      sprintf(
        /* translators: %d: countdown time in seconds. */
        _n(
          'Starting recording in %d second',
          'Starting recording in %d seconds',
          COUNTDOWN_TIME_IN_SECONDS,
          'web-stories'
        ),
        COUNTDOWN_TIME_IN_SECONDS
      )
    );

    setDuration(0);
    setCountdown(COUNTDOWN_TIME_IN_SECONDS);
    debouncedStartRecording();
  }, [debouncedStartRecording, setCountdown, setDuration, speak]);

  const [isInserting, setIsInserting] = useState(false);

  const isRecording = ['recording', 'stopping', 'stopped'].includes(status);

  const onInsert = useCallback(async () => {
    setIsInserting(true);
    speak(__('Inserting…', 'web-stories'));

    const args = {
      additionalData: {
        mediaSource: 'recording',
        // Used for uploading via uploadFile().
        altText: __('Camera Capture', 'web-stories'),
      },
    };
    const { resource, posterFile } = await getResourceFromLocalFile(file);

    args.resource = {
      ...resource,
      // Used for displaying the recorded file on canvas in the meantime.
      alt: __('Camera Capture', 'web-stories'),
    };

    if (file.type.startsWith('video')) {
      args.additionalData.isMuted = isMuted;
      args.additionalData.isGif = isGif;

      // Get length from the video blob on screen and fall back
      // to the duration in state if needed since it's not super reliable.
      const { length, lengthFormatted } = getVideoLength(videoRef.current);
      args.resource.length = length || duration;
      args.resource.lengthFormatted = length
        ? lengthFormatted
        : getVideoLengthDisplay(duration);

      args.resource.isOptimized = true;
      args.resource.isMuted = isMuted;
      args.posterFile = posterFile;
    }

    uploadWithPreview([file], true, args);

    // handling cleanup for Image capture
    // in this case we don't want onStop to override the file
    if (isRecording) {
      setMediaBlobUrl(null);
      setFile(null);
    }

    trackEvent('media_recording_capture', {
      type: isGif ? 'gif' : 'video',
      muted: isMuted,
      duration,
    });

    setIsInserting(false);

    toggleRecordingMode();
  }, [
    videoRef,
    file,
    uploadWithPreview,
    toggleRecordingMode,
    isRecording,
    isGif,
    duration,
    isMuted,
    setMediaBlobUrl,
    setFile,
    speak,
  ]);

  const {
    actions: { uploadFile },
  } = useUploader();

  const { updateStory } = useStory(({ actions: { updateStory } }) => ({
    updateStory,
  }));
  const { setHighlights } = useHighlights(({ setHighlights }) => ({
    setHighlights,
  }));

  const { convertToMp3 } = useFFmpeg();

  const onAudioInsert = async () => {
    setIsInserting(true);
    speak(__('Inserting…', 'web-stories'));

    const mp3File = await convertToMp3(file);
    const resource = await uploadFile(
      mp3File,
      {
        mediaSource: 'recording',
      },
      allowedAudioMimeTypes
    );
    const backgroundAudio = {
      resource: objectPick(resource, Object.keys(BackgroundAudioPropTypeShape)),
    };

    setHighlights({
      highlight: states.BACKGROUND_AUDIO,
    });

    updateStory({
      properties: { backgroundAudio },
    });
    setIsInserting(false);
    toggleRecordingMode();
  };

  if ('acquiring_media' === status) {
    return null;
  }

  return (
    <StyledFooter showOverflow>
      {hasMediaToInsert && (
        <>
          <RetryButton onClick={onRetry} disabled={isInserting}>
            {__('Retry', 'web-stories')}
          </RetryButton>
          <InsertButton
            onClick={hasVideo ? onInsert : onAudioInsert}
            disabled={isInserting}
          >
            {isInserting
              ? __('Inserting…', 'web-stories')
              : hasVideo
              ? __('Insert', 'web-stories')
              : __('Insert background audio', 'web-stories')}
          </InsertButton>
        </>
      )}
      {!hasMediaToInsert && countdown === 0 && (
        <>
          {isRecording && (
            <StopButton onClick={stopRecording}>
              {__('Stop Recording', 'web-stories')}
            </StopButton>
          )}
          {!isRecording &&
            !isCountingDown &&
            (hasVideo ? (
              <>
                <RecordingButton onClick={onStart}>
                  <Icons.Camera width={24} height={24} aria-hidden />
                  {__('Record Video', 'web-stories')}
                </RecordingButton>
                <CaptureButton onClick={onCapture}>
                  <Icons.PhotoCamera width={24} height={24} aria-hidden />
                  {__('Take a photo', 'web-stories')}
                </CaptureButton>
              </>
            ) : (
              <RecordingButton onClick={onStart}>
                <Icons.Mic width={24} height={24} aria-hidden />
                {__('Record Audio', 'web-stories')}
              </RecordingButton>
            ))}
        </>
      )}
    </StyledFooter>
  );
}

Footer.propTypes = {
  captureImage: PropTypes.func.isRequired,
  videoRef: PropTypes.object,
};

export default Footer;
