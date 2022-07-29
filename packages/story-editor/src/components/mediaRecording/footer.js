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
import { __, _n, sprintf } from '@googleforcreators/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  Icons,
  useLiveRegion,
  useSnackbar,
} from '@googleforcreators/design-system';
import {
  useCallback,
  useDebouncedCallback,
  useState,
  useEffect,
} from '@googleforcreators/react';
import { trackEvent, trackError } from '@googleforcreators/tracking';
import {
  getVideoLength,
  getVideoLengthDisplay,
  blobToFile,
  createBlob,
  getImageFromVideo,
  formatMsToHMS,
} from '@googleforcreators/media';
import { format } from '@googleforcreators/date';
import { BackgroundAudioPropTypeShape } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import useVideoTrim from '../videoTrim/useVideoTrim';
import getResourceFromLocalFile from '../../app/media/utils/getResourceFromLocalFile';
import useUploadWithPreview from '../canvas/useUploadWithPreview';
import { useUploader } from '../../app/uploader';
import { useConfig, useStory } from '../../app';
import useHighlights from '../../app/highlights/useHighlights';
import states from '../../app/highlights/states';
import useFFmpeg from '../../app/media/utils/useFFmpeg';
import objectPick from '../../utils/objectPick';
import useMediaRecording from './useMediaRecording';
import {
  COUNTDOWN_TIME_IN_SECONDS,
  PHOTO_MIME_TYPE,
  PHOTO_FILE_TYPE,
} from './constants';

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

const PauseButton = styled(BaseButton).attrs({
  type: BUTTON_TYPES.SECONDARY,
})`
  margin-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
`;

