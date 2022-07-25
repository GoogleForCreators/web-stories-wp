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
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';

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
  Canvas,
  Audio,
  Photo,
} from '../mediaRecording';
import { PageTitleArea } from './layout';

function MediaRecordingLayer() {
  const { isRTL } = useConfig();

  const {
    updateMediaDevices,
    status,
    error,
    mediaBlob,
    mediaBlobUrl,
    setMediaBlobUrl,
    liveStream,
    getMediaStream,
    setFile,
    needsPermissions,
    hasVideo,
    hasAudio,
    isGif,
    toggleIsGif,
    isImageCapture,
    audioInput,
    videoInput,
    resetStream,
    canvasStream,
    setCanvasStream,
  } = useMediaRecording(({ state, actions }) => ({
    status: state.status,
    error: state.error,
    liveStream: state.liveStream,
    mediaBlob: state.mediaBlob,
    mediaBlobUrl: state.mediaBlobUrl,
    hasVideo: state.hasVideo,
    hasAudio: state.hasAudio,
    isGif: state.isGif,
    needsPermissions:
      ('idle' === state.status || 'acquiring_media' === state.status) &&
      !state.videoInput,
    audioInput: state.audioInput,
    videoInput: state.videoInput,
    canvasStream: state.canvasStream,
    isImageCapture: Boolean(state.file?.type?.startsWith('image')),
    toggleIsGif: actions.toggleIsGif,
    updateMediaDevices: actions.updateMediaDevices,
    getMediaStream: actions.getMediaStream,
    clearMediaStream: actions.clearMediaStream,
    setFile: actions.setFile,
    setMediaBlobUrl: actions.setMediaBlobUrl,
    resetStream: actions.resetStream,
    setCanvasStream: actions.setCanvasStream,
  }));

  const streamRef = useRef();
  const videoRef = useRef();
  const canvasRef = useRef();
  const contextRef = useRef();

  const isReady = 'ready' === status;
  const isFailed = 'failed' === status || Boolean(error);

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
  }, [audioInput, videoInput, hasVideo]);

  useEffect(() => {
    if (isReady) {
      updateMediaDevices();
    }
  }, [isReady, updateMediaDevices]);

  const onResults = (results) => {
    // TODO: use streamRef.current.videoWidth to set the canvas dims
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
      results.segmentationMask,
      0,
      0,
      canvas.width,
      canvas.height
    );
    context.globalCompositeOperation = 'source-out';
    context.fillStyle = '#0F0';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'destination-atop';
    context.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    context.restore();
  };

  useEffect(() => {
    async function run() {
      if (canvasRef.current) {
        contextRef.current = canvasRef.current.getContext('2d');
        if (!canvasStream) {
          setCanvasStream(canvasRef.current.captureStream(25));
        } // TODO: Read FPS from webcam stream?
      }
      const selfieSegmentation = new SelfieSegmentation({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
      });
      const sendToMediaPipe = async () => {
        if (!streamRef.current || !streamRef.current.videoWidth) {
          requestAnimationFrame(sendToMediaPipe);
        } else {
          await selfieSegmentation.send({ image: streamRef.current });
          requestAnimationFrame(sendToMediaPipe);
        }
      };

      // Checking for srcObject avoids flickering due to the stream changing constantly.
      if (streamRef.current && !streamRef.current.srcObject && liveStream) {
        streamRef.current.srcObject = liveStream;
        await sendToMediaPipe();

        selfieSegmentation.setOptions({
          modelSelection: 1,
        });

        selfieSegmentation.onResults(onResults);
      }

      if (streamRef.current && !liveStream) {
        streamRef.current.srcObject = null;
      }
    }
    run();
  }, [liveStream, canvasStream, setCanvasStream]);

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
                  {mediaBlobUrl && hasVideo && (
                    <VideoMode value={!isGif} onChange={onToggleVideoMode} />
                  )}
                  <VideoWrapper>
                    {mediaBlobUrl &&
                      (hasVideo ? (
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
                      ) : (
                        <>
                          {/* eslint-disable-next-line jsx-a11y/media-has-caption -- No captions wanted/needed here. */}
                          <audio controls="controls" src={mediaBlobUrl} />
                        </>
                      ))}
                    {!mediaBlob &&
                      !mediaBlobUrl &&
                      liveStream &&
                      (hasVideo ? (
                        <>
                          <Video ref={streamRef} muted />
                          {/* TODO: Use videoWidth from webcam stream video. */}
                          {<Canvas ref={canvasRef} width={640} height={480} />}
                        </>
                      ) : (
                        <>
                          {/* eslint-disable-next-line jsx-a11y/media-has-caption -- No an actual <audio> tag. */}
                          <Audio liveStream={liveStream} />
                        </>
                      ))}
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
