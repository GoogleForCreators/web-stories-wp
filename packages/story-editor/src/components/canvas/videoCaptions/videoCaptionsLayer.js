/*
 * Copyright 2021 Google LLC
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
import { useEffect, useState } from '@googleforcreators/react';
import styled from 'styled-components';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import { useStory, useCanvas } from '../../../app';
import { Layer, PageArea } from '../layout';
import TrackRenderer from './trackRenderer';

const CaptionsLayer = styled(Layer)``;

const CaptionsPageArea = styled(PageArea)`
  position: absolute;
  pointer-events: none;
`;

const CaptionsCanvas = styled.div`
  background: transparent;
  border-radius: 5px;
  position: absolute;
  z-index: 2;
  transform: translateZ(0);
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  cursor: default;
`;

function VideoCaptionsLayer() {
  const isFeatureEnabled = useFeature('customVideoCaptionsInEditor');

  const { isEditing } = useCanvas(({ state: { isEditing } }) => ({
    isEditing,
  }));

  const videoElement = useStory(({ state }) => {
    const { selectedElements } = state;

    if (selectedElements.length !== 1) {
      return null;
    }

    const selectedElement = selectedElements[0];
    const { type, tracks } = selectedElement;
    if (type === 'video' && tracks?.length > 0) {
      return selectedElement;
    }

    return null;
  });

  const [videoTrackCount, setVideoTrackCount] = useState(0);

  useEffect(() => {
    setVideoTrackCount(0);

    if (isEditing || !videoElement) {
      return;
    }

    const video = document.getElementById(`video-${videoElement.id}`);
    setVideoTrackCount(video.textTracks.length);
  }, [videoElement, setVideoTrackCount, isEditing]);

  if (!isFeatureEnabled) {
    return null;
  }

  if (isEditing || !videoElement || !videoTrackCount) {
    return null;
  }

  return (
    <CaptionsLayer>
      <CaptionsPageArea withSafezone={false} showOverflow>
        <CaptionsCanvas>
          {Array.from({ length: videoTrackCount }).map((_, index) => (
            <TrackRenderer
              key={
                // eslint-disable-next-line react/no-array-index-key
                index
              }
              videoElement={videoElement}
              trackIndex={index}
            />
          ))}
        </CaptionsCanvas>
      </CaptionsPageArea>
    </CaptionsLayer>
  );
}

export default VideoCaptionsLayer;
