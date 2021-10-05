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
import { useCallback } from '@web-stories-wp/react';
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
  const { isTrimMode, hasTrimMode, toggleTrimMode } = useVideoTrimMode();
  const {
    hasChanged,
    currentTime,
    startOffset,
    endOffset,
    maxOffset,
    setStartOffset,
    setEndOffset,
    setVideoNode,
    resetOffsets,
    setIsDraggingHandles,
  } = useVideoNode();

  const performTrim = useCallback(() => {
    const { resource } = selectedElements[0];
    if (!resource) {
      return;
    }
    const lengthInSeconds = Math.round(endOffset / 1000 - startOffset / 1000);
    trimExistingVideo({
      resource: {
        ...resource,
        length: lengthInSeconds,
        lengthFormatted: getVideoLengthDisplay(lengthInSeconds),
      },
      start: formatMsToHMS(startOffset),
      end: formatMsToHMS(endOffset),
    });
    toggleTrimMode();
  }, [
    endOffset,
    startOffset,
    trimExistingVideo,
    selectedElements,
    toggleTrimMode,
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
    },
    actions: {
      performTrim,
      toggleTrimMode,
      setVideoNode,
      setStartOffset,
      setEndOffset,
      resetOffsets,
      setIsDraggingHandles,
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
