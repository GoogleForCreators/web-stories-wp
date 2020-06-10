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
import { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

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
  width: 100%;
  height: 100%;
`;
const Pause = styled(PauseIcon)`
  width: 100%;
  height: 100%;
`;

const Wrapper = styled.div`
  ${elementFillContent}
`;

const ButtonWrapper = styled.div.attrs({ role: 'button', tabIndex: -1 })`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;

  opacity: 0;
  &.button-enter {
    opacity: 0;
  }
  &.button-enter-active,
  &.button-enter-done {
    opacity: 1;
    transition: opacity 200ms;
  }
  &.button-exit {
    opacity: 1;
  }
  &.button-exit-active,
  &.button-exit-done {
    opacity: 0;
    transition: opacity 200ms;
  }
`;

function VideoFrame({ element, box }) {
  const { id } = element;
  const [hovering, setHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { selectedElementIds } = useStory((state) => ({
    selectedElementIds: state.state.selectedElementIds,
  }));
  const isElementSelected = selectedElementIds.includes(id);
  const getVideoNode = useCallback(
    () => document.getElementById(`video-${id}`),
    [id]
  );

  const onPointerEnter = () => {
    // Sync UI for auto-play on insert.
    const videoNode = getVideoNode();
    const currentlyPlaying = videoNode && !videoNode.paused;
    if (currentlyPlaying && !isPlaying) {
      setIsPlaying(true);
    }
    setHovering(true);
  };

  useEffect(() => {
    const videoNode = getVideoNode();
    if (!isElementSelected && videoNode) {
      videoNode.pause();
      videoNode.currentTime = 0;
      setIsPlaying(false);
    }
    const syncTimer = setTimeout(() => {
      if (isElementSelected && videoNode && !videoNode.paused) {
        setIsPlaying(true);
      }
    }, 0);
    return () => clearTimeout(syncTimer);
  }, [getVideoNode, id, isElementSelected]);

  const handlePlayPause = () => {
    const videoNode = getVideoNode();
    if (!videoNode) {
      return;
    }

    if (isPlaying) {
      videoNode.pause();
      setIsPlaying(false);
    } else {
      videoNode.play().then(() => setIsPlaying(true));
    }
  };

  useEffect(() => {
    const videoNode = getVideoNode();
    if (!videoNode) {
      return undefined;
    }

    const onVideoEnd = () => {
      videoNode.currentTime = 0;
      setIsPlaying(false);
    };
    videoNode.addEventListener('ended', onVideoEnd);
    return () => videoNode.removeEventListener('ended', onVideoEnd);
  }, [getVideoNode, id]);

  const buttonTitle = isPlaying
    ? __('Click to pause', 'web-stories')
    : __('Click to play', 'web-stories');

  const smallestDimension = Math.min(box.width, box.height);
  const buttonSize = Math.max(Math.ceil(smallestDimension * 0.2), 24);

  return (
    <Wrapper
      onPointerEnter={onPointerEnter}
      onPointerLeave={() => setHovering(false)}
    >
      <MediaFrame element={element} />
      <CSSTransition in={hovering} classNames="button" timeout={200}>
        <ButtonWrapper
          title={buttonTitle}
          aria-pressed={isPlaying}
          key="wrapper"
          onClick={handlePlayPause}
          size={buttonSize}
        >
          {isPlaying ? <Pause /> : <Play />}
        </ButtonWrapper>
      </CSSTransition>
    </Wrapper>
  );
}

VideoFrame.propTypes = {
  element: StoryPropTypes.elements.video.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default VideoFrame;
