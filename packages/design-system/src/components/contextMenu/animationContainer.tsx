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
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from '@googleforcreators/react';
import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';
/**
 * Internal dependencies
 */
import { BEZIER } from '../../theme/constants';
import { CORNER_DIRECTIONS, Direction } from '../../utils/directions';
import { Popover, Shadow } from './styled';

const PERCENTAGE_OFFSET = {
  [Direction.Top]: 100,
  [Direction.Right]: 0,
  [Direction.Bottom]: -100,
  [Direction.Left]: -50,
};

const animationTimeSeconds = 0.175;
const transition = `transform ${animationTimeSeconds}s ${BEZIER.default}`;
const initialScale = 0.5;
const fullSize = css`
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const MenuWrapper = styled.div`
  position: absolute;
`;

const MenuRevealer = styled.div<{
  animationFinished?: boolean;
}>`
  overflow: ${({ animationFinished }) =>
    animationFinished ? 'normal' : 'hidden'};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  ${fullSize}
`;

const MenuCounterRevealer = styled.div`
  border-radius: ${({ theme }) => theme.borders.radius.small};
`;

const ButtonInner = styled(Popover)<{
  align: keyof typeof CORNER_DIRECTIONS | null;
  isReady?: boolean;
}>`
  ${fullSize}
  ${({ isInline }) => isInline && `position: relative`};
  transform: ${({ align }) => {
    switch (align) {
      case CORNER_DIRECTIONS.top_left:
        return `translate(${PERCENTAGE_OFFSET[Direction.Left]}%, ${
          PERCENTAGE_OFFSET[Direction.Top]
        }%)`;
      case CORNER_DIRECTIONS.top_right:
        return `translate(${PERCENTAGE_OFFSET[Direction.Right]}%, ${
          PERCENTAGE_OFFSET[Direction.Top]
        }%)`;
      case CORNER_DIRECTIONS.bottom_right:
        return `translate(${PERCENTAGE_OFFSET[Direction.Right]}%, ${
          PERCENTAGE_OFFSET[Direction.Bottom]
        }%)`;
      case CORNER_DIRECTIONS.bottom_left:
      default:
        return `translate(${PERCENTAGE_OFFSET[Direction.Left]}%, ${
          PERCENTAGE_OFFSET[Direction.Bottom]
        }%)`;
    }
  }};

  ${MenuWrapper} {
    ${(props) => {
      switch (props.align) {
        case CORNER_DIRECTIONS.top_right:
          return css`
            top: 0;
            right: 0;
          `;
        case CORNER_DIRECTIONS.top_left:
          return css`
            top: 0;
            left: 0;
          `;
        case CORNER_DIRECTIONS.bottom_right:
          return css`
            right: 0;
            bottom: 0;
          `;
        case CORNER_DIRECTIONS.bottom_left:
        default:
          return css`
            left: 0;
            bottom: 0;
          `;
      }
    }}
  }

  ${MenuRevealer} {
    transition: ${(props) => (props.isReady ? transition : 'none')};
    ${(props) => {
      const translateFromScale = 100 * (1 - initialScale);
      switch (props.align) {
        case CORNER_DIRECTIONS.top_right:
          return css`
            transform: ${props.isReady
              ? 'none'
              : `translate(${translateFromScale}%, -${translateFromScale}%)`};
          `;
        case CORNER_DIRECTIONS.top_left:
          return css`
            transform: ${props.isReady
              ? 'none'
              : `translate(-${translateFromScale}%, -${translateFromScale}%)`};
          `;
        case CORNER_DIRECTIONS.bottom_right:
          return css`
            transform: ${props.isReady
              ? 'none'
              : `translate(${translateFromScale}%, ${translateFromScale}%)`};
          `;
        case CORNER_DIRECTIONS.bottom_left:
        default:
          return css`
            transform: ${props.isReady
              ? 'none'
              : `translate(-${translateFromScale}%, ${translateFromScale}%)`};
          `;
      }
    }}
  }

  ${MenuCounterRevealer} {
    transition: ${(props) => (props.isReady ? transition : 'none')};
    ${(props) => {
      const translateFromScale = 100 * (1 - initialScale);
      switch (props.align) {
        case CORNER_DIRECTIONS.top_right:
          return css`
            transform: ${props.isReady
              ? 'none'
              : `translate(-${translateFromScale}%, ${translateFromScale}%)`};
          `;
        case CORNER_DIRECTIONS.top_left:
          return css`
            transform: ${props.isReady
              ? 'none'
              : `translate(${translateFromScale}%, ${translateFromScale}%)`};
          `;
        case CORNER_DIRECTIONS.bottom_right:
          return css`
            transform: ${props.isReady
              ? 'none'
              : `translate(-${translateFromScale}%, -${translateFromScale}%)`};
          `;
        case CORNER_DIRECTIONS.bottom_left:
        default:
          return css`
            transform: ${props.isReady
              ? 'none'
              : `translate(${translateFromScale}%, -${translateFromScale}%)`};
          `;
      }
    }}
  }

  ${Shadow} {
    transition: ${(props) => (props.isReady ? transition : 'none')};
    transform: ${(props) =>
      props.isReady ? 'none' : `scale(${initialScale})`};
    transform-origin: ${(props) => {
      switch (props.align) {
        case CORNER_DIRECTIONS.top_right:
          return 'right top';
        case CORNER_DIRECTIONS.top_left:
          return 'left top';
        case CORNER_DIRECTIONS.bottom_right:
          return 'right bottom';
        case CORNER_DIRECTIONS.bottom_left:
        default:
          return 'left bottom';
      }
    }};
  }
