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
import { useEffect, useState, useCallback } from '@web-stories-wp/react';

function useVideoNode() {
  const [currentTime, setCurrentTime] = useState(0);
  const [startOffset, rawSetStartOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(Math.POSITIVE_INFINITY);
  const [endOffset, rawSetEndOffset] = useState(Math.POSITIVE_INFINITY);
  const [videoNode, setVideoNode] = useState(null);

  useEffect(() => {
    if (!videoNode) {
      return undefined;
    }

    function onLoadedMetadata(evt) {
      const duration = Math.floor(evt.target.duration * 1000);
      rawSetEndOffset(duration);
      setMaxOffset(duration);
    }
    function onTimeUpdate(evt) {
      const currentOffset = Math.floor(evt.target.currentTime * 1000);
      setCurrentTime(currentOffset);
      if (currentOffset >= endOffset) {
        setTimeout(() => {
          videoNode.currentTime = startOffset / 1000;
          videoNode.play();
        });
      }
    }
    videoNode.addEventListener('timeupdate', onTimeUpdate);
    videoNode.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      videoNode.removeEventListener('timeupdate', onTimeUpdate);
      videoNode.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [startOffset, endOffset, videoNode]);

  const setStartOffset = useCallback(
    (offset) => {
      // Start offset must be 1 sec smaller than end offset
      offset = Math.min(endOffset - 1000, offset);
      rawSetStartOffset(offset);
      videoNode.currentTime = Math.max(videoNode.currentTime, offset / 1000);
    },
    [videoNode, endOffset]
  );

  const setEndOffset = useCallback(
    (offset) => {
      // End offset must be 1 sec larger than start offset
      offset = Math.max(startOffset + 1000, offset);
      rawSetEndOffset(offset);
      videoNode.currentTime = Math.min(videoNode.currentTime, offset / 1000);
    },
    [videoNode, startOffset]
  );

  return {
    currentTime,
    startOffset,
    endOffset,
    maxOffset,
    setStartOffset,
    setEndOffset,
    setVideoNode,
  };
}

export default useVideoNode;
