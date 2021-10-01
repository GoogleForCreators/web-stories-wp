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
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef } from '@web-stories-wp/react';
import { formatMsToHMS, getVideoLengthDisplay } from '@web-stories-wp/media';

/**
 * Internal dependencies
 */
import { useLocalMedia, useStory } from '../../app';
import VideoTrimContext from './videoTrimContext';
import useVideoTrimMode from './useVideoTrimMode';
import useVideoNode from './useVideoNode';

function VideoTrimProvider({ children }) {
  const { selectedElements } = useStory(({ state: { selectedElements } }) => ({
    selectedElements,
  }));
  const { trimExistingVideo } = useLocalMedia((state) => ({
    trimExistingVideo: state.actions.trimExistingVideo,
  }));
  const {
    hasChanged,
    currentTime,
    startOffset,
    endOffset,
    maxOffset,
    setStartOffset,
    setEndOffset,
    setVideoNode,
    resetNodeTrimData,
    resetOffsets,
    originalResource,
    fetchOriginalResource,
    shouldFetchResource,
  } = useVideoNode();
  const { isTrimMode, hasTrimMode, toggleTrimMode } = useVideoTrimMode();

  const trimModeTracker = useRef(isTrimMode);

  useEffect(() => {
    // If we're not in trim mode but we were before, reset the node data as well.
    if (!isTrimMode && trimModeTracker.current === true) {
      resetNodeTrimData();
    }
    trimModeTracker.current = isTrimMode;
  }, [isTrimMode, resetNodeTrimData]);

  const performTrim = useCallback(() => {
    const resourceToTrim = originalResource
      ? originalResource
      : selectedElements[0]?.resource;
    if (!resourceToTrim) {
      return;
    }
    // Get length for displaying correct value in the library for the new video.
    const lengthInSeconds = Math.round(endOffset / 1000 - startOffset / 1000);
    // If we have the original resource but the original doesn't have one, let's use the ID of the original.
    const originalId =
      originalResource && !originalResource.trimData.original
        ? originalResource.id
        : 0;
    // Use the same resource ID for proper element update.
    trimExistingVideo({
      resource: {
        ...resourceToTrim,
        trimData: {
          ...resourceToTrim.trimData,
          original: originalId,
        },
        id: selectedElements[0].resource.id,
        length: lengthInSeconds,
        lengthFormatted: getVideoLengthDisplay(lengthInSeconds),
      },
      start: formatMsToHMS(startOffset),
      end: formatMsToHMS(endOffset),
    });
    toggleTrimMode();
    resetNodeTrimData();
  }, [
    endOffset,
    startOffset,
    trimExistingVideo,
    selectedElements,
    toggleTrimMode,
    originalResource,
    resetNodeTrimData,
  ]);

  const value = {
    state: {
      hasChanged,
      isTrimMode,
      hasTrimMode,
      currentTime,
      startOffset,
      endOffset,
      maxOffset,
      originalResource,
    },
    actions: {
      performTrim,
      toggleTrimMode,
      setVideoNode,
      setStartOffset,
      setEndOffset,
      resetOffsets,
      fetchOriginalResource,
      shouldFetchResource,
    },
  };

  return (
    <VideoTrimContext.Provider value={value}>
      {children}
    </VideoTrimContext.Provider>
  );
}

VideoTrimProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default VideoTrimProvider;
