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
import { formatMsToHMS } from '@googleforcreators/media';
import { trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import VideoTrimContext from './videoTrimContext';
import useVideoNode from './useVideoNode';

function VideoRecordingTrimProvider({ children, onTrim, videoData }) {
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
    onTrim({
      start: formatMsToHMS(startOffset),
      end: formatMsToHMS(endOffset),
    });
    trackEvent('recording_video_trim', {
      start_offset: startOffset,
      end_offset: endOffset,
    });
  }, [endOffset, startOffset, onTrim]);

  const value = {
    state: {
      videoData,
      hasChanged,
      isTrimMode: true,
      currentTime,
      startOffset,
      endOffset,
      maxOffset,
    },
    actions: {
      performTrim,
      setVideoNode,
      setStartOffset,
      setEndOffset,
      setIsDraggingHandles,
      toggleTrimMode: onTrim,
    },
  };

  return (
    <VideoTrimContext.Provider value={value}>
      {children}
    </VideoTrimContext.Provider>
  );
}

VideoRecordingTrimProvider.propTypes = {
  children: PropTypes.node.isRequired,
  onTrim: PropTypes.func.isRequired,
  videoData: PropTypes.object,
};

export default VideoRecordingTrimProvider;
