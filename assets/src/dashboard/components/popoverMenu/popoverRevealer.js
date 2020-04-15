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
import { useEffect, useLayoutEffect, useState, useRef } from 'react';

/**
 * Internal dependencies
 */
import { CORNER_DIRECTIONS, Z_INDEX, BEZIER } from '../../constants';

const PERCENTAGE_OFFSET = {
  TOP: 100,
  RIGHT: 0,
  BOTTOM: -100,
  LEFT: -50,
};

const transition = `transform 0.2s ${BEZIER.outSine}`;
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

const MenuShadow = styled.div`
  position: absolute;
  border-radius: 8px;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25);
  ${fullSize}
`;

const MenuRevealer = styled.div`
  overflow: hidden;
  border-radius: 8px;
  ${fullSize}
`;

const MenuCounterRevealer = styled.div`
  border-radius: 8px;
`;

const ButtonInner = styled.div`
  ${fullSize}
  position: absolute;
  z-index: ${Z_INDEX.POPOVER_MENU};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
  transform: ${(props) => {
    switch (props.align) {
      case CORNER_DIRECTIONS.TOP_LEFT:
        return `translate(${PERCENTAGE_OFFSET.LEFT}%, ${PERCENTAGE_OFFSET.TOP}%)`;
      case CORNER_DIRECTIONS.TOP_RIGHT:
        return `translate(${PERCENTAGE_OFFSET.RIGHT}%, ${PERCENTAGE_OFFSET.TOP}%)`;
      case CORNER_DIRECTIONS.BOTTOM_RIGHT:
        return `translate(${PERCENTAGE_OFFSET.RIGHT}%, ${PERCENTAGE_OFFSET.BOTTOM}%)`;
      case CORNER_DIRECTIONS.BOTTOM_LEFT:
      default:
        return `translate(${PERCENTAGE_OFFSET.LEFT}%, ${PERCENTAGE_OFFSET.BOTTOM}%)`;
    }
  }};

  ${MenuWrapper} {
    ${(props) => {
      switch (props.align) {
        case CORNER_DIRECTIONS.TOP_RIGHT:
          return css`
            top: 0;
            right: 0;
          `;
        case CORNER_DIRECTIONS.TOP_LEFT:
          return css`
            top: 0;
            left: 0;
          `;
        case CORNER_DIRECTIONS.BOTTOM_RIGHT:
          return css`
            right: 0;
            bottom: 0;
          `;
        case CORNER_DIRECTIONS.BOTTOM_LEFT:
        default:
          return css`
            left: 0;
            bottom: 0;
          `;
      }
    }}
  }

  ${MenuRevealer} {
    transition: ${(props) => (props.isOpen ? transition : 'none')};
    ${(props) => {
      const translateFromScale = 100 * (1 - initialScale);
      switch (props.align) {
        case CORNER_DIRECTIONS.TOP_RIGHT:
          return css`
            transform: ${props.isOpen
              ? 'none'
              : `translate(${translateFromScale}%, -${translateFromScale}%)`};
          `;
        case CORNER_DIRECTIONS.TOP_LEFT:
          return css`
            transform: ${props.isOpen
              ? 'none'
              : `translate(-${translateFromScale}%, -${translateFromScale}%)`};
          `;
        case CORNER_DIRECTIONS.BOTTOM_RIGHT:
          return css`
            transform: ${props.isOpen
              ? 'none'
              : `translate(${translateFromScale}%, ${translateFromScale}%)`};
          `;
        case CORNER_DIRECTIONS.BOTTOM_LEFT:
        default:
          return css`
            transform: ${props.isOpen
              ? 'none'
              : `translate(-${translateFromScale}%, ${translateFromScale}%)`};
          `;
      }
    }}
  }

  ${MenuCounterRevealer} {
    transition: ${(props) => (props.isOpen ? transition : 'none')};
    ${(props) => {
      const translateFromScale = 100 * (1 - initialScale);
      switch (props.align) {
        case CORNER_DIRECTIONS.TOP_RIGHT:
          return css`
            transform: ${props.isOpen
              ? 'none'
              : `translate(-${translateFromScale}%, ${translateFromScale}%)`};
          `;
        case CORNER_DIRECTIONS.TOP_LEFT:
          return css`
            transform: ${props.isOpen
              ? 'none'
              : `translate(${translateFromScale}%, ${translateFromScale}%)`};
          `;
        case CORNER_DIRECTIONS.BOTTOM_RIGHT:
          return css`
            transform: ${props.isOpen
              ? 'none'
              : `translate(-${translateFromScale}%, -${translateFromScale}%)`};
          `;
        case CORNER_DIRECTIONS.BOTTOM_LEFT:
        default:
          return css`
            transform: ${props.isOpen
              ? 'none'
              : `translate(${translateFromScale}%, -${translateFromScale}%)`};
          `;
      }
    }}
  }

  ${MenuShadow} {
    transition: ${(props) => (props.isOpen ? transition : 'none')};
    transform: ${(props) => (props.isOpen ? 'none' : `scale(${initialScale})`)};
    transform-origin: ${(props) => {
      switch (props.align) {
        case CORNER_DIRECTIONS.TOP_RIGHT:
          return 'right top';
        case CORNER_DIRECTIONS.TOP_LEFT:
          return 'left top';
        case CORNER_DIRECTIONS.BOTTOM_RIGHT:
          return 'right bottom';
        case CORNER_DIRECTIONS.BOTTOM_LEFT:
        default:
          return 'left bottom';
      }
    }};
  }
`;
ButtonInner.propTypes = {
  align: PropTypes.oneOf(Object.values(CORNER_DIRECTIONS)),
  isOpen: PropTypes.bool,
};

