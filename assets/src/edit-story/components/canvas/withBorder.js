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
import generatePatternStyles from '../../utils/generatePatternStyles';

const borderElementCSS = css`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  position: absolute;
`;

const solidBorderCSS = css`
  ${({ color }) => generatePatternStyles(color, 'border-color')}
  border-style: solid;
  border-width: ${({ left, top, right, bottom }) =>
    `${left}px ${top}px ${right}px ${bottom}px`};
`;

const innerSolidBorderCSS = css`
  &:after {
    content: ' ';
    ${borderElementCSS}
    ${solidBorderCSS}
  }
`;

const outerSolidBorderCSS = css`
  box-sizing: border-box;
  ${solidBorderCSS}
`;

// @todo Confirm inner / outer for different elements.
const Border = styled.div`
  ${borderElementCSS}
  ${innerSolidBorderCSS}
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

const outerDashedBorderCSS = css`
  box-sizing: border-box;
  ${dashedBorderCSS}
`;

const DashedBorder = styled.div`
  ${borderElementCSS}
  ${innerDashedBorderCSS}
`;

export default function WithBorder({ element, children }) {
  const { border } = element;
  if (!border) {
    return children;
  }
  const { left, top, right, bottom, dash, gap, color } = border;
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

  if (!gap || !dash) {
    return (
      <Border {...border} color={color}>
        {children}
      </Border>
    );
  }
  const {
    color: { r, g, b, a },
  } = color;
  const solidColor = `rgba(${r},${g},${b},${a === undefined ? 1 : a})`;
  return (
    <DashedBorder {...border} color={solidColor}>
      {children}
    </DashedBorder>
  );
}

WithBorder.propTypes = {
  element: StoryPropTypes.element.isRequired,
  children: PropTypes.node.isRequired,
};
