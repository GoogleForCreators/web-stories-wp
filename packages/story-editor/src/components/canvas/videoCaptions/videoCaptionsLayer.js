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
import { useEffect, useCallback, useState } from '@web-stories-wp/react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app/story';
import { useCanvas } from '../../../app';
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
  const { isEditing } = useCanvas(({ state: { isEditing } }) => ({
    isEditing,
  }));

  const videoElementIds = useStory(
    ({ state }) =>
      state.currentPage?.elements
        ?.filter(({ type, tracks }) => type === 'video' && tracks?.length > 0)
        ?.map(({ id }) => id) || []
  );

  const [videoTracks, setVideoTracks] = useState([]);

  const addTrack = useCallback(
    (track) =>
      setVideoTracks((tracks) => {
        if (!tracks.some(({ track: _track }) => _track === track.track)) {
          tracks.push(track);
        }
        return tracks;
      }),
    [setVideoTracks]
  );

  useEffect(() => {
    setVideoTracks([]);

    for (const id of videoElementIds) {
      /**
       * @type {HTMLVideoElement}
       */
      const video = document.getElementById(`video-${id}`);
      if (video) {
        for (const track of video.textTracks) {
          addTrack({ id, track });
        }
      }
    }
  }, [videoElementIds, addTrack]);

  if (isEditing) {
    return null;
  }

  if (!videoTracks.length) {
    return null;
  }

  return (
    <CaptionsLayer>
      <CaptionsPageArea withSafezone={false} showOverflow>
        <CaptionsCanvas>
          {videoTracks.map(({ id, track }, index) => (
            <TrackRenderer
              key={
                // eslint-disable-next-line react/no-array-index-key
                `${id}-${index}`
              }
              videoId={id}
              track={track}
            />
          ))}
        </CaptionsCanvas>
      </CaptionsPageArea>
    </CaptionsLayer>
  );
}

export default VideoCaptionsLayer;
