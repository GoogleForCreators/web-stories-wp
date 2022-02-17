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
import { useCallback } from '@googleforcreators/react';
import { formatMsToHMS, getVideoLengthDisplay } from '@googleforcreators/media';
import { trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import { useLocalMedia } from '../../app';
import VideoTrimContext from './videoTrimContext';
import useVideoTrimMode from './useVideoTrimMode';
import useVideoNode from './useVideoNode';

function VideoTrimProvider({ children }) {
  const { trimExistingVideo } = useLocalMedia(
    ({ actions: { trimExistingVideo } }) => ({
      trimExistingVideo,
    })
  );
  const { isTrimMode, hasTrimMode, toggleTrimMode, videoData } =
    useVideoTrimMode();
  const {
    hasChanged,
    currentTime,
    startOffset,
    endOffset,
    maxOffset,
    setStartOffset,
    setEndOffset,
    setVideoNode,
    setIsDraggingHandles,
  } = useVideoNode(videoData);

  const performTrim = useCallback(() => {
    const { resource, element } = videoData;
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
      // This is the ID of the resource that's currently on canvas and needs to be cloned.
      // It's only different from the above resource, if the canvas resource is a trim of the other.
      canvasResourceId: element.resource.id,
      elementId: element.id,
      start: formatMsToHMS(startOffset),
      end: formatMsToHMS(endOffset),
    });
    trackEvent('video_trim', {
      original_length: resource.length,
      new_length: lengthInSeconds,
      start_offset: startOffset,
      end_offset: endOffset,
    });
    toggleTrimMode();
  }, [endOffset, startOffset, trimExistingVideo, toggleTrimMode, videoData]);

  const value = {
    state: {
      videoData,
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
