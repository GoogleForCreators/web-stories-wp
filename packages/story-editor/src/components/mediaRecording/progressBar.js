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
 * External dependencies
 */
import styled from 'styled-components';
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import useMediaRecording from './useMediaRecording';
import { MAX_RECORDING_DURATION_IN_SECONDS } from './constants';

const ProgressIndicator = styled.progress`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  width: 100%;
  height: 8px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  background-color: ${({ theme }) => rgba(theme.colors.fg.primary, 0.3)};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

  &::-webkit-progress-bar {
    background-color: ${({ theme }) => rgba(theme.colors.fg.primary, 0.3)};
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  &::-webkit-progress-value {
    background-color: ${({ theme }) => theme.colors.fg.primary};
    border-top-left-radius: 5px;
  }

  &::-moz-progress-bar {
    background-color: ${({ theme }) => theme.colors.fg.primary};
    border-top-left-radius: 5px;
  }
`;

function ProgressBar() {
  const { duration, isRecording } = useMediaRecording(({ state }) => ({
    duration: state.duration,
    isRecording: state.status === 'recording',
  }));

  if (!isRecording) {
    return null;
  }

  return (
    <ProgressIndicator
      value={duration}
      max={MAX_RECORDING_DURATION_IN_SECONDS}
    />
  );
}

export default ProgressBar;
