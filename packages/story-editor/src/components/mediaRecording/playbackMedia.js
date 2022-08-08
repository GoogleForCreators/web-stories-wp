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

/* eslint-disable jsx-a11y/media-has-caption -- Not required for recording */

/**
 * External dependencies
 */
import { __ } from '@googleforcreators/i18n';
import { useCallback, useRef, useEffect } from '@googleforcreators/react';
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';

/**
 * Internal dependencies
 */
import useVideoTrim from '../videoTrim/useVideoTrim';
import useMediaRecording from './useMediaRecording';
import VideoMode from './videoMode';
import PlayPauseButton from './playPauseButton';
import { VideoWrapper, Video, Photo, Canvas } from './components';
import Audio from './audio';
import { BACKGROUND_BLUR_PX } from './constants';

const selfieSegmentation = new SelfieSegmentation({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
});
selfieSegmentation.setOptions({
  modelSelection: 1,
});
selfieSegmentation.initialize();

function PlaybackMedia() {
  const {
    mediaBlob,
    mediaBlobUrl,
    originalMediaBlobUrl,
    liveStream,
    hasVideo,
    hasAudio,
    videoEffect,
    isGif,
    isImageCapture,
    isAdjustingTrim,
    toggleIsGif,
    streamNode,
    setStreamNode,
    isProcessingTrim,
  } = useMediaRecording(({ state, actions }) => ({
    mediaBlob: state.mediaBlob,
    mediaBlobUrl: state.mediaBlobUrl,
    originalMediaBlobUrl: state.originalMediaBlobUrl,
    liveStream: state.liveStream,
    hasVideo: state.hasVideo,
    hasAudio: state.hasAudio,
    videoEffect: state.videoEffect,
    isGif: state.isGif,
    streamNode: state.streamNode,
    isImageCapture: Boolean(state.file?.type?.startsWith('image')),
    isAdjustingTrim: state.isAdjustingTrim,
    toggleIsGif: actions.toggleIsGif,
    setStreamNode: actions.setStreamNode,
    isProcessingTrim: state.isProcessingTrim,
  }));
  const setVideoNode = useVideoTrim(
    ({ actions: { setVideoNode } }) => setVideoNode
  );

  const isMuted = !hasAudio || isGif;
  const hasVideoEffect = videoEffect && videoEffect !== 'none';

  const onToggleVideoMode = useCallback(() => {
    toggleIsGif();
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [toggleIsGif]);

  const canvasRef = useRef();
  const videoRef = useRef();
  const updateVideoNode = useCallback(
    (node) => {
      setVideoNode(node);
      videoRef.current = node;
    },
    [setVideoNode]
  );

  const onSelfieSegmentationResults = (results) => {
    const canvas = canvasRef.current;
    if (!canvas || !results.image || results.image.width === 0) {
      return;
    }
    const context = canvasRef.current.getContext('2d');

    context.globalCompositeOperation = 'copy';
    context.filter = `blur(${BACKGROUND_BLUR_PX}px)`;
    context.drawImage(
      results.segmentationMask,
      0,
      0,
      canvas.width,
      canvas.height
    );

    context.globalCompositeOperation = 'source-in';
    context.filter = 'none';
    context.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    context.globalCompositeOperation = 'destination-over';
    context.filter = `blur(${BACKGROUND_BLUR_PX}px)`;
    context.drawImage(results.image, 0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    async function run() {
      if (videoEffect === 'blur') {
        await selfieSegmentation.initialize();
        selfieSegmentation.onResults(onSelfieSegmentationResults);
        const sendFrame = async () => {
          if (streamNode && streamNode.videoWidth && selfieSegmentation) {
            await selfieSegmentation.send({ image: streamNode });
          }
          requestAnimationFrame(sendFrame);
        };
        await sendFrame();
      }
    }
    run();
  }, [videoEffect, hasVideoEffect, streamNode]);

  // Only previewing a gif means that the play button is hidden,
  // not while trimming (even if gif)
  const hasPlayButton = (!isGif && !isProcessingTrim) || isAdjustingTrim;
  const mediaSrc = isAdjustingTrim ? originalMediaBlobUrl : mediaBlobUrl;

  const hasVideoModeSwitch =
    mediaBlobUrl && hasVideo && !isAdjustingTrim && !isProcessingTrim;

  if (isImageCapture) {
    return (
      <VideoWrapper>
        <Photo
          decoding="async"
          src={mediaBlobUrl}
          alt={__('Image capture', 'web-stories')}
        />
      </VideoWrapper>
    );
  }

  return (
    <>
      {hasVideoModeSwitch && (
        <VideoMode value={!isGif} onChange={onToggleVideoMode} />
      )}
      <VideoWrapper>
        {mediaBlobUrl &&
          (hasVideo ? (
            <>
              <Video
                ref={updateVideoNode}
                src={mediaSrc}
                muted={isMuted}
                loop={isGif || isAdjustingTrim}
                $isProcessing={isProcessingTrim}
                tabIndex={0}
              />
              {hasPlayButton && <PlayPauseButton videoRef={videoRef} />}
            </>
          ) : (
            <audio controls="controls" src={mediaBlobUrl} />
          ))}
        {!mediaBlob &&
          !mediaBlobUrl &&
          liveStream &&
          (hasVideo ? (
            <>
              <Video ref={setStreamNode} muted hidden={hasVideoEffect} />
              {hasVideoEffect && (
                <Canvas ref={canvasRef} width={640} height={480} />
              )}
            </>
          ) : (
            <Audio liveStream={liveStream} />
          ))}
      </VideoWrapper>
    </>
  );
}

export default PlaybackMedia;

/* eslint-enable jsx-a11y/media-has-caption -- Reenabling */
