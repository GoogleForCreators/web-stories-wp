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
import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { CSSTransition } from 'react-transition-group';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ReactComponent as PlayIcon } from '../../icons/play.svg';
import { ReactComponent as PauseIcon } from '../../icons/pause.svg';
import { useStory } from '../../app/story';
import StoryPropTypes from '../../types';

const PLAY_BUTTON_SIZE = 48;

const Controls = styled.div`
  position: absolute;
  z-index: 2;
  left: ${({ x }) => `${x}px`};
  top: ${({ y }) => `${y}px`};
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
`;

const ButtonWrapper = styled.div.attrs({ role: 'button', tabIndex: -1 })`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  pointer-events: initial;
  width: ${PLAY_BUTTON_SIZE}px;
  height: ${PLAY_BUTTON_SIZE}px;

  opacity: 0;
  &.button-enter {
    opacity: 0;
  }
  &.button-enter-active,
  &.button-enter-done {
    opacity: 1;
    transition: opacity 100ms;
  }
  &.button-exit {
    opacity: 1;
  }
  &.button-exit-active,
  &.button-exit-done {
    opacity: 0;
    transition: opacity 100ms;
  }
`;

const Play = styled(PlayIcon)`
  width: 100%;
  height: 100%;
`;
const Pause = styled(PauseIcon)`
  width: 100%;
  height: 100%;
`;

function VideoControls({ box, isSelected, isDragged, elementRef, element }) {
  const [hovering, setHovering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const { id } = element;
  const {
    state: { selectedElementIds },
  } = useStory();
  const isElementSelected = selectedElementIds.includes(id);
  const getVideoNode = useCallback(
    () => document.getElementById(`video-${id}`),
    [id]
  );

  useEffect(() => {
    const videoNode = getVideoNode();
    if (!isElementSelected && videoNode) {
      videoNode.pause();
      videoNode.currentTime = 0;
      setIsPlaying(false);
      setShowControls(true);
    }
    const syncTimer = setTimeout(() => {
      if (isElementSelected && videoNode && !videoNode.paused) {
        setIsPlaying(true);
      }
    }, 0);
    return () => clearTimeout(syncTimer);
  }, [getVideoNode, id, isElementSelected]);

  useEffect(() => {
    const videoNode = getVideoNode();
    if (!videoNode) {
      return undefined;
    }

    const onVideoEnd = () => {
      videoNode.currentTime = 0;
      setIsPlaying(false);
      setShowControls(true);
    };
    videoNode.addEventListener('ended', onVideoEnd);
    return () => videoNode.removeEventListener('ended', onVideoEnd);
  }, [getVideoNode, id]);

  const [checkShowControls] = useDebouncedCallback(() => {
    setShowControls(!isPlaying);
  }, 2000);
  // eslint-disable-next-line consistent-return
  const [checkMouseInBBox] = useDebouncedCallback((evt) => {
    const node = elementRef.current;
    if (!node) {
      return null;
    }
    const elementBBox = node.getBoundingClientRect();
    const isHovering =
      evt.clientX >= elementBBox.left &&
      evt.clientX <= elementBBox.right &&
      evt.clientY >= elementBBox.top &&
      evt.clientY <= elementBBox.bottom;
    setHovering(isHovering);
    setShowControls(true);
    checkShowControls();
  }, 10);

  useEffect(() => {
    document.addEventListener('pointermove', checkMouseInBBox);
    return () => {
      document.removeEventListener('pointermove', checkMouseInBBox);
    };
  }, [checkMouseInBBox]);

  if (!isSelected || isDragged) {
    return null;
  }

  const handlePlayPause = (evt) => {
    evt.stopPropagation();
    const videoNode = getVideoNode();
    if (!videoNode) {
      return;
    }

    if (isPlaying) {
      videoNode.pause();
      setIsPlaying(false);
      setShowControls(true);
    } else {
      videoNode.play().then(() => setIsPlaying(true));
    }
  };

  const buttonTitle = isPlaying
    ? __('Click to pause', 'web-stories')
    : __('Click to play', 'web-stories');

  return (
    <Controls {...box}>
      {showControls && (
        <CSSTransition in={hovering} appear classNames="button" timeout={100}>
          <ButtonWrapper
            title={buttonTitle}
            aria-pressed={isPlaying}
            key="wrapper"
            onMouseDown={handlePlayPause}
          >
            {isPlaying ? <Pause /> : <Play />}
          </ButtonWrapper>
        </CSSTransition>
      )}
    </Controls>
  );
}

VideoControls.propTypes = {
  box: StoryPropTypes.box.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isDragged: PropTypes.bool.isRequired,
  elementRef: PropTypes.object.isRequired,
  element: StoryPropTypes.element.isRequired,
};

export default VideoControls;
