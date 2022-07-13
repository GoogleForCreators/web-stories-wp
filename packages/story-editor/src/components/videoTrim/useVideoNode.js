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
  useRef,
} from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { MEDIA_VIDEO_MINIMUM_DURATION } from '../../constants';

function useVideoNode(videoData) {
  const [currentTime, setCurrentTime] = useState(null);
  const [startOffset, rawSetStartOffset] = useState(null);
  const [originalStartOffset, setOriginalStartOffset] = useState(null);
  const [endOffset, rawSetEndOffset] = useState(null);
  const [originalEndOffset, setOriginalEndOffset] = useState(null);
  const [maxOffset, setMaxOffset] = useState(null);
  const [videoNode, setVideoNode] = useState(null);
  const [isDraggingHandles, setIsDraggingHandles] = useState(false);
  // Video plays by default.
  const isPausedTracker = useRef(false);

  useEffect(() => {
    if (!videoNode) {
      return;
    }
    // If the video has been paused manually, skip playing.
    if (isPausedTracker.current) {
      return;
    }
    if (isDraggingHandles) {
      videoNode.pause();
    } else {
      videoNode.currentTime = startOffset / 1000;
      videoNode.play().catch(() => {});
    }
  }, [videoNode, isDraggingHandles, startOffset]);

  const paused = videoNode ? videoNode.paused : null;
  useEffect(() => {
    // Don't change manual tracker while dragging.
    if (isDraggingHandles) {
      return;
    }
    // Update the tracker when the pause state changes while not dragging.
    isPausedTracker.current = paused;
  }, [paused, isDraggingHandles]);

  useEffect(() => {
    if (!videoData) {
      // Reset all the things
      rawSetStartOffset(null);
      setOriginalStartOffset(null);
      setCurrentTime(null);
      rawSetEndOffset(null);
      setOriginalEndOffset(null);
      setMaxOffset(null);
    }
  }, [videoData]);

  useEffect(() => {
    if (!videoNode || !videoData) {
      return undefined;
    }

    function restart(at) {
      videoNode.currentTime = at / 1000;
      videoNode.play().catch(() => {});
    }

    function onLoadedMetadata(evt) {
      if (!isFinite(evt.target.duration)) {
        // Keep waiting
        return;
      }
      const duration = Math.floor(evt.target.duration * 1000);
      rawSetStartOffset(videoData.start);
      setOriginalStartOffset(videoData.start);
      setCurrentTime(videoData.start);
      rawSetEndOffset(videoData.end ?? duration);
      setOriginalEndOffset(videoData.end ?? duration);
      setMaxOffset(duration);
      restart(videoData.start);
    }
    function onTimeUpdate(evt) {
      if (!endOffset) {
        return;
      }
      const currentOffset = Math.floor(evt.target.currentTime * 1000);
      setCurrentTime(Math.min(currentOffset, endOffset));
      // If we've reached the end of the video, start again unless the user has paused the video.
      if (currentOffset > endOffset && !isPausedTracker.current) {
        restart(startOffset);
      }
    }

    // We might already have metadata, if so invoke the event handler directly.
    // Note that on first playback before completion, duration is Infinite, so
    // so we need to wait until it isn't anymore.
    if (
      !isNaN(videoNode.duration) &&
      isFinite(videoNode.duration) &&
      startOffset === null
    ) {
      onLoadedMetadata({ target: videoNode });
    } else if (!isFinite(videoNode.duration)) {
      // Video is a blob of unknown length, wait until it finishes
      videoNode.addEventListener('timeupdate', onLoadedMetadata);
    } else {
      // Video hasn't loaded yet, wait for that
      videoNode.addEventListener('loadedmetadata', onLoadedMetadata);
    }

    // We only start scheduling the restart listener once we have the end offset
    if (endOffset) {
      videoNode.addEventListener('timeupdate', onTimeUpdate);
    }

    return () => {
      videoNode.removeEventListener('timeupdate', onTimeUpdate);
      videoNode.removeEventListener('timeupdate', onLoadedMetadata);
      videoNode.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [startOffset, endOffset, videoData, videoNode]);

  const setStartOffset = useCallback(
    (offset) => {
      // Start offset must be at least this smaller than end offset
      offset = Math.min(endOffset - MEDIA_VIDEO_MINIMUM_DURATION, offset);
      offset = Math.max(0, offset);
      rawSetStartOffset(offset);
      videoNode.currentTime = offset / 1000;
    },
    [videoNode, endOffset]
  );

  const setEndOffset = useCallback(
    (offset) => {
      // End offset must be at least this larger than start offset
      offset = Math.max(startOffset + MEDIA_VIDEO_MINIMUM_DURATION, offset);
      offset = Math.min(maxOffset, offset);
      rawSetEndOffset(offset);
      videoNode.currentTime = offset / 1000;
    },
    [videoNode, startOffset, maxOffset]
  );

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
    videoNode,
    setStartOffset,
    setEndOffset,
    setVideoNode,
    setIsDraggingHandles,
  };
}

export default useVideoNode;
