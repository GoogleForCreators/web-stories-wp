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
 * Internal dependencies
 */
export { default as MediaRecordingProvider } from './provider';
export { default as useMediaRecording } from './useMediaRecording';
export { default as SettingsModal } from './settingsModal';
export { default as ErrorDialog } from './errorDialog';
export { default as PermissionsDialog } from './permissionsDialog';
export { default as Footer } from './footer';
export { default as VideoMode } from './videoMode';
export { default as ProgressBar } from './progressBar';
export { default as Countdown } from './countdown';
export { default as DurationIndicator } from './durationIndicator';
export { default as PlayPauseButton } from './playPauseButton';
export * from './constants';
export * from './audio';
export {
  LayerWithGrayout,
  DisplayPageArea,
  Wrapper,
  VideoWrapper,
  Video,
  Photo,
} from './components';
