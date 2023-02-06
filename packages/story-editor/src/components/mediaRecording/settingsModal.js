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
  DropDown,
  localStore,
  LOCAL_STORAGE_PREFIX,
  TextSize,
} from '@googleforcreators/design-system';
import { useState, useCallback, useEffect } from '@googleforcreators/react';
import styled from 'styled-components';
import { trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import Dialog from '../dialog';
import useMediaRecording from './useMediaRecording';
import { SETTINGS_POPUP_ZINDEX, VIDEO_EFFECTS } from './constants';

const Row = styled.div`
  margin-bottom: 16px;
`;

const Label = styled(Text.Paragraph).attrs({
  as: 'label',
  size: TextSize.Small,
})`
  display: inline-block;
  margin-bottom: 8px;
`;

function SettingsModal() {
  const {
    mediaDevices,
    hasAudio,
    videoInput,
    audioInput,
    videoEffect,
    isSettingsOpen,
    setAudioInput,
    setVideoInput,
    setVideoEffect,
    clearMediaStream,
    clearMediaBlob,
    toggleSettings,
  } = useMediaRecording(({ state, actions }) => ({
    mediaDevices: state.mediaDevices,
    hasAudio: state.hasAudio,
    videoInput: state.videoInput,
    audioInput: state.audioInput,
    videoEffect: state.videoEffect,
    isSettingsOpen: state.isSettingsOpen,
    setAudioInput: actions.setAudioInput,
    setVideoInput: actions.setVideoInput,
    setVideoEffect: actions.setVideoEffect,
    clearMediaStream: actions.clearMediaStream,
    clearMediaBlob: actions.clearMediaBlob,
    toggleSettings: actions.toggleSettings,
  }));

  const [localVideoInput, setLocalVideoInput] = useState(videoInput);
  const [localAudioInput, setLocalAudioInput] = useState(audioInput);
  const [localVideoEffect, setLocalVideoEffect] = useState(videoEffect);

  useEffect(() => setLocalVideoInput(videoInput), [videoInput]);
  useEffect(() => setLocalAudioInput(audioInput), [audioInput]);

  const onSaveChanges = useCallback(() => {
    toggleSettings();

    setVideoInput(localVideoInput);
    localStore.setItemByKey(
      LOCAL_STORAGE_PREFIX.MEDIA_RECORDING_VIDEO_INPUT,
      localVideoInput
    );

    setAudioInput(localAudioInput);
    localStore.setItemByKey(
      LOCAL_STORAGE_PREFIX.MEDIA_RECORDING_AUDIO_INPUT,
      localAudioInput
    );

    setVideoEffect(localVideoEffect);
    localStore.setItemByKey(
      LOCAL_STORAGE_PREFIX.MEDIA_RECORDING_VIDEO_EFFECT,
      localVideoEffect
    );

    if (
      videoInput !== localVideoInput ||
      audioInput !== localAudioInput ||
      videoEffect !== localVideoEffect
    ) {
      trackEvent('media_recording_settings_changed');
      clearMediaStream();
      clearMediaBlob();
    }
  }, [
    audioInput,
    clearMediaBlob,
    clearMediaStream,
    localAudioInput,
    localVideoInput,
    localVideoEffect,
    setAudioInput,
    setVideoInput,
    setVideoEffect,
    toggleSettings,
    videoInput,
    videoEffect,
  ]);

  const videoInputs = mediaDevices
    .filter((device) => device.kind === 'videoinput')
    .map(({ deviceId, label }) => ({ value: deviceId, label }));
  const audioInputs = mediaDevices
    .filter((device) => device.kind === 'audioinput')
    .map(({ deviceId, label }) => ({ value: deviceId, label }));
  const videoEffects = [
    { value: VIDEO_EFFECTS.NONE, label: __('None', 'web-stories') },
    { value: VIDEO_EFFECTS.BLUR, label: __('Background blur', 'web-stories') },
  ];

  const onChangeVideoInput = useCallback(
    (_event, value) => setLocalVideoInput(value),
    []
  );

  const onChangeAudioInput = useCallback(
    (evt, value) => setLocalAudioInput(value),
    []
  );

  const onChangeVideoEffect = useCallback(
    (_event, value) => setLocalVideoEffect(value),
    []
  );

  const onClose = useCallback(() => {
    toggleSettings();
    // Reset local state after closing dialog.
    setLocalVideoInput(videoInput);
    setLocalAudioInput(audioInput);
  }, [audioInput, toggleSettings, videoInput]);

  return (
    <Dialog
      onClose={onClose}
      isOpen={isSettingsOpen}
      contentLabel={__('Media Recording Options', 'web-stories')}
      title={__('Options', 'web-stories')}
      onPrimary={onSaveChanges}
      primaryText={__('Save', 'web-stories')}
      secondaryText={__('Cancel', 'web-stories')}
    >
      <Row>
        <Text.Paragraph>
          {__(
            'Choose the camera and microphone to use for the recording.',
            'web-stories'
          )}
        </Text.Paragraph>
      </Row>

      {videoInputs.length > 0 && (
        <Row>
          <Label htmlFor="camera">{__('Camera', 'web-stories')}</Label>
          <DropDown
            id="camera"
            ariaLabel={__('Video Input', 'web-stories')}
            placeholder={__('Select Video Input', 'web-stories')}
            options={videoInputs}
            onMenuItemClick={onChangeVideoInput}
            selectedValue={localVideoInput}
            popupZIndex={SETTINGS_POPUP_ZINDEX}
          />
        </Row>
      )}
      {audioInputs.length > 0 && (
        <Row>
          <Label htmlFor="microphone">{__('Microphone', 'web-stories')}</Label>
          <DropDown
            id="microphone"
            ariaLabel={__('Audio Input', 'web-stories')}
            placeholder={__('Select Audio Input', 'web-stories')}
            options={audioInputs}
            onMenuItemClick={onChangeAudioInput}
            selectedValue={localAudioInput}
            disabled={!hasAudio}
            popupZIndex={SETTINGS_POPUP_ZINDEX}
          />
        </Row>
      )}
      {videoInputs.length > 0 && (
        <Row>
          <Label htmlFor="video-effect">
            {__('Video Effect', 'web-stories')}
          </Label>
          <DropDown
            id="video-effect"
            ariaLabel={__('Video Effect', 'web-stories')}
            placeholder={__('Select Video Effect', 'web-stories')}
            options={videoEffects}
            onMenuItemClick={onChangeVideoEffect}
            selectedValue={localVideoEffect}
            popupZIndex={SETTINGS_POPUP_ZINDEX}
          />
        </Row>
      )}
    </Dialog>
  );
}

export default SettingsModal;
