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
import styled, { css } from 'styled-components';
import {
  useDebouncedCallback,
  useEffect,
  useRef,
  useState,
} from '@googleforcreators/react';
import { CSSTransition } from 'react-transition-group';
import { __ } from '@googleforcreators/i18n';
import { rgba } from 'polished';
import {
  Icons,
  Placement,
  Popup,
  useKeyDownEffect,
} from '@googleforcreators/design-system';
import { type VideoElement } from '@googleforcreators/elements';
import type { ElementBox } from '@googleforcreators/units';
import type { ReactNode, RefObject, MouseEventHandler } from 'react';

const PLAY_BUTTON_SIZE = 82;
const ICON_SVG_SIZE = 72;
const PLAY_ABOVE_BREAKPOINT_WIDTH = 108;
const PLAY_ABOVE_BREAKPOINT_HEIGHT = 120;

const Controls = styled.div<{
  x: number;
  y: number;
  width: number;
  height: number;
}>`
  position: absolute;
  z-index: 2;
  left: ${({ x }) => `${x}px`};
  top: ${({ y }) => `${y}px`};
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  pointer-events: none;
`;

const ButtonWrapper = styled.div.attrs({ role: 'button', tabIndex: -1 })<{
  isAbove: boolean;
}>`
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

const iconCss = css<{
  $isRTL: boolean;
}>`
  width: ${ICON_SVG_SIZE}px;
  height: ${ICON_SVG_SIZE}px;
  pointer-events: none;
  transform: translate(
    ${({ $isRTL }) =>
      ((PLAY_BUTTON_SIZE - ICON_SVG_SIZE) / 2) * ($isRTL ? -1 : 1)}px,
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
  x: 0,
  y: 22,
};

interface PlayPauseButtonProps {
  box: ElementBox;
  isActive?: boolean;
  isTransforming?: boolean;
  shouldResetOnEnd?: boolean;
  elementRef: RefObject<HTMLElement>;
  element: VideoElement;
  videoRef?: RefObject<HTMLVideoElement> | null;
  isRTL: boolean;
}

function PlayPauseButton({
  box,
  isActive = true,
  isTransforming = false,
  shouldResetOnEnd = true,
  elementRef,
  element,
  videoRef = null,
  isRTL,
}: PlayPauseButtonProps) {
  const isPlayAbove =
    element.width < PLAY_ABOVE_BREAKPOINT_WIDTH ||
    element.height < PLAY_ABOVE_BREAKPOINT_HEIGHT;
  const [hovering, setHovering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoNode, setVideoNode] = useState<HTMLVideoElement | null>(null);
  const { id } = element;
  useEffect(
    () =>
      setVideoNode(
        videoRef
          ? videoRef.current
          : (document.getElementById(`video-${id}`) as HTMLVideoElement)
      ),
    [videoRef, id]
  );

  useEffect(() => {
    if (!isActive) {
      if (videoNode) {
        videoNode.pause();
        videoNode.currentTime = 0;
      }
      setShowControls(false);
    }
  }, [videoNode, isActive]);

  useEffect(() => {
    if (videoNode && !videoNode.paused && !isTransforming) {
      videoNode.pause();
    }
  }, [videoNode, isTransforming]);

  useEffect(() => {
    if (!videoNode || !shouldResetOnEnd) {
      return undefined;
    }

    const onVideoEnd = () => {
      videoNode.currentTime = 0;
      setIsPlaying(false);
    };

    videoNode.addEventListener('ended', onVideoEnd);
    return () => videoNode.removeEventListener('ended', onVideoEnd);
  }, [shouldResetOnEnd, videoNode, id]);

  useEffect(() => {
    if (!videoNode) {
      return undefined;
    }

    const onVideoPlay = () => setIsPlaying(true);
    const onVideoPause = () => setIsPlaying(false);

    videoNode.addEventListener('play', onVideoPlay);
    videoNode.addEventListener('pause', onVideoPause);
    return () => {
      videoNode.removeEventListener('play', onVideoPlay);
      videoNode.removeEventListener('pause', onVideoPause);
    };
  }, [videoNode, id]);

  const checkShowControls = useDebouncedCallback(() => {
    if (!isPlayAbove) {
      setShowControls(!isPlaying);
    }
  }, 2000);
  const checkMouseInBBox = useDebouncedCallback((evt: MouseEvent) => {
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
  }, 10);

  useEffect(() => {
    document.addEventListener('pointermove', checkMouseInBBox);
    return () => {
      document.removeEventListener('pointermove', checkMouseInBBox);
    };
  }, [checkMouseInBBox]);

  const handlePlayPause = <T extends Event = MouseEvent>(evt: T): void => {
    evt.stopPropagation();
    if (!videoNode) {
      return;
    }

    if (isPlaying) {
      videoNode.pause();
      setShowControls(true);
    } else {
      videoNode.play().catch(() => {});
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
  const nodeRef = useRef<HTMLDivElement>(null);
  if (!isActive) {
    return null;
  }

  const buttonLabel = isPlaying
    ? __('Click to pause', 'web-stories')
    : __('Click to play', 'web-stories');
  const TransitionWrapper = isPlayAbove
    ? ({ children }: { children: ReactNode }) => (
        <Popup
          anchor={elementRef}
          isOpen
          placement={Placement.Top}
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
            onMouseDown={handlePlayPause as MouseEventHandler<HTMLDivElement>}
            isAbove={isPlayAbove}
          >
            <Icon $isRTL={isRTL} />
          </ButtonWrapper>
        </TransitionWrapper>
      )}
    </Controls>
  );
}

export default PlayPauseButton;
