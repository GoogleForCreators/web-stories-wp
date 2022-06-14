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
} from '@googleforcreators/design-system';
import { blobToFile, createBlob, revokeBlob } from '@googleforcreators/media';
import { format } from '@googleforcreators/date';

/**
 * Internal dependencies
 */
import MediaRecordingContext from './context';
import { MAX_RECORDING_DURATION_IN_SECONDS } from './constants';

function MediaRecordingProvider({ children }) {
  const [isInRecordingMode, setIsInRecordingMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [countdown, setCountdown] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isGif, setIsGif] = useState(false);

  const [hasAudio, setHasAudio] = useState(true);
  const [videoInput, setVideoInput] = useState(
    localStore.getItemByKey(LOCAL_STORAGE_PREFIX.MEDIA_RECORDING_VIDEO_INPUT)
  );
  const [audioInput, setAudioInput] = useState(
    localStore.getItemByKey(LOCAL_STORAGE_PREFIX.MEDIA_RECORDING_AUDIO_INPUT)
  );

  const [mediaDevices, setMediaDevices] = useState([]);

  const [file, setFile] = useState(null);

  const updateMediaDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setMediaDevices(
        devices.filter((device) => device.kind !== 'audiooutput')
      );
    } catch (err) {
      // Do nothing for now.
    }
  }, []);

  useEffect(() => {
    if (!mediaDevices.length) {
      return;
    }

    const videoDeviceExists =
      videoInput &&
      mediaDevices.some((device) => device.deviceId === videoInput);

    // Video device not set yet, or was detached. Choose first available video device.
    if (!videoInput || !videoDeviceExists) {
      setVideoInput(
        mediaDevices.find((device) => device.kind === 'videoinput')?.deviceId
      );
    }

    const audioDeviceExists =
      audioInput &&
      mediaDevices.some((device) => device.deviceId === audioInput);

    // Audio device not set yet, or was detached. Choose first available audio device.
    if (!audioInput || !audioDeviceExists) {
      setAudioInput(
        mediaDevices.find((device) => device.kind === 'audioinput')?.deviceId
      );
    }
  }, [audioInput, mediaDevices, videoInput]);

  useEffect(() => {
    navigator.mediaDevices.addEventListener('devicechange', updateMediaDevices);

    return () => {
      navigator.mediaDevices.removeEventListener(
        'devicechange',
        updateMediaDevices
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- We only want to run it once.
  }, []);

  const [mediaBlobUrl, setMediaBlobUrl] = useState();

  const onStop = useCallback((blob) => {
    try {
      setMediaBlobUrl(createBlob(blob));
    } catch (e) {
      // Do nothing.
    }
    const f = blobToFile(
      blob,
      `webcam-capture-${format(new Date(), 'Y-m-d-H-i')}.mp4`,
      'video/mp4'
    );
    setFile(f);
  }, []);

  const {
    error,
    status,
    mediaBlob,
    stopRecording,
    startRecording,
    liveStream,
    getMediaStream,
    clearMediaStream,
    clearMediaBlob,
    muteAudio,
    unMuteAudio,
  } = useMediaRecorder({
    recordScreen: false,
    mediaStreamConstraints: {
      audio: audioInput && hasAudio ? { deviceId: audioInput } : false,
      video: videoInput ? { deviceId: videoInput } : true,
    },
    onStop,
  });

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

  const resetState = useCallback(() => {
    setFile(null);
    setIsGif(false);
    setMediaBlobUrl(null);
    setCountdown(0);

    // clearMediaStream() is supposed to do this, but it doesn't have an effect.
    // Probably because liveStream is a new MediaStream instance.
    // Anyway, this stops the camera/mic from being used.
    if (liveStream) {
      liveStream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    clearMediaBlob();
    clearMediaStream();
  }, [clearMediaBlob, clearMediaStream, liveStream]);

  const toggleRecordingMode = useCallback(() => {
    setIsInRecordingMode((state) => !state);
    resetState();
  }, [resetState]);

  const toggleSettings = useCallback(() => {
    setIsSettingsOpen((state) => !state);
  }, []);

  const toggleIsGif = useCallback(() => {
    setIsGif((state) => !state);
  }, []);

  const isCountingDown = countdown > 0;
  const wasCountingDown = usePrevious(isCountingDown);

  const value = useMemo(
    () => ({
      state: {
        isInRecordingMode,
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
      },
    }),
    [
      isInRecordingMode,
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