`;

export interface AnimationContainerProps
  extends ComponentPropsWithoutRef<typeof ButtonInner> {
  isOpen?: boolean;
}

function AnimationContainer({
  children,
  isOpen,
  ...props
}: PropsWithChildren<AnimationContainerProps>) {
  const [align, setAlign] = useState<keyof typeof CORNER_DIRECTIONS | null>(
    null
  );
  const [isReady, setIsReady] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(true);
  const menuPositionRef = useRef<HTMLDivElement | null>(null);
  const menuTogglePositionRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!isOpen) {
      setAlign(null);
      return;
    }
    if (!(menuTogglePositionRef.current && menuPositionRef.current)) {
      return;
    }

    const toggleBoundingBox =
      menuTogglePositionRef.current.getBoundingClientRect();
    const menuWrapperBoundingBox =
      menuPositionRef.current.getBoundingClientRect();

    const menuLeft =
      toggleBoundingBox.left +
      toggleBoundingBox.width * (PERCENTAGE_OFFSET[Direction.Left] / 100);
    const menuBottom =
      toggleBoundingBox.bottom +
      toggleBoundingBox.height * (PERCENTAGE_OFFSET[Direction.Bottom] / 100);

    const alignHorizontal =
      menuLeft + menuWrapperBoundingBox.width > window.innerWidth
        ? Direction.Right
        : Direction.Left;
    const alignVertical =
      0 > menuBottom - menuWrapperBoundingBox.height
        ? Direction.Top
        : Direction.Bottom;

    setAlign(CORNER_DIRECTIONS[`${alignVertical}_${alignHorizontal}`]);
  }, [isOpen]);

  useEffect(() => {
    // some styles depend on the animation being finished. Set a timeout to set this variable
    // once the animation has finished.
    if (!isOpen) {
      return undefined;
    }
    setAnimationFinished(false);
    const timeoutId = setTimeout(
      () => setAnimationFinished(true),
      animationTimeSeconds * 1000
    );
    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  /**
   * Seems funky, but we need 1 full render where the proper
   * alignment is set before we animate in. This prevents react
   * from batching those renders and animating from wrong alignment.
   */
  useEffect(() => {
    const frameId = requestAnimationFrame(() => setIsReady(Boolean(align)));

    return () => cancelAnimationFrame(frameId);
  }, [align]);

  return (
    <ButtonInner
      align={align}
      isOpen={isOpen}
      isReady={isReady}
      ref={menuTogglePositionRef}
      {...props}
    >
      <MenuWrapper>
        <MenuRevealer animationFinished={isOpen && animationFinished}>
          <MenuCounterRevealer ref={menuPositionRef}>
            {children}
          </MenuCounterRevealer>
        </MenuRevealer>
        <Shadow />
      </MenuWrapper>
    </ButtonInner>
  );
}

export default AnimationContainer;