const StopButton = styled(BaseButton)`
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

function Footer() {
  const {
    status,
    file,
    isGif,
    isMuted,
    hasMediaToInsert,
    countdown,
    duration,
    isCountingDown,
    trimData,
    setMediaBlobUrl,
    setDuration,
    setCountdown,
    startRecording,
    stopRecording,
    setFile,
    toggleRecordingMode,
    getMediaStream,
    resetState,
    resetStream,
    streamNode,
    liveStream,
    hasVideo,
    pauseRecording,
    resumeRecording,
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
    trimData: state.trimData,
    liveStream: state.liveStream,
    streamNode: state.streamNode,
    startRecording: actions.startRecording,
    stopRecording: actions.stopRecording,
    setFile: actions.setFile,
    setMediaBlobUrl: actions.setMediaBlobUrl,
    setDuration: actions.setDuration,
    setCountdown: actions.setCountdown,
    toggleRecordingMode: actions.toggleRecordingMode,
    getMediaStream: actions.getMediaStream,
    resetState: actions.resetState,
    resetStream: actions.resetStream,
    pauseRecording: actions.pauseRecording,
    resumeRecording: actions.resumeRecording,
  }));
  const videoNode = useVideoTrim(({ state: { videoNode } }) => videoNode);

  const uploadWithPreview = useUploadWithPreview();

  const speak = useLiveRegion();

  const {
    allowedMimeTypes: { audio: allowedAudioMimeTypes },
  } = useConfig();

  const onPause = useCallback(() => {
    pauseRecording();
    trackEvent('media_recording_pause');
  }, [pauseRecording]);

  const onResume = useCallback(() => {
    resumeRecording();
    trackEvent('media_recording_resume');
  }, [resumeRecording]);

  const onRetry = useCallback(async () => {
    resetState();
    await getMediaStream();

    trackEvent('media_recording_retry');
  }, [getMediaStream, resetState]);

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

  const isRecording = ['recording', 'stopping', 'stopped', 'paused'].includes(
    status
  );
  const isPaused = status === 'paused';

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

      args.resource.length = duration;
      args.resource.lengthFormatted = getVideoLengthDisplay(duration);

      args.resource.isOptimized = true;
      args.resource.isMuted = isMuted;
      args.posterFile = posterFile;
      // If video has been trimmed, `end` will no longer be `null`,
      // but some number bigger than 0
      if (trimData.end) {
        args.trimData = {
          start: formatMsToHMS(trimData.start),
          end: formatMsToHMS(trimData.end),
        };
        const trimmedLength = (trimData.end - trimData.start) / 1000;
        args.resource.length = trimmedLength;
        args.resource.lengthFormatted = getVideoLengthDisplay(trimmedLength);
      } else {
        const { length, lengthFormatted } = getVideoLength(videoNode);
        args.resource.length = length || duration;
        args.resource.lengthFormatted = length
          ? lengthFormatted
          : getVideoLengthDisplay(duration);
      }
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
    speak,
    file,
    uploadWithPreview,
    isRecording,
    isGif,
    isMuted,
    duration,
    toggleRecordingMode,
    trimData.end,
    trimData.start,
    videoNode,
    setMediaBlobUrl,
    setFile,
  ]);

  useEffect(() => {
    // Checking for srcObject avoids flickering due to the stream changing constantly.
    if (streamNode && !streamNode.srcObject && liveStream) {
      streamNode.srcObject = liveStream;
    }

    if (streamNode && !liveStream) {
      streamNode.srcObject = null;
    }
  }, [streamNode, liveStream]);

  const { showSnackbar } = useSnackbar();

  const captureImage = useCallback(async () => {
    if (!streamNode) {
      return;
    }

    let blob;

    try {
      blob = await getImageFromVideo(streamNode);
      setMediaBlobUrl(createBlob(blob));
    } catch (e) {
      trackError('media_recording_capture', e.message);

      showSnackbar({
        message: __(
          'There was an error taking a photo. Please try again.',
          'web-stories'
        ),
        dismissable: true,
      });
    }

    const imageFile = blobToFile(
      blob,
      `image-capture-${format(new Date(), 'Y-m-d-H-i')}.${PHOTO_FILE_TYPE}`,
      PHOTO_MIME_TYPE
    );
    setFile(imageFile);
    resetStream();
  }, [resetStream, setFile, setMediaBlobUrl, showSnackbar, streamNode]);

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
  const {
    actions: { uploadFile },
  } = useUploader();

  const {
    updateCurrentPageProperties,
    backgroundElementId,
    setSelectedElementsById,
  } = useStory(
    ({
      state: { currentPage },
      actions: { updateCurrentPageProperties, setSelectedElementsById },
    }) => ({
      backgroundElementId: currentPage?.elements.find(
        ({ isBackground }) => isBackground
      )?.id,
      updateCurrentPageProperties,
      setSelectedElementsById,
      currentPage,
    })
  );
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

    setSelectedElementsById({ elementIds: [backgroundElementId] });
    setHighlights({
      highlight: states.PAGE_BACKGROUND_AUDIO,
    });

    updateCurrentPageProperties({
      properties: {
        backgroundAudio,
      },
    });
    setIsInserting(false);
    toggleRecordingMode();
  };

  if ('acquiring_media' === status) {
    return null;
  }

  return (
    <>
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
              : __('Insert page background audio', 'web-stories')}
          </InsertButton>
        </>
      )}
      {!hasMediaToInsert && countdown === 0 && (
        <>
          {isRecording && (
            <>
              <PauseButton
                onClick={isPaused ? onResume : onPause}
                aria-label={
                  isPaused
                    ? __('Resume Recording', 'web-stories')
                    : __('Pause Recording', 'web-stories')
                }
              >
                {isPaused
                  ? __('Resume', 'web-stories')
                  : __('Pause', 'web-stories')}
              </PauseButton>
              <StopButton
                onClick={stopRecording}
                aria-label={__('Stop Recording', 'web-stories')}
              >
                {__('Stop', 'web-stories')}
              </StopButton>
            </>
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
    </>
  );
}

export default Footer;
