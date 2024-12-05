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
import type { VideoElement } from '@googleforcreators/elements';
import type { ElementBox } from '@googleforcreators/units';
import type { RefObject } from 'react';

/**
 * Internal dependencies
 */
import PlayPauseButton from './playPauseButton';

interface VideoControlsProps {
  box: ElementBox;
  isActive: boolean;
  isTransforming: boolean;
  elementRef: RefObject<HTMLElement>;
  element: VideoElement;
  isRTL: boolean;
}

function VideoControls({
  box,
  isActive,
  isTransforming,
  elementRef,
  element,
  isRTL,
}: VideoControlsProps) {
  return (
    <PlayPauseButton
      box={box}
      isActive={isActive}
      isTransforming={isTransforming}
      elementRef={elementRef}
      element={element}
      isRTL={isRTL}
    />
  );
}

export default VideoControls;
