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
 * Internal dependencies
 */
import MediaRecordingContext from '../context';
import SettingsModal from '../settingsModal';

export default {
  title: 'Stories Editor/Components/Media Recording/Settings Dialog',
  component: SettingsModal,
  args: {
    mediaDevices: [
      {
        kind: 'videoinput',
        deviceId: 'video-a',
        label: 'Video Device A',
      },
      {
        kind: 'videoinput',
        deviceId: 'video-b',
        label: 'Video Device B',
      },
      {
        kind: 'videoinput',
        deviceId: 'video-c',
        label: 'Video Device C',
      },
      {
        kind: 'audioinput',
        deviceId: 'audio-a',
        label: 'Video Device A',
      },
      {
        kind: 'audioinput',
        deviceId: 'audio-b',
        label: 'Audio Device B',
      },
      {
        kind: 'audioinput',
        deviceId: 'audio-c',
        label: 'Audio Device C',
      },
    ],
    videoInput: 'video-b',
    audioInput: 'audio-c',
  },
  argTypes: {
    toggleSettings: { action: 'Settings toggled' },
  },
  parameters: {
    backgrounds: {
      default: 'Dark',
    },
  },
};

export const _default = (args) => {
  return (
    <MediaRecordingContext.Provider
      value={{
        state: {
          hasAudio: true,
          isSettingsOpen: true,
          ...args,
        },
        actions: {
          setAudioInput: () => {},
          setVideoInput: () => {},
          clearMediaStream: () => {},
          clearMediaBlob: () => {},
          ...args,
        },
      }}
    >
      <SettingsModal />
    </MediaRecordingContext.Provider>
  );
};
