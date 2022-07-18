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
import { useEffect } from '@googleforcreators/react';

function useTrimmedReplay({ videoRef, trimData, isActive }) {
  useEffect(() => {
    const videoNode = videoRef.current;
    if (!videoNode || !trimData.end || !isActive) {
      return undefined;
    }

    function onTimeUpdate(evt) {
      const currentOffset = evt.target.currentTime * 1000;

      // If we're before the start offset (with a buffer), move up and keep playing
      if (currentOffset < trimData.start - 0.5) {
        videoNode.currentTime = trimData.start / 1000;
        videoNode.play().catch(() => {});
      }

      // If we've reached the end of the trim section, seek to the proper start
      // offset and pause if not looping
      if (currentOffset > trimData.end) {
        videoNode.currentTime = trimData.start / 1000;
        if (videoNode.loop) {
          videoNode.play().catch(() => {});
        } else {
          videoNode.pause();
        }
      }
    }

    videoNode.addEventListener('timeupdate', onTimeUpdate);

    return () => videoNode.removeEventListener('timeupdate', onTimeUpdate);
  }, [videoRef, trimData, isActive]);
}

export default useTrimmedReplay;
