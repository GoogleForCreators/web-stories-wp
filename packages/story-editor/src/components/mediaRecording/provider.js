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
import {
  MAX_RECORDING_DURATION_IN_SECONDS,
  VIDEO_FILE_TYPE,
  VIDEO_MIME_TYPE,
  AUDIO_FILE_TYPE,
  AUDIO_MIME_TYPE,
} from './constants';

function MediaRecordingProvider({ children }) {
  const [isInRecordingMode, setIsInRecordingMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [countdown, setCountdown] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isGif, setIsGif] = useState(false);

  const [hasVideo, setHasVideo] = useState(true);
  const [hasAudio, setHasAudio] = useState(true);
  const FILE_TYPE = hasVideo ? VIDEO_FILE_TYPE : AUDIO_FILE_TYPE;
  const MIME_TYPE = hasVideo ? VIDEO_MIME_TYPE : AUDIO_MIME_TYPE;
  const [videoInput, setVideoInput] = useState(
    localStore.getItemByKey(LOCAL_STORAGE_PREFIX.MEDIA_RECORDING_VIDEO_INPUT)
  );
  const [audioInput, setAudioInput] = useState(
    localStore.getItemByKey(LOCAL_STORAGE_PREFIX.MEDIA_RECORDING_AUDIO_INPUT)
  );

  const [mediaDevices, setMediaDevices] = useState([]);

  const [file, setFile] = useState(null);

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

  const { showSnackbar } = useSnackbar();

  const onStop = useCallback(
    (blob) => {
      try {
        setMediaBlobUrl(createBlob(blob));
      } catch (e) {
        trackError('media_recording_capture', e.message);
        showSnackbar({
          message: __(
            ' There was an error taking a photo. Please try again.',
            'web-stories'
          ),
          dismissable: true,
        });
      }
      const f = blobToFile(
        blob,
        `webcam-capture-${format(new Date(), 'Y-m-d-H-i')}.${FILE_TYPE}`,
        MIME_TYPE
      );
      setFile(f);
    },
    [showSnackbar, FILE_TYPE, MIME_TYPE]
  );

  const {
    error,
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
  } = useMediaRecorder({
    recordScreen: false,
    // If the device does not have a microphone or camera, this could result
    // in an OverconstrainedError.
    // However, this error can occur even when the user has not yet
    // granted permission, so it's not easy to detect.
    // TODO: Figure out how to retry without microphone if possible.
    mediaStreamConstraints: {
      audio: audioInput && hasAudio ? { deviceId: audioInput } : false,
      video: videoInput && hasVideo ? { deviceId: videoInput } : false,
    },
    onStop,
  });

  const speak = useLiveRegion();

  const stopRecording = useCallback(() => {
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
    if (previousBlobUrl && previousBlobUrl !== mediaBlobUrl) {
      revokeBlob(previousBlobUrl);
    }
  }, [mediaBlobUrl, previousBlobUrl]);

  const isRecording = 'recording' === status;

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

    clearMediaBlob();
    clearMediaStream();
  }, [clearMediaBlob, clearMediaStream, liveStream]);

  const resetState = useCallback(() => {
    setFile(null);
    setIsGif(false);
    setMediaBlobUrl(null);
    setCountdown(0);

    resetStream();
  }, [resetStream]);

  const toggleRecordingMode = useCallback(() => {
    setIsInRecordingMode((state) => !state);
    resetState();
  }, [resetState]);

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
        isSettingsOpen,
        error,
        status,
        mediaBlob,
        mediaBlobUrl,
        liveStream,
        file,
        isGif,
        duration,
        countdown,
        isCountingDown: isCountingDown || wasCountingDown,
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
      },
    }),
    [
      isInRecordingMode,
      hasVideo,
      hasAudio,
      mediaDevices,
      audioInput,
      videoInput,
      isSettingsOpen,
      error,
      status,
      mediaBlob,
      mediaBlobUrl,
      liveStream,
      file,
      isGif,
      duration,
      countdown,
      isCountingDown,
      wasCountingDown,
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
