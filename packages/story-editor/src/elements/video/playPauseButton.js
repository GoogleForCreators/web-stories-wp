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
import {
  useCallback,
  useEffect,
  useState,
  useDebouncedCallback,
  useRef,
} from '@web-stories-wp/react';
import { CSSTransition } from 'react-transition-group';
import { __ } from '@web-stories-wp/i18n';
import { rgba } from 'polished';
import { Icons, useKeyDownEffect } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import Popup from '../../components/popup';
import { useConfig } from '../../app/config';

const PLAY_BUTTON_SIZE = 82;
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
  overflow: hidden;
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
    ${({ isRTL }) =>
      ((PLAY_BUTTON_SIZE - ICON_SVG_SIZE) / 2) * (isRTL ? -1 : 1)}px,
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
  y: 22,
};

function PlayPauseButton({
  box,
  isActive = true,
  isTransforming = false,
  shouldResetOnEnd = true,
  elementRef,
  element,
  videoRef = null,
}) {
  const { isRTL } = useConfig();
  const hasVideoSrc = Boolean(element.resource.src);
  const isPlayAbove =
    element.width < PLAY_ABOVE_BREAKPOINT_WIDTH ||
    element.height < PLAY_ABOVE_BREAKPOINT_HEIGHT;
  const [hovering, setHovering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(!isTransforming && hasVideoSrc);
  const { id } = element;
  const getVideoNode = useCallback(
    () =>
      videoRef ? videoRef.current : document.getElementById(`video-${id}`),
    [videoRef, id]
  );

  useEffect(() => {
    const videoNode = getVideoNode();
    if (!isActive) {
      if (videoNode) {
        videoNode.pause();
        videoNode.currentTime = 0;
      }
      setIsPlaying(false);
      setShowControls(false);
    }
    const syncTimer = setTimeout(() => {
      if (isActive && videoNode && !videoNode.paused && hasVideoSrc) {
        setIsPlaying(true);
      }
    });
    return () => clearTimeout(syncTimer);
  }, [getVideoNode, id, isActive, hasVideoSrc]);

  useEffect(() => {
    const videoNode = getVideoNode();
    if (videoNode && !videoNode.paused && !isTransforming) {
      videoNode.pause();
      setIsPlaying(false);
    }
  }, [getVideoNode, isTransforming]);

  useEffect(() => {
    const videoNode = getVideoNode();
    if (!videoNode || !shouldResetOnEnd) {
      return undefined;
    }

    const onVideoEnd = () => {
      videoNode.currentTime = 0;
      setIsPlaying(false);
      setShowControls(true);
    };
    videoNode.addEventListener('ended', onVideoEnd);
    return () => videoNode.removeEventListener('ended', onVideoEnd);
  }, [shouldResetOnEnd, getVideoNode, id]);

  const checkShowControls = useDebouncedCallback(() => {
    if (!isPlayAbove) {
      setShowControls(!isPlaying);
    }
  }, 2000);
  const checkMouseInBBox = useDebouncedCallback((evt) => {
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
      videoNode
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };
  useKeyDownEffect(
    elementRef,
    {
      key: ['space'],
    },
    handlePlayPause,
    [handlePlayPause]
  );
  const nodeRef = useRef();
  if (!isActive) {
    return null;
  }

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

  const Icon = isPlaying ? Pause : Play;
  return (
    <Controls data-controls-id={id} {...box}>
      {showControls && element.resource.src && (
        <TransitionWrapper
          in={hovering}
          appear
          nodeRef={nodeRef}
          classNames="button"
          timeout={100}
        >
          <ButtonWrapper
            ref={nodeRef}
            aria-label={buttonLabel}
            aria-pressed={isPlaying}
            key="wrapper"
            onMouseDown={handlePlayPause}
            isAbove={isPlayAbove}
          >
            <Icon isRTL={isRTL} />
          </ButtonWrapper>
        </TransitionWrapper>
      )}
    </Controls>
  );
}

PlayPauseButton.propTypes = {
  box: StoryPropTypes.box.isRequired,
  isActive: PropTypes.bool,
  isTransforming: PropTypes.bool,
  shouldResetOnEnd: PropTypes.bool,
  elementRef: PropTypes.object.isRequired,
  element: StoryPropTypes.element.isRequired,
  videoRef: PropTypes.object,
};

export default PlayPauseButton;
