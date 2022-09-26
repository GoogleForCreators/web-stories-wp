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
import {
  Text,
  THEME_CONSTANTS,
  TOOLTIP_PLACEMENT,
} from '@googleforcreators/design-system';
import { _n, sprintf } from '@googleforcreators/i18n';
import { getVideoLengthDisplay } from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import Tooltip from '../tooltip';
import useMediaRecording from './useMediaRecording';
import { MAX_RECORDING_DURATION_IN_MINUTES } from './constants';

const Wrapper = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  font-variant-numeric: tabular-nums;

  &:before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 5px;
    border-radius: 100%;
    background-color: ${({ theme }) =>
      theme.colors.interactiveBg.negativeNormal};
  }
`;

function DurationIndicator() {
  const { duration, isRecording } = useMediaRecording(({ state }) => ({
    duration: state.duration,
    isRecording: ['recording', 'paused'].includes(state.status),
  }));

  if (!isRecording) {
    return null;
  }

  return (
    <Tooltip
      position={TOOLTIP_PLACEMENT.TOP}
      title={sprintf(
        /* translators: %s: number of minutes */
        _n(
          'Maximum duration is %d minute',
          'Maximum duration is %d minutes',
          MAX_RECORDING_DURATION_IN_MINUTES,
          'web-stories'
        ),
        MAX_RECORDING_DURATION_IN_MINUTES
      )}
      styleOverride={{
        style: {
          maxWidth: '20em',
        },
      }}
    >
      <Wrapper>{getVideoLengthDisplay(duration)}</Wrapper>
    </Tooltip>
  );
}

export default DurationIndicator;
