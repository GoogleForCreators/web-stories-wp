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

function MediaCaptionsLayer() {
  const { isEditing } = useCanvas(({ state: { isEditing } }) => ({
    isEditing,
  }));

  const { currentPageId } = useStory(({ state: { currentPage } }) => ({
    currentPageId: currentPage?.id ? currentPage?.id : '',
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

  const backgroundAudio = useStory(({ state }) => {
    const { currentPage, selectedElements } = state;
    const { backgroundAudio: currentPageBackgroundAudio } = currentPage;
    if (!currentPageBackgroundAudio || selectedElements.length !== 1) {
      return null;
    }

    const selectedElement = selectedElements[0];
    const { tracks } = currentPageBackgroundAudio;
    if (selectedElement?.isBackground && tracks?.length > 0) {
      return currentPageBackgroundAudio;
    }

    return null;
  });

  const [mediaTrackCount, setMediaTrackCount] = useState(0);
  const [mediaElementId, setMediaElementId] = useState('');

  useEffect(() => {
    setMediaTrackCount(0);
    setMediaElementId('');

    if (backgroundAudio) {
      setMediaElementId(`page-${currentPageId}-background-audio`);
      setMediaTrackCount(backgroundAudio.tracks.length);
      return;
    }

    if (isEditing || !videoElement) {
      return;
    }
    const elementId = `video-${videoElement.id}`;
    const video = document.getElementById(elementId);
    setMediaElementId(elementId);
    setMediaTrackCount(video.textTracks.length);
  }, [
    videoElement,
    backgroundAudio,
    currentPageId,
    setMediaTrackCount,
    isEditing,
  ]);

  if (!mediaTrackCount) {
    return null;
  }

  return (
    <CaptionsLayer>
      <CaptionsPageArea withSafezone={false} showOverflow>
        <CaptionsCanvas>
          {Array.from({ length: mediaTrackCount }).map((_, index) => (
            <TrackRenderer
              key={
                // eslint-disable-next-line react/no-array-index-key
                index
              }
              elementId={mediaElementId}
              trackIndex={index}
            />
          ))}
        </CaptionsCanvas>
      </CaptionsPageArea>
    </CaptionsLayer>
  );
}

export default MediaCaptionsLayer;
