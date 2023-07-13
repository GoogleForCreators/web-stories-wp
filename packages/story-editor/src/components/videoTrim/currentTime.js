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
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import Slider from './slider';
import useVideoTrim from './useVideoTrim';

const StyledSlider = styled(Slider)`
  top: -3px;
  bottom: -3px;
  width: 6px;
  margin-left: -3px;
  border-radius: 6px;
  border-width: 0;
  background-color: ${({ theme }) => theme.colors.interactiveBg.primaryNormal};
  box-shadow:
    0px 1px 2px rgba(60, 64, 67, 0.3),
    0px 1px 3px 1px rgba(60, 64, 67, 0.15);
`;

function CurrentTime(props) {
  const currentTime = useVideoTrim(({ state: { currentTime } }) => currentTime);
  return (
    <StyledSlider
      aria-label={__('Current time', 'web-stories')}
      value={currentTime}
      disabled
      {...props}
    />
  );
}

export default CurrentTime;
