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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { getElementMask, MaskTypes } from '../../masks';
import StoryPropTypes from '../../types';
import { BORDER_POSITION } from '../../constants';

const borderElementCSS = css`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  position: absolute;
`;

const dashedBorderCSS = css`
  background-image: ${({ dash, gap, color }) =>
    `repeating-linear-gradient(0deg, ${color}, ${color} ${dash}px, transparent ${dash}px, transparent ${
      dash + gap
    }px, ${color} ${
      dash + gap
    }px), repeating-linear-gradient(90deg, ${color}, ${color} ${dash}px, transparent ${dash}px, transparent ${
      dash + gap
    }px, ${color} ${
      dash + gap
    }px), repeating-linear-gradient(180deg, ${color}, ${color} ${dash}px, transparent ${dash}px, transparent ${
      dash + gap
    }px, ${color} ${
      dash + gap
    }px), repeating-linear-gradient(270deg, ${color}, ${color} ${dash}px, transparent ${dash}px, transparent ${
      dash + gap
    }px, ${color} ${dash + gap}px)`};
  background-size: ${({ left, top, right, bottom }) =>
    `${left}px 100%, 100% ${top}px, ${right}px 100% , 100% ${bottom}px`};
  background-position: 0 0, 0 0, 100% 0, 0 100%;
  background-repeat: no-repeat;
`;

const innerDashedBorderCSS = css`
  &:after {
    content: ' ';
    ${borderElementCSS}
    ${dashedBorderCSS}
  }
`;

const DashedBorder = styled.div`
  ${borderElementCSS}
  ${innerDashedBorderCSS}
  ${({ position, left, top, right, bottom }) =>
    getBorderPositionCSS({ left, top, right, bottom, position })}
`;

function getBorderPositionCSS({ left, top, right, bottom, position }) {
  if (BORDER_POSITION.OUTSIDE === position) {
    return `
    &:after {
      top: ${-top}px;
      height: calc(100% + ${top + bottom}px);
      left: ${-left}px;
      width: calc(100% + ${left + right}px);
    }
    `;
  }
  if (BORDER_POSITION.CENTER === position) {
    return `
    &:after {
      top: ${-top / 2}px;
      height: calc(100% + ${(top + bottom) / 2}px);
      left: ${-left / 2}px;
      width: calc(100% + ${(left + right) / 2}px);
    }
    `;
  }
  return '';
}

export default function WithBorder({ element, children }) {
  const { border } = element;
  if (!border) {
    return children;
  }
  const { left, top, right, bottom, gap, color } = border;
  // If we have no color, let's short-circuit.
  if (!color) {
    return children;
  }
  // If we have no border set either, let's short-circuit.
  if (!left && !top && !right && !bottom) {
    return children;
  }

  // If the mask type is anything else than rectangle, let's short-circuit.
  const mask = getElementMask(element);
  if (mask?.type && mask.type !== MaskTypes.RECTANGLE) {
    return children;
  }

  // If there's no gap set, let's set the dash to 1 for creating solid border.
  const dash = gap ? border.dash : 1;
  const {
    color: { r, g, b, a },
  } = color;
  const solidColor = `rgba(${r},${g},${b},${a === undefined ? 1 : a})`;
  return (
    <DashedBorder {...border} dash={dash} color={solidColor}>
      {children}
    </DashedBorder>
  );
}

WithBorder.propTypes = {
  element: StoryPropTypes.element.isRequired,
  children: PropTypes.node.isRequired,
};
