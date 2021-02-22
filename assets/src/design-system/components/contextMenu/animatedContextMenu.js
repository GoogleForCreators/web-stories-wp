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
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
/**
 * Internal dependencies
 */
import { BEZIER } from '../../../animation';
import { CORNER_DIRECTIONS, DIRECTIONS } from '../../utils/directions';
import Menu, { MenuPropTypes } from './menu';
import { Popover, Shadow } from './styled';

const PERCENTAGE_OFFSET = {
  [DIRECTIONS.TOP]: 100,
  [DIRECTIONS.RIGHT]: 0,
  [DIRECTIONS.BOTTOM]: -100,
  [DIRECTIONS.LEFT]: -50,
};

const transition = `transform 0.175s ${BEZIER.default}`;
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

const MenuRevealer = styled.div`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  ${fullSize}
`;

const MenuCounterRevealer = styled.div`
  border-radius: ${({ theme }) => theme.borders.radius.small};
`;

const ButtonInner = styled(Popover)`
  ${fullSize}
  transform: ${(props) => {
    switch (props.align) {
      case CORNER_DIRECTIONS.top_left:
        return `translate(${PERCENTAGE_OFFSET[DIRECTIONS.LEFT]}%, ${
          PERCENTAGE_OFFSET[DIRECTIONS.TOP]
        }%)`;
      case CORNER_DIRECTIONS.top_right:
        return `translate(${PERCENTAGE_OFFSET[DIRECTIONS.RIGHT]}%, ${
          PERCENTAGE_OFFSET[DIRECTIONS.TOP]
        }%)`;
      case CORNER_DIRECTIONS.bottom_right:
        return `translate(${PERCENTAGE_OFFSET[DIRECTIONS.RIGHT]}%, ${
          PERCENTAGE_OFFSET[DIRECTIONS.BOTTOM]
        }%)`;
      case CORNER_DIRECTIONS.bottom_left:
      default:
        return `translate(${PERCENTAGE_OFFSET[DIRECTIONS.LEFT]}%, ${
          PERCENTAGE_OFFSET[DIRECTIONS.BOTTOM]
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
ButtonInner.propTypes = {
  align: PropTypes.oneOf(Object.values(CORNER_DIRECTIONS)),
  isReady: PropTypes.bool,
};

function AnimationContainer({ children, isOpen, ...props }) {
  const [align, setAlign] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const menuPositionRef = useRef(null);
  const menuTogglePositionRef = useRef(null);

  useLayoutEffect(() => {
    if (!isOpen) {
      setAlign(null);
      return;
    }
    if (!(menuTogglePositionRef.current && menuPositionRef.current)) {
      return;
    }

    const toggleBoundingBox = menuTogglePositionRef.current.getBoundingClientRect();
    const menuWrapperBoundingBox = menuPositionRef.current.getBoundingClientRect();

    const menuLeft =
      toggleBoundingBox.left +
      toggleBoundingBox.width * (PERCENTAGE_OFFSET[DIRECTIONS.LEFT] / 100);
    const menuBottom =
      toggleBoundingBox.bottom +
      toggleBoundingBox.height * (PERCENTAGE_OFFSET[DIRECTIONS.BOTTOM] / 100);

    const alignHorizontal =
      menuLeft + menuWrapperBoundingBox.width > window.innerWidth
        ? DIRECTIONS.RIGHT
        : DIRECTIONS.LEFT;
    const alignVertical =
      0 > menuBottom - menuWrapperBoundingBox.height
        ? DIRECTIONS.TOP
        : DIRECTIONS.BOTTOM;

    setAlign(CORNER_DIRECTIONS[`${alignVertical}_${alignHorizontal}`]);
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
        <MenuRevealer>
          <MenuCounterRevealer ref={menuPositionRef}>
            {children}
          </MenuCounterRevealer>
        </MenuRevealer>
        <Shadow />
      </MenuWrapper>
    </ButtonInner>
  );
}
AnimationContainer.propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.node,
};

const AnimatedContextMenu = ({ isOpen, items }) => {
  return (
    <AnimationContainer isOpen={isOpen}>
      <Menu items={items} />
    </AnimationContainer>
  );
};
AnimatedContextMenu.propTypes = {
  ...MenuPropTypes,
};

export default AnimatedContextMenu;
