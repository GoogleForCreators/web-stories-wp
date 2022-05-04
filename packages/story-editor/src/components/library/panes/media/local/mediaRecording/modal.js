/*
 * Copyright 2021 Google LLC
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
import { __ } from '@googleforcreators/i18n';
import {
  Text,
  Toggle,
  Button,
  THEME_CONSTANTS,
  BUTTON_TYPES,
  BUTTON_SIZES,
  DropDown,
  localStore,
  LOCAL_STORAGE_PREFIX,
} from '@googleforcreators/design-system';
import {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from '@googleforcreators/react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import useMediaRecorder from '@wmik/use-media-recorder';
import { blobToFile } from '@googleforcreators/media';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import Dialog from '../../../../../dialog';
import useUploadWithPreview from '../../../../../canvas/useUploadWithPreview';
import { ImageCapture } from './imageCapture';

const Video = styled.video`
  width: 100%;
  height: 100%;
`;

const VideoWrapper = styled.div`
  width: 240px;
  aspect-ratio: 9 / 16;
  background: #000;
  margin: 0 auto;
`;

function Modal({ isOpen, onClose }) {
  const videoRef = useRef();
  const [file, setFile] = useState(null);
  const [isImageCapture, setIsImageCapture] = useState(false);
  const [enableVideo, setEnableVideo] = useState(true);
  const [enableAudio, setEnableAudio] = useState(true);
  const [videoInput, setVideoInput] = useState(
    localStore.getItemByKey(LOCAL_STORAGE_PREFIX.MEDIA_RECORDING_VIDEO_INPUT)
  );
  const [audioInput, setAudioInput] = useState(
    localStore.getItemByKey(LOCAL_STORAGE_PREFIX.MEDIA_RECORDING_AUDIO_INPUT)
  );
  const [mediaDevices, setMediaDevices] = useState([]);

  const updateMediaDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setMediaDevices(
        devices.filter((device) => device.kind !== 'audiooutput')
      );
    } catch (err) {
      // eslint-disable-next-line no-console -- TODO: Figure out error handling.
      console.log(err);
    }
  }, []);

  useEffect(() => {
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

  const videoInputs = mediaDevices
    .filter((device) => device.kind === 'videoinput')
    .map(({ deviceId, label }) => ({ value: deviceId, label }));
  const audioInputs = mediaDevices
    .filter((device) => device.kind === 'audioinput')
    .map(({ deviceId, label }) => ({ value: deviceId, label }));

  const onStop = useCallback((blob) => {
    const f = blobToFile(blob, 'test-recording.webm', 'video/webm');
    setFile(f);
  }, []);

  const uploadWithPreview = useUploadWithPreview();
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
  } = useMediaRecorder({
    recordScreen: false,
    blobOptions: { type: 'video/webm' },
    mediaStreamConstraints: {
      audio: audioInput && enableAudio ? { deviceId: audioInput } : enableAudio,
      video: videoInput && enableVideo ? { deviceId: videoInput } : enableVideo,
    },
    onStop: onStop,
  });

  const isIdle = status === 'idle';
  const isRecording = status === 'recording';

  // Try to get permissions as soon as the modal opens.
  useEffect(() => {
    if (isOpen && isIdle) {
      getMediaStream();
    }
  }, [isOpen, isIdle, getMediaStream]);

  const onChangeVideoInput = useCallback(
    (_event, value) => {
      setVideoInput(value);
      localStore.setItemByKey(
        LOCAL_STORAGE_PREFIX.MEDIA_RECORDING_VIDEO_INPUT,
        value
      );

      if (isRecording) {
        stopRecording();
        startRecording();
      }
    },
    [stopRecording, startRecording, isRecording]
  );

  const onChangeAudioInput = useCallback(
    (_event, value) => {
      setAudioInput(value);
      localStore.setItemByKey(
        LOCAL_STORAGE_PREFIX.MEDIA_RECORDING_AUDIO_INPUT,
        value
      );

      if (isRecording) {
        stopRecording();
        startRecording();
      }
    },
    [stopRecording, startRecording, isRecording]
  );

  useEffect(() => {
    if (status === 'ready') {
      updateMediaDevices();
    }
  }, [status, updateMediaDevices]);

  const handleClose = useCallback(() => {
    clearMediaStream();
    clearMediaBlob();
    onClose();
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsImageCapture(false);
  }, [clearMediaBlob, clearMediaStream, onClose]);

  const onImageCapture = (f) => {
    setFile(f);
    setIsImageCapture(true);
  };

  const onClearImageCapture = () => setIsImageCapture(false);

  const onInsert = useCallback(() => {
    uploadWithPreview([file]);
    onClose();

    // handling cleanup for Image capture
    // in this case we don't want onStop to override the file
    if (isRecording) {
      stopRecording();
      setIsImageCapture(false);
      setFile(null);
    }
  }, [file, uploadWithPreview, onClose, isRecording, stopRecording]);

  useEffect(() => {
    if (videoRef.current && liveStream) {
      videoRef.current.srcObject = liveStream;
    }
  }, [liveStream]);

  const videoToggleId = useMemo(() => `toggle_${uuidv4()}`, []);
  const audioToggleId = useMemo(() => `toggle_${uuidv4()}`, []);

  const primaryText = __('Insert', 'web-stories');

  return (
    <Dialog
      onClose={handleClose}
      isOpen={isOpen}
      title={__('Record video / audio', 'web-stories')}
      onPrimary={onInsert}
      primaryText={primaryText}
      secondaryText={__('Cancel', 'web-stories')}
      primaryRest={{
        disabled: status !== 'stopped' && isImageCapture === false,
      }}
    >
      <Text>
        {__(
          'Record content for your story using your camera / microphone.',
          'web-stories'
        )}
      </Text>
      <Text>{error ? `${status} ${error.message}` : status}</Text>
      {!isImageCapture && (
        <VideoWrapper>
          {mediaBlob && !liveStream && (
            <>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption, styled-components-a11y/media-has-caption -- No captions for video being recorded. */}
              <Video src={URL.createObjectURL(mediaBlob)} autoPlay controls />
            </>
          )}
          {/* eslint-disable-next-line jsx-a11y/media-has-caption, styled-components-a11y/media-has-caption -- No captions for video being recorded. */}
          {!mediaBlob && liveStream && <Video ref={videoRef} autoPlay />}
        </VideoWrapper>
      )}

      {isRecording && (
        <ImageCapture
          videoRef={videoRef}
          onCapture={onImageCapture}
          onClear={isImageCapture ? onClearImageCapture : null}
        />
      )}

      <Text
        as="label"
        htmlFor={videoToggleId}
        size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
      >
        {__('Camera', 'web-stories')}
      </Text>
      <Toggle
        id={videoToggleId}
        aria-label={__('Enable camera', 'web-stories')}
        name={videoToggleId}
        checked={enableVideo}
        onChange={() => setEnableVideo((value) => !value)}
        disabled={!videoInput}
      />
      <Text
        as="label"
        htmlFor={audioToggleId}
        size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
      >
        {__('Microphone', 'web-stories')}
      </Text>
      <Toggle
        id={audioToggleId}
        aria-label={__('Enable microphone', 'web-stories')}
        name={audioToggleId}
        checked={enableAudio}
        onChange={() => setEnableAudio((value) => !value)}
        disabled={!audioInput}
      />

      {videoInputs.length > 0 && (
        <DropDown
          ariaLabel={__('Video Input', 'web-stories')}
          placeholder={__('Select Video Input', 'web-stories')}
          options={videoInputs}
          onMenuItemClick={onChangeVideoInput}
          selectedValue={videoInput}
          disabled={!enableVideo}
          popupZIndex={11}
        />
      )}
      {audioInputs.length > 0 && (
        <DropDown
          ariaLabel={__('Audio Input', 'web-stories')}
          placeholder={__('Select Audio Input', 'web-stories')}
          options={audioInputs}
          onMenuItemClick={onChangeAudioInput}
          selectedValue={audioInput}
          disabled={!enableAudio}
          popupZIndex={11}
        />
      )}
      <Button
        type={BUTTON_TYPES.PRIMARY}
        size={BUTTON_SIZES.SMALL}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={false}
      >
        {isRecording
          ? __('Stop recording', 'web-stories')
          : __('Start recording', 'web-stories')}
      </Button>
    </Dialog>
  );
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default Modal;
