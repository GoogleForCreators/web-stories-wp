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
import { __ } from '@googleforcreators/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  Icons,
} from '@googleforcreators/design-system';
import { useCallback, useDebouncedCallback } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import { Z_INDEX_RECORDING_MODE } from '../../constants/zIndex';
import { FooterArea } from '../canvas/layout';
import useUploadWithPreview from '../canvas/useUploadWithPreview';
import useMediaRecording from './useMediaRecording';
import { COUNTDOWN_TIME_IN_SECONDS } from './constants';

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

function Footer({ captureImage }) {
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
  } = useMediaRecording(({ state, actions }) => ({
    status: state.status,
    file: state.file,
    isGif: state.isGif,
    isMuted: !state.hasAudio || state.isGif,
    countdown: state.countdown,
    duration: state.duration,
    isCountingDown: state.isCountingDown,
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

  const onRetry = useCallback(() => {
    resetState();
    getMediaStream();

    trackEvent('media_recording_retry');
  }, [getMediaStream, resetState]);

  const onCapture = useCallback(() => {
    setCountdown(COUNTDOWN_TIME_IN_SECONDS);
    captureImage();

    trackEvent('media_recording_capture', { type: 'image' });
  }, [captureImage, setCountdown]);

  const debouncedStartRecording = useDebouncedCallback(startRecording, 3000);

  const onStart = useCallback(() => {
    setDuration(0);
    setCountdown(COUNTDOWN_TIME_IN_SECONDS);
    debouncedStartRecording();
  }, [debouncedStartRecording, setCountdown, setDuration]);

  const isRecording = 'recording' === status;

  const onInsert = useCallback(() => {
    const args = {
      additionalData: {},
    };

    if (file.type.startsWith('video')) {
      args.additionalData.isMuted = isMuted;

      if (isGif) {
        args.additionalData.mediaSource = 'gif-conversion';
      }
    }

    uploadWithPreview([file], true, args);
    toggleRecordingMode();

    // handling cleanup for Image capture
    // in this case we don't want onStop to override the file
    if (isRecording) {
      stopRecording();
      setMediaBlobUrl(null);
      setFile(null);
    }

    trackEvent('media_recording_capture', {
      type: isGif ? 'gif' : 'video',
      duration,
    });
  }, [
    isMuted,
    isGif,
    uploadWithPreview,
    file,
    toggleRecordingMode,
    isRecording,
    duration,
    stopRecording,
    setMediaBlobUrl,
    setFile,
  ]);

  return (
    <StyledFooter showOverflow>
      {hasMediaToInsert && (
        <>
          <RetryButton onClick={onRetry}>
            {__('Retry', 'web-stories')}
          </RetryButton>
          <InsertButton onClick={onInsert}>
            {__('Insert', 'web-stories')}
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
          {!isRecording && !isCountingDown && (
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
          )}
        </>
      )}
    </StyledFooter>
  );
}

Footer.propTypes = {
  captureImage: PropTypes.func.isRequired,
};

export default Footer;
