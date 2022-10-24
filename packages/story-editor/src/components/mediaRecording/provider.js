/*
 * Copyright 2020 Google LLC
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
import useMediaRecorder from '@wmik/use-media-recorder';
import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  usePrevious,
} from '@googleforcreators/react';
import {
  LOCAL_STORAGE_PREFIX,
  localStore,
  useLiveRegion,
  useSnackbar,
} from '@googleforcreators/design-system';
import { blobToFile, createBlob, revokeBlob } from '@googleforcreators/media';
import { format } from '@googleforcreators/date';
import { __ } from '@googleforcreators/i18n';
import { trackError } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import MediaRecordingContext from './context';
import useTrim from './useTrim';
import {
  MAX_RECORDING_DURATION_IN_SECONDS,
  VIDEO_FILE_TYPE,
  VIDEO_MIME_TYPE,
  AUDIO_FILE_TYPE,
  AUDIO_MIME_TYPE,
} from './constants';

function createFile(blob, hasVideo) {
  const FILE_TYPE = hasVideo ? VIDEO_FILE_TYPE : AUDIO_FILE_TYPE;
  const MIME_TYPE = hasVideo ? VIDEO_MIME_TYPE : AUDIO_MIME_TYPE;
  const captureType = hasVideo ? 'webcam' : 'audio';
  return blobToFile(
    blob,
    `${captureType}-capture-${format(new Date(), 'Y-m-d-H-i')}.${FILE_TYPE}`,
    MIME_TYPE
  );
}

function MediaRecordingProvider({ children }) {
  const [isInRecordingMode, setIsInRecordingMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [streamNode, setStreamNode] = useState(null);
  const [canvasStream, setCanvasStream] = useState(null);
  const [canvasNode, setCanvasNode] = useState(null);

  const [countdown, setCountdown] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isGif, setIsGif] = useState(false);

  const [hasVideo, setHasVideo] = useState(true);
  const [hasAudio, setHasAudio] = useState(true);
  const [videoInput, setVideoInput] = useState(
    localStore.getItemByKey(LOCAL_STORAGE_PREFIX.MEDIA_RECORDING_VIDEO_INPUT)
  );
  const [audioInput, setAudioInput] = useState(
    localStore.getItemByKey(LOCAL_STORAGE_PREFIX.MEDIA_RECORDING_AUDIO_INPUT)
  );
  const [videoEffect, setVideoEffect] = useState(
    localStore.getItemByKey(LOCAL_STORAGE_PREFIX.MEDIA_RECORDING_VIDEO_EFFECT)
  );

  const [mediaDevices, setMediaDevices] = useState([]);

  const [file, setFile] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);

  useEffect(() => {
    if (!mediaDevices.length) {
      return;
    }

    // Video device not set yet, or was detached. Choose first available video device.
    setVideoInput(
      mediaDevices.find((device) => device.deviceId === videoInput)?.deviceId ||
        mediaDevices.find((device) => device.kind === 'videoinput')?.deviceId
    );

    // Audio device not set yet, or was detached. Choose first available audio device.
    setAudioInput(
      mediaDevices.find((device) => device.deviceId === audioInput)?.deviceId ||
        mediaDevices.find((device) => device.kind === 'audioinput')?.deviceId
    );
  }, [audioInput, mediaDevices, videoInput]);

  const [mediaBlobUrl, setMediaBlobUrl] = useState();
  const [originalMediaBlobUrl, setOriginalMediaBlobUrl] = useState();

  const { showSnackbar } = useSnackbar();

  const onStop = useCallback(
    (blob) => {
      try {
        const recordedBlob = createBlob(blob);
        setOriginalMediaBlobUrl(recordedBlob);
        setMediaBlobUrl(recordedBlob);

        const recordedFile = createFile(blob, hasVideo);
        setOriginalFile(recordedFile);
        setFile(recordedFile);
      } catch (e) {
        trackError('media_recording_capture', e.message);
        showSnackbar({
          message: __(
            'There was an error recording a video. Please try again.',
            'web-stories'
          ),
          dismissable: true,
        });
      }
    },
    [showSnackbar, hasVideo]
  );

  const mediaRecorder = useMediaRecorder({
    recordScreen: false,
    // If the device does not have a microphone or camera, this could result
    // in an OverconstrainedError.
    // However, this error can occur even when the user has not yet
    // granted permission, so it's not easy to detect.
    // TODO: Figure out how to retry without microphone if possible.
    mediaStreamConstraints: {
      audio: hasAudio ? (audioInput ? { deviceId: audioInput } : true) : false,
      video: hasVideo ? (videoInput ? { deviceId: videoInput } : true) : false,
    },
    onStop,
  });

  const canvasRecorder = useMediaRecorder({
    recordScreen: false,
    customMediaStream: canvasStream,
    onStop,
  });

  const currentRecorder =
    videoEffect && videoEffect !== 'none' && hasVideo
      ? {
          ...mediaRecorder,
          inputStatus: mediaRecorder.status,
          status: canvasRecorder.status,
          startRecording: canvasRecorder.startRecording,
          pauseRecording: canvasRecorder.pauseRecording,
          resumeRecording: canvasRecorder.resumeRecording,
          stopRecording: canvasRecorder.stopRecording,
          mediaBlob: canvasRecorder.mediaBlob,
          clearMediaBlob: canvasRecorder.clearMediaBlob,
          getMediaStream: async () => {
            canvasRecorder.clearMediaStream();
            await mediaRecorder.getMediaStream();
          },
        }
      : {
          ...mediaRecorder,
          inputStatus: mediaRecorder.status,
        };

  const {
    error,
    inputStatus,
    status,
    mediaBlob,
    stopRecording: originalStopRecording,
    startRecording,
    liveStream,
    getMediaStream,
    clearMediaStream,
    clearMediaBlob,
    muteAudio,
    unMuteAudio,
    pauseRecording,
    resumeRecording,
  } = currentRecorder;

  const isRecording = 'recording' === status;

  const onTrimmed = useCallback((trimmedFile) => {
    setMediaBlobUrl(createBlob(trimmedFile));
    setFile(trimmedFile);
  }, []);

  const {
    trimData,
    isAdjustingTrim,
    isProcessingTrim,
    startTrim,
    onTrim,
    resetTrim,
    cancelTrim,
  } = useTrim({ setDuration, onTrimmed, file: originalFile, isRecording });

  useEffect(() => {
    if (
      error?.name === 'NotFoundError' ||
      error?.name === 'NotReadableError' ||
      error?.name === 'OverConstrainedError'
    ) {
      setHasVideo(false);
      setVideoInput(null);
    }
  }, [error]);

  const speak = useLiveRegion();

  const stopRecording = useCallback(() => {
    setIsProcessing(true);
    originalStopRecording();
    speak(__('Recording stopped', 'web-stories'));
  }, [originalStopRecording, speak]);

  const updateMediaDevices = useCallback(async () => {
    // navigator.mediaDevices is undefined in insecure browsing contexts.
    if (!navigator.mediaDevices) {
      return;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setMediaDevices(
        devices
          .filter((device) => device.kind !== 'audiooutput')
          // Label is empty if permissions somehow changed meantime,
          // remove these devices from the list.
          .filter((device) => device.label)
      );
    } catch (err) {
      // Do nothing for now.
    }
  }, []);

  useEffect(() => {
    // navigator.mediaDevices is undefined in insecure browsing contexts.
    if (!navigator.mediaDevices) {
      return undefined;
    }

    // Note: Safari will fire the devicechange event right after granting permissions,
    // and then calling enumerateDevices() will trigger another permission prompt.
    // TODO: Figure out a good way to work around that.
    navigator.mediaDevices.addEventListener('devicechange', updateMediaDevices);

    return () => {
      navigator.mediaDevices.removeEventListener(
        'devicechange',
        updateMediaDevices
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- We only want to run it once.
  }, []);

  const toggleVideo = useCallback(() => {
    setHasVideo(!hasVideo);
  }, [hasVideo]);

  const toggleAudio = useCallback(() => {
    setHasAudio(!hasAudio);
    if (hasAudio) {
      muteAudio();
    } else {
      unMuteAudio();
    }
  }, [hasAudio, muteAudio, unMuteAudio]);

  const previousBlobUrl = usePrevious(mediaBlobUrl);

  useEffect(() => {
    if (
      previousBlobUrl &&
      previousBlobUrl !== mediaBlobUrl &&
      previousBlobUrl !== originalMediaBlobUrl
    ) {
      revokeBlob(previousBlobUrl);
    }
  }, [mediaBlobUrl, previousBlobUrl, originalMediaBlobUrl]);

  useEffect(() => {
    let timeout;

    if (duration >= 0 && isRecording) {
      timeout = setTimeout(() => setDuration((seconds) => seconds + 1), 1000);
    }

    return () => clearTimeout(timeout);
  }, [duration, isRecording]);

  useEffect(() => {
    let timeout;

    if (countdown > 0) {
      timeout = setTimeout(() => setCountdown(countdown - 1), 1000);
    }

    return () => clearTimeout(timeout);
  }, [countdown]);

  useEffect(() => {
    if (duration > MAX_RECORDING_DURATION_IN_SECONDS) {
      stopRecording();
    }
  }, [duration, stopRecording]);

  const resetStream = useCallback(() => {
    // clearMediaStream() is supposed to do this, but it doesn't have an effect.
    // Probably because liveStream is a new MediaStream instance.
    // Anyway, this stops the camera/mic from being used.
    if (liveStream) {
      liveStream.getTracks().forEach((track) => track.stop());
    }
    if (canvasRecorder.liveStream) {
      canvasRecorder.liveStream.getTracks().forEach((track) => track.stop());
    }

    clearMediaBlob();
    clearMediaStream();

    canvasRecorder.clearMediaStream();
  }, [clearMediaBlob, clearMediaStream, liveStream, canvasRecorder]);

  const resetState = useCallback(() => {
    setFile(null);
    setIsGif(false);
    setMediaBlobUrl(null);
    setCountdown(0);
    setIsProcessing(false);
    setDuration(0);
    resetTrim();

    resetStream();
  }, [resetStream, resetTrim]);

  const toggleRecordingMode = useCallback(() => {
    setIsInRecordingMode((state) => !state);
    if (canvasRecorder.status === 'recording') {
      stopRecording();
    } else {
      resetState();
      if (isInRecordingMode === true) {
        canvasRecorder.clearMediaStream();
      }
    }
  }, [resetState, canvasRecorder, isInRecordingMode, stopRecording]);

  const toggleSettings = useCallback(
    () => setIsSettingsOpen((state) => !state),
    []
  );

  const toggleIsGif = useCallback(() => setIsGif((state) => !state), []);

  const isCountingDown = countdown > 0;
  const wasCountingDown = usePrevious(isCountingDown);

  const value = useMemo(
    () => ({
      state: {
        isInRecordingMode,
        hasVideo,
        hasAudio,
        mediaDevices,
        audioInput,
        videoInput,
        videoEffect,
        isSettingsOpen,
        error,
        inputStatus,
        status,
        mediaBlob,
        mediaBlobUrl,
        originalMediaBlobUrl,
        liveStream,
        file,
        isGif,
        duration,
        countdown,
        isProcessing,
        isCountingDown: isCountingDown || wasCountingDown,
        trimData,
        isAdjustingTrim,
        streamNode,
        isProcessingTrim,
        canvasStream,
        canvasNode,
      },
      actions: {
        toggleRecordingMode,
        setMediaBlobUrl,
        toggleVideo,
        toggleAudio,
        toggleSettings,
        toggleIsGif,
        setAudioInput,
        setVideoInput,
        setVideoEffect,
        updateMediaDevices,
        stopRecording,
        startRecording,
        getMediaStream,
        clearMediaStream,
        clearMediaBlob,
        setFile,
        muteAudio,
        unMuteAudio,
        setDuration,
        setCountdown,
        resetState,
        resetStream,
        onTrim,
        startTrim,
        setStreamNode,
        pauseRecording,
        resumeRecording,
        cancelTrim,
        setCanvasStream,
        setCanvasNode,
      },
    }),
    [
      isInRecordingMode,
      hasVideo,
      hasAudio,
      mediaDevices,
      audioInput,
      videoInput,
      videoEffect,
      isSettingsOpen,
      error,
      inputStatus,
      status,
      mediaBlob,
      mediaBlobUrl,
      originalMediaBlobUrl,
      liveStream,
      file,
      isGif,
      duration,
      countdown,
      isCountingDown,
      wasCountingDown,
      isProcessing,
      trimData,
      isAdjustingTrim,
      streamNode,
      isProcessingTrim,
      toggleRecordingMode,
      toggleVideo,
      toggleAudio,
      toggleSettings,
      toggleIsGif,
      updateMediaDevices,
      stopRecording,
      startRecording,
      getMediaStream,
      clearMediaStream,
      clearMediaBlob,
      muteAudio,
      unMuteAudio,
      resetState,
      resetStream,
      onTrim,
      startTrim,
      setStreamNode,
      pauseRecording,
      resumeRecording,
      cancelTrim,
      canvasStream,
      setCanvasStream,
      canvasNode,
      setCanvasNode,
    ]
  );

  return (
    <MediaRecordingContext.Provider value={value}>
      {children}
    </MediaRecordingContext.Provider>
  );
}

MediaRecordingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MediaRecordingProvider;
