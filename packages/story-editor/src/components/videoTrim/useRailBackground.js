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
import { useState, useEffect } from '@googleforcreators/react';
import { generateVideoStrip } from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import { RAIL_HEIGHT } from './constants';

function useRailBackground(isReady, videoData, railWidth) {
  const [railBackgroundImage, setRailBackgroundImage] = useState(null);
  useEffect(() => {
    if (!isReady) {
      return;
    }
    const { element, resource } = videoData;
    generateVideoStrip(element, resource, railWidth, RAIL_HEIGHT).then(
      setRailBackgroundImage
    );
  }, [isReady, videoData, railWidth]);

  return railBackgroundImage;
}

export default useRailBackground;
