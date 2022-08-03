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
import { useCallback, useRef } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import useVideoTrim from '../videoTrim/useVideoTrim';
import useMediaRecording from './useMediaRecording';
import VideoMode from './videoMode';
import PlayPauseButton from './playPauseButton';
import { VideoWrapper, Video, Photo } from './components';
import Audio from './audio';

function PlaybackMedia() {
  const {
    mediaBlob,
    mediaBlobUrl,
    originalMediaBlobUrl,
    liveStream,
    hasVideo,
    hasAudio,
    isGif,
    isImageCapture,
    isAdjustingTrim,
    toggleIsGif,
    setStreamNode,
    isProcessingTrim,
  } = useMediaRecording(({ state, actions }) => ({
    mediaBlob: state.mediaBlob,
    mediaBlobUrl: state.mediaBlobUrl,
    originalMediaBlobUrl: state.originalMediaBlobUrl,
    liveStream: state.liveStream,
    hasVideo: state.hasVideo,
    hasAudio: state.hasAudio,
    isGif: state.isGif,
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

  const onToggleVideoMode = useCallback(() => {
    toggleIsGif();
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [toggleIsGif]);

  const videoRef = useRef();
  const updateVideoNode = useCallback(
    (node) => {
      setVideoNode(node);
      videoRef.current = node;
    },
    [setVideoNode]
  );

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
            <Video ref={setStreamNode} muted />
          ) : (
            <Audio liveStream={liveStream} />
          ))}
      </VideoWrapper>
    </>
  );
}

export default PlaybackMedia;

/* eslint-enable jsx-a11y/media-has-caption -- Reenabling */
