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
import Countdown from './countdown';
import VideoMode from './videoMode';
import ProgressBar from './progressBar';
import PlayPauseButton from './playPauseButton';
import ErrorDialog from './errorDialog';
import PermissionsDialog from './permissionsDialog';
import { Wrapper, VideoWrapper, Video, Photo } from './components';
import Audio from './audio';
import useTrimmedReplay from './useTrimmedReplay';

function MediaRecording() {
  const {
    status,
    error,
    mediaBlob,
    mediaBlobUrl,
    liveStream,
    hasVideo,
    hasAudio,
    isGif,
    isImageCapture,
    needsPermissions,
    isTrimming,
    trimData,
    toggleIsGif,
    setStreamNode,
  } = useMediaRecording(({ state, actions }) => ({
    status: state.status,
    error: state.error,
    mediaBlob: state.mediaBlob,
    mediaBlobUrl: state.mediaBlobUrl,
    liveStream: state.liveStream,
    hasVideo: state.hasVideo,
    hasAudio: state.hasAudio,
    isGif: state.isGif,
    isImageCapture: Boolean(state.file?.type?.startsWith('image')),
    needsPermissions:
      ('idle' === state.status || 'acquiring_media' === state.status) &&
      !state.videoInput,
    isTrimming: state.isTrimming,
    trimData: state.trimData,
    toggleIsGif: actions.toggleIsGif,
    setStreamNode: actions.setStreamNode,
  }));
  const setVideoNode = useVideoTrim(
    ({ actions: { setVideoNode } }) => setVideoNode
  );

  const isFailed = 'failed' === status || Boolean(error);
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

  useTrimmedReplay({ videoRef, trimData, isActive: !isTrimming });

  if (isFailed) {
    return <ErrorDialog />;
  }

  if (needsPermissions) {
    return <PermissionsDialog />;
  }

  // Only previewing a gif means that the play button is hidden,
  // not while trimming (even if gif)
  const hasPlayButton = !isGif || isTrimming;

  return (
    <>
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
                    <Video
                      ref={updateVideoNode}
                      src={mediaBlobUrl}
                      muted={isMuted}
                      loop={isGif || isTrimming}
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
    </>
  );
}

export default MediaRecording;

/* eslint-enable jsx-a11y/media-has-caption -- Reenabling */
