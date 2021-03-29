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
import styled, { css } from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { CSSTransition } from 'react-transition-group';
import { __ } from '@web-stories-wp/i18n';
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import Popup from '../../components/popup';
import { Icons } from '../../../design-system';

const PLAY_BUTTON_SIZE = 50;
const ICON_SVG_SIZE = 72;
const PLAY_ABOVE_BREAKPOINT_WIDTH = 108;
const PLAY_ABOVE_BREAKPOINT_HEIGHT = 120;

const Controls = styled.div`
  position: absolute;
  z-index: 2;
  left: ${({ x }) => `${x}px`};
  top: ${({ y }) => `${y}px`};
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  pointer-events: none;
`;

const ButtonWrapper = styled.div.attrs({ role: 'button', tabIndex: -1 })`
  ${({ isAbove }) =>
    !isAbove &&
    css`
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `}
  cursor: pointer;
  pointer-events: initial;
  width: ${PLAY_BUTTON_SIZE}px;
  height: ${PLAY_BUTTON_SIZE}px;

  opacity: ${({ isAbove }) => (isAbove ? 1 : 0)};
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

const iconCss = css`
  width: ${ICON_SVG_SIZE}px;
  height: ${ICON_SVG_SIZE}px;
  pointer-events: none;
  transform: translate(
    ${(PLAY_BUTTON_SIZE - ICON_SVG_SIZE) / 2}px,
    ${(PLAY_BUTTON_SIZE - ICON_SVG_SIZE) / 2}px
  );
  color: ${({ theme }) => theme.colors.standard.white};
  filter: drop-shadow(
    0px 0px 10px ${({ theme }) => rgba(theme.colors.bg.primary, 0.4)}
  );
`;

const Play = styled(Icons.PlayFilled)`
  ${iconCss};
`;
const Pause = styled(Icons.StopFilled)`
  ${iconCss};
`;

const playAboveSpacing = {
  y: 28,
};

function VideoControls({
  box,
  isSelected,
  isSingleElement,
  isEditing,
  isTransforming,
  elementRef,
  element,
}) {
  const hasVideoSrc = Boolean(element.resource.src);
  const isPlayAbove =
    element.width < PLAY_ABOVE_BREAKPOINT_WIDTH ||
    element.height < PLAY_ABOVE_BREAKPOINT_HEIGHT;
  const [hovering, setHovering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(!isTransforming && hasVideoSrc);
  const { id } = element;
  const getVideoNode = useCallback(
    () => document.getElementById(`video-${id}`),
    [id]
  );

  useEffect(() => {
    const videoNode = getVideoNode();
    if (!isSelected || isEditing) {
      if (videoNode) {
        videoNode.pause();
        videoNode.currentTime = 0;
      }
      setIsPlaying(false);
      setShowControls(false);
    }
    const syncTimer = setTimeout(() => {
      if (isSelected && videoNode && !videoNode.paused && hasVideoSrc) {
        setIsPlaying(true);
      }
    });
    return () => clearTimeout(syncTimer);
  }, [getVideoNode, id, isSelected, isEditing, hasVideoSrc]);

  useEffect(() => {
    const videoNode = getVideoNode();
    if (videoNode && !videoNode.paused && isTransforming) {
      videoNode.pause();
      setIsPlaying(false);
    }
  }, [getVideoNode, isTransforming]);

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
    if (!isPlayAbove) {
      setShowControls(!isPlaying);
    }
  }, 2000);
  const [checkMouseInBBox] = useDebouncedCallback((evt) => {
    const node = elementRef.current;
    if (!node) {
      return;
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
    const videoNode = getVideoNode();
    if (videoNode) {
      setIsPlaying(!videoNode.paused);
    }
  }, 10);

  useEffect(() => {
    document.addEventListener('pointermove', checkMouseInBBox);
    return () => {
      document.removeEventListener('pointermove', checkMouseInBBox);
    };
  }, [checkMouseInBBox]);

  if (!isSelected || isTransforming || !isSingleElement || isEditing) {
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
      const playPromise = videoNode.play();
      if (playPromise) {
        playPromise.then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const buttonLabel = isPlaying
    ? __('Click to pause', 'web-stories')
    : __('Click to play', 'web-stories');
  const TransitionWrapper = isPlayAbove
    ? ({ children }) => (
        <Popup
          anchor={elementRef}
          isOpen
          placement="top"
          spacing={playAboveSpacing}
        >
          {children}
        </Popup>
      )
    : CSSTransition;

  return (
    <Controls data-controls-id={id} {...box}>
      {showControls && element.resource.src && (
        <TransitionWrapper
          in={hovering}
          appear
          classNames="button"
          timeout={100}
        >
          <ButtonWrapper
            aria-label={buttonLabel}
            aria-pressed={isPlaying}
            key="wrapper"
            onMouseDown={handlePlayPause}
            isAbove={isPlayAbove}
          >
            {isPlaying ? <Pause /> : <Play />}
          </ButtonWrapper>
        </TransitionWrapper>
      )}
    </Controls>
  );
}

VideoControls.propTypes = {
  box: StoryPropTypes.box.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isSingleElement: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isTransforming: PropTypes.bool.isRequired,
  elementRef: PropTypes.object.isRequired,
  element: StoryPropTypes.element.isRequired,
};

export default VideoControls;
