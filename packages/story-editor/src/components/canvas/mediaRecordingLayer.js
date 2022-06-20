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
import { StyleSheetManager } from 'styled-components';
import stylisRTLPlugin from 'stylis-plugin-rtl';
Object.defineProperty(stylisRTLPlugin, 'name', { value: 'stylisRTLPlugin' });
import { __ } from '@googleforcreators/i18n';
import {
  useCallback,
  useEffect,
  useRef,
  useDebouncedCallback,
} from '@googleforcreators/react';
import {
  blobToFile,
  createBlob,
  getImageFromVideo,
} from '@googleforcreators/media';
import { format } from '@googleforcreators/date';
import { useSnackbar } from '@googleforcreators/design-system';
import { trackError } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import useConfig from '../../app/config/useConfig';
import {
  useMediaRecording,
  PermissionsDialog,
  ErrorDialog,
  Countdown,
  VideoMode,
  ProgressBar,
  DurationIndicator,
  Footer,
  SettingsModal,
  PlayPauseButton,
  LayerWithGrayout,
  DisplayPageArea,
  Wrapper,
  PHOTO_MIME_TYPE,
  PHOTO_FILE_TYPE,
  VideoWrapper,
  Video,
  Photo,
} from '../mediaRecording';
import { PageTitleArea } from './layout';

function MediaRecordingLayer() {
  const { isRTL } = useConfig();

  const {
    updateMediaDevices,
    status,
    mediaBlob,
    mediaBlobUrl,
    setMediaBlobUrl,
    liveStream,
    getMediaStream,
    setFile,
    needsPermissions,
    hasAudio,
    isGif,
    toggleIsGif,
    isImageCapture,
    audioInput,
    videoInput,
    resetStream,
  } = useMediaRecording(({ state, actions }) => ({
    status: state.status,
    liveStream: state.liveStream,
    mediaBlob: state.mediaBlob,
    mediaBlobUrl: state.mediaBlobUrl,
    hasAudio: state.hasAudio,
    isGif: state.isGif,
    needsPermissions:
      ('idle' === state.status || 'acquiring_media' === state.status) &&
      !state.videoInput,
    audioInput: state.audioInput,
    videoInput: state.videoInput,
    isImageCapture: Boolean(state.file?.type?.startsWith('image')),
    toggleIsGif: actions.toggleIsGif,
    updateMediaDevices: actions.updateMediaDevices,
    getMediaStream: actions.getMediaStream,
    clearMediaStream: actions.clearMediaStream,
    setFile: actions.setFile,
    setMediaBlobUrl: actions.setMediaBlobUrl,
    resetStream: actions.resetStream,
  }));

  const streamRef = useRef();
  const videoRef = useRef();

  const isReady = 'ready' === status;
  const isFailed = 'failed' === status;

  const isMuted = !hasAudio || isGif;

  const { showSnackbar } = useSnackbar();

  const captureImage = useCallback(async () => {
    if (!streamRef.current) {
      return;
    }

    let blob;

    try {
      blob = await getImageFromVideo(streamRef.current);
      setMediaBlobUrl(createBlob(blob));
    } catch (e) {
      trackError('media_recording_capture', e.message);

      showSnackbar({
        message: __(
          ' There was an error taking a photo. Please try a gain.',
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
  }, [resetStream, setFile, setMediaBlobUrl, showSnackbar]);

  const debouncedCaptureImage = useDebouncedCallback(captureImage, 3000);

  const onToggleVideoMode = useCallback(() => {
    toggleIsGif();
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [toggleIsGif]);

  useEffect(() => {
    resetStream();
    getMediaStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only want to act on actual input changes.
  }, [audioInput, videoInput]);

  useEffect(() => {
    if (isReady) {
      updateMediaDevices();
    }
  }, [isReady, updateMediaDevices]);

  useEffect(() => {
    // Checking for srcObject avoids flickering due to the stream changing constantly.
    if (streamRef.current && !streamRef.current.srcObject && liveStream) {
      streamRef.current.srcObject = liveStream;
    }

    if (streamRef.current && !liveStream) {
      streamRef.current.srcObject = null;
    }
  }, [liveStream]);

  if (needsPermissions) {
    return <PermissionsDialog />;
  }

  if (isFailed) {
    return <ErrorDialog />;
  }

  return (
    // CanvasLayout disables stylisRTLPlugin, but for this subtree we want it again
    // to make RTL work automatically.
    <StyleSheetManager stylisPlugins={isRTL ? [stylisRTLPlugin] : []}>
      <>
        <LayerWithGrayout
          aria-label={__('Media Recording layer', 'web-stories')}
        >
          <PageTitleArea>
            <DurationIndicator />
          </PageTitleArea>
          <DisplayPageArea withSafezone={false} showOverflow>
            <Wrapper>
              {!isImageCapture && (
                <>
                  {mediaBlobUrl && (
                    <VideoMode value={!isGif} onChange={onToggleVideoMode} />
                  )}
                  <VideoWrapper>
                    {mediaBlobUrl && (
                      <>
                        {/* eslint-disable-next-line jsx-a11y/media-has-caption -- We don't have tracks for this. */}
                        <Video
                          ref={videoRef}
                          src={mediaBlobUrl}
                          muted={isMuted}
                          loop={isGif}
                          tabIndex={0}
                        />
                        {!isGif && <PlayPauseButton videoRef={videoRef} />}
                      </>
                    )}
                    {!mediaBlob && !mediaBlobUrl && liveStream && (
                      <Video ref={streamRef} muted />
                    )}
                  </VideoWrapper>
                </>
              )}
              {isImageCapture && (
                <VideoWrapper>
                  <Photo
                    decoding="async"
                    src={mediaBlobUrl}
                    alt={__('Image capture', 'web-stories')}
                  />
                </VideoWrapper>
              )}
            </Wrapper>
            <ProgressBar />
            <Countdown />
          </DisplayPageArea>
          <Footer captureImage={debouncedCaptureImage} videoRef={videoRef} />
        </LayerWithGrayout>
        <SettingsModal />
      </>
    </StyleSheetManager>
  );
}

export default MediaRecordingLayer;
