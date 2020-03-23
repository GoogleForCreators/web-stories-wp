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
import { useState } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import MediaFrame from '../media/frame';
import { elementFillContent } from '../shared';
import { useStory } from '../../app/story';
import { ReactComponent as PlayIcon } from '../../icons/play.svg';
import { ReactComponent as PauseIcon } from '../../icons/pause.svg';

const Play = styled(PlayIcon)`
  width: 48px;
  height: 48px;
`;
const Pause = styled(PauseIcon)`
  width: 48px;
  height: 48px;
`;

const Wrapper = styled.div`
  ${elementFillContent}
`;

const ButtonWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
`;

function VideoFrame({ element }) {
  const { id, isPlaying } = element;
  const [hovered, setHovered] = useState(false);

  const {
    actions: { updateElementById },
  } = useStory();

  const handlePlayPause = () => {
    updateElementById({ elementId: id, properties: { isPlaying: !isPlaying } });
  };

  return (
    <Wrapper
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <MediaFrame element={element} />
      {hovered && (
        <ButtonWrapper onClick={handlePlayPause}>
          {isPlaying ? <Pause /> : <Play />}
        </ButtonWrapper>
      )}
    </Wrapper>
  );
}

VideoFrame.propTypes = {
  element: StoryPropTypes.elements.video.isRequired,
};

export default VideoFrame;
