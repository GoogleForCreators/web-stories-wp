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

const borderElementCSS = css`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
`;

const Border = styled.div`
  ${borderElementCSS}
  border: ${({ color }) => `solid ${color}`};
  border-width: ${({ left, top, right, bottom }) =>
    `${left}px ${top}px ${right}px ${bottom}px`};
  box-sizing: border-box;
`;

const DashedBorder = styled.div`
  ${borderElementCSS}
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

export default function WithBorder({ element, children }) {
  const { border, borderColor, borderDash, borderGap } = element;
  // If we have no border-width / -color, let's short-circuit.
  if (!border || !borderColor) {
    return children;
  }
  const { left, top, right, bottom } = border;
  // If we have no border set either, let's short-circuit.
  if (!left && !top && !right && !bottom) {
    return children;
  }

  // If the mask type is anything else than rectangle, let's short-circuit.
  const mask = getElementMask(element);
  if (mask?.type && mask.type !== MaskTypes.RECTANGLE) {
    return children;
  }

  const {
    color: { r, g, b, a },
  } = borderColor;
  const color = `rgba(${r},${g},${b},${a || 1})`;
  if (!borderGap || !borderDash) {
    return (
      <Border {...border} color={color}>
        {children}
      </Border>
    );
  }
  return (
    <DashedBorder color={color} {...border} dash={borderDash} gap={borderGap}>
      {children}
    </DashedBorder>
  );
}

WithBorder.propTypes = {
  element: StoryPropTypes.element.isRequired,
  children: PropTypes.node.isRequired,
};
