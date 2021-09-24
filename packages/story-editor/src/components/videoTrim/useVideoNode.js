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
import {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import { MEDIA_VIDEO_MINIMUM_DURATION } from '../../constants';

function useVideoNode() {
  const [currentTime, setCurrentTime] = useState(null);
  const [startOffset, rawSetStartOffset] = useState(null);
  const [originalStartOffset, setOriginalStartOffset] = useState(null);
  const [endOffset, rawSetEndOffset] = useState(null);
  const [originalEndOffset, setOriginalEndOffset] = useState(null);
  const [maxOffset, setMaxOffset] = useState(null);
  const [videoNode, setVideoNode] = useState(null);

  useEffect(() => {
    if (!videoNode) {
      return undefined;
    }

    function onLoadedMetadata(evt) {
      const duration = Math.floor(evt.target.duration * 1000);
      rawSetStartOffset(0);
      setOriginalStartOffset(0);
      setCurrentTime(0);
      rawSetEndOffset(duration);
      setOriginalEndOffset(duration);
      setMaxOffset(duration);
    }
    function onTimeUpdate(evt) {
      const currentOffset = Math.floor(evt.target.currentTime * 1000);
      setCurrentTime(Math.min(currentOffset, endOffset));
      if (currentOffset >= endOffset) {
        videoNode.currentTime = startOffset / 1000;
        videoNode.play();
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
      // Start offset must be at least this smaller than end offset
      offset = Math.min(endOffset - MEDIA_VIDEO_MINIMUM_DURATION, offset);
      offset = Math.max(0, offset);
      rawSetStartOffset(offset);
      videoNode.currentTime = Math.max(videoNode.currentTime, offset / 1000);
    },
    [videoNode, endOffset]
  );

  const setEndOffset = useCallback(
    (offset) => {
      // End offset must be at least this larger than start offset
      offset = Math.max(startOffset + MEDIA_VIDEO_MINIMUM_DURATION, offset);
      offset = Math.min(maxOffset, offset);
      rawSetEndOffset(offset);
      videoNode.currentTime = Math.min(videoNode.currentTime, offset / 1000);
    },
    [videoNode, startOffset, maxOffset]
  );

  const resetOffsets = useCallback(() => {
    rawSetStartOffset(originalStartOffset);
    rawSetEndOffset(originalEndOffset);
  }, [originalStartOffset, originalEndOffset]);

  const hasChanged = useMemo(
    () =>
      startOffset !== originalStartOffset || endOffset !== originalEndOffset,
    [startOffset, originalStartOffset, endOffset, originalEndOffset]
  );

  return {
    hasChanged,
    currentTime,
    startOffset,
    endOffset,
    maxOffset,
    setStartOffset,
    setEndOffset,
    setVideoNode,
    resetOffsets,
  };
}

export default useVideoNode;
