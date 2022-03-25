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
  const [enableVideo, setEnableVideo] = useState(true);
  const [enableAudio, setEnableAudio] = useState(true);

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
    clearMediaStream,
    clearMediaBlob,
  } = useMediaRecorder({
    recordScreen: false,
    blobOptions: { type: 'video/webm' },
    mediaStreamConstraints: {
      audio: enableAudio,
      video: enableVideo,
    },
    onStop: onStop,
  });

  const handleClose = useCallback(() => {
    clearMediaStream();
    clearMediaBlob();
    onClose();
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [clearMediaBlob, clearMediaStream, onClose]);

  const onInsert = useCallback(() => {
    uploadWithPreview([file]);
    onClose();
  }, [file, uploadWithPreview, onClose]);

  useEffect(() => {
    if (videoRef.current && liveStream) {
      videoRef.current.srcObject = liveStream;
    }
  }, [liveStream]);

  const isRecording = status === 'recording';

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
      primaryRest={{ disabled: status !== 'stopped' }}
    >
      <Text>
        {__(
          'Record content for your story using your camera / microphone.',
          'web-stories'
        )}
      </Text>
      <Text>{error ? `${status} ${error.message}` : status}</Text>
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
      />
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