const PopoverRevealer = ({ children, isOpen }) => {
  const [align, setAlign] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const menuPositionRef = useRef(null);
  const menuTogglePositionRef = useRef(null);

  useLayoutEffect(() => {
    if (!isOpen) {
      setAlign(null);
      return;
    }
    if (!(menuTogglePositionRef.current && menuPositionRef.current)) return;

    const toggleBoundingBox = menuTogglePositionRef.current.getBoundingClientRect();
    const menuWrapperBoundingBox = menuPositionRef.current.getBoundingClientRect();

    const menuLeft =
      toggleBoundingBox.left +
      toggleBoundingBox.width * (PERCENTAGE_OFFSET.LEFT / 100);
    const menuBottom =
      toggleBoundingBox.bottom +
      toggleBoundingBox.height * (PERCENTAGE_OFFSET.BOTTOM / 100);

    const alignHorizontal =
      menuLeft + menuWrapperBoundingBox.width > window.innerWidth
        ? 'RIGHT'
        : 'LEFT';
    const alignVertical =
      0 > menuBottom - menuWrapperBoundingBox.height ? 'TOP' : 'BOTTOM';

    setAlign(CORNER_DIRECTIONS[`${alignVertical}_${alignHorizontal}`]);
  }, [isOpen]);

  /**
   * Seems funky, but we need 1 full render where the proper
   * alignment is set before we animate in. This prevents react
   * from batching those renders and animating from wrong alignemnt.
   *
   * Other options include scheduling with something like rAF
   * if we think it's a more robust solution.
   */
  useEffect(() => {
    setIsReady(Boolean(align));
  }, [align]);

  return (
    <ButtonInner
      ref={menuTogglePositionRef}
      isOpen={isOpen && isReady}
      align={align}
    >
      <MenuWrapper>
        <MenuRevealer>
          <MenuCounterRevealer ref={menuPositionRef}>
            {children}
          </MenuCounterRevealer>
        </MenuRevealer>
        <MenuShadow />
      </MenuWrapper>
    </ButtonInner>
  );
};

PopoverRevealer.propTypes = {
  children: PropTypes.children,
  isOpen: PropTypes.bool.isRequired,
};

export default PopoverRevealer;
