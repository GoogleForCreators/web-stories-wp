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
import { __ } from '@googleforcreators/i18n';
import {
  useCallback,
  useEffect,
  usePrevious,
  useRef,
  useDebouncedCallback,
} from '@googleforcreators/react';
import {
  blobToFile,
  createBlob,
  getImageFromVideo,
} from '@googleforcreators/media';
import { format } from '@googleforcreators/date';

/**
 * Internal dependencies
 */
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
  LayerWithGrayout,
  DisplayPageArea,
  Wrapper,
} from '../mediaRecording';
import { PageTitleArea } from './layout';

const VideoWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
  margin: 0 auto;
  display: flex;
  align-items: center;
`;

const Video = styled.video`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
`;

const Photo = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
`;

function MediaRecordingLayer() {
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
    setFile: actions.setFile,
    setMediaBlobUrl: actions.setMediaBlobUrl,
  }));

  const streamRef = useRef();
  const videoRef = useRef();

  const isReady = 'ready' === status;
  const isFailed = 'failed' === status;

  const previousAudioInput = usePrevious(audioInput);
  const previousVideoInput = usePrevious(videoInput);

  const isMuted = !hasAudio || isGif;

  const captureImage = useCallback(async () => {
    if (!streamRef.current) {
      return;
    }

    const blob = await getImageFromVideo(streamRef.current);
    setMediaBlobUrl(createBlob(blob));

    const imageFile = blobToFile(
      blob,
      `image-capture-${format(new Date(), 'Y-m-d-H-i')}.jpeg`,
      'image/jpeg'
    );
    setFile(imageFile);
  }, [setFile, setMediaBlobUrl]);

  const debouncedCaptureImage = useDebouncedCallback(captureImage, 3000);

  const onToggleVideoMode = useCallback(() => {
    toggleIsGif();
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [toggleIsGif]);

  // Try to get permissions as soon as dialog opens.
  useEffect(() => {
    getMediaStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only run once.
  }, []);

  useEffect(() => {
    if (
      previousAudioInput !== audioInput ||
      previousVideoInput !== videoInput
    ) {
      getMediaStream();
    }
  }, [
    audioInput,
    getMediaStream,
    previousAudioInput,
    previousVideoInput,
    videoInput,
  ]);

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
    <>
      <LayerWithGrayout>
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
                      {/* eslint-disable-next-line styled-components-a11y/media-has-caption,jsx-a11y/media-has-caption -- We don't have tracks for this. */}
                      <Video
                        ref={videoRef}
                        src={mediaBlobUrl}
                        autoPlay
                        controls={!isGif}
                        muted={isMuted}
                        loop={isGif}
                        disablePictureInPicture
                      />
                    </>
                  )}
                  {!mediaBlob && liveStream && (
                    <Video
                      ref={streamRef}
                      autoPlay
                      muted
                      disablePictureInPicture
                    />
                  )}
                </VideoWrapper>
              </>
            )}
            {isImageCapture && (
              <VideoWrapper>
                <Photo
                  src={mediaBlobUrl}
                  alt={__('Image capture', 'web-stories')}
                />
              </VideoWrapper>
            )}
          </Wrapper>
          <ProgressBar />
          <Countdown />
        </DisplayPageArea>
        <Footer captureImage={debouncedCaptureImage} />
      </LayerWithGrayout>
      <SettingsModal />
    </>
  );
}

export default MediaRecordingLayer;
