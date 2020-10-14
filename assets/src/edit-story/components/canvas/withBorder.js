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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { getElementMask, MaskTypes } from '../../masks';
import createSolid from '../../utils/createSolid';

const Border = styled.div`
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
      }px, ${color} ${dash + gap}px);`}
    background-size: ${({ left, top, right, bottom }) =>
      `${left}px 100%, 100% ${top}px, ${right}px 100% , 100% ${bottom}px;`}
    background-position: 0 0, 0 0, 100% 0, 0 100%;
    background-repeat: no-repeat;
    content: ' ';
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
`;

export default function WithBorder({ element, children }) {
  const { border, borderColor, borderDash, borderGap } = element;
  // If we have no border-width / -color, let's short-circuit.
  if (!border || !borderColor) {
    return children;
  }
  const { left, top, right, bottom } = border;
  if (!left && !top && !right && !bottom) {
    return children;
  }
  const mask = getElementMask(element);
  if (mask?.type && mask.type !== MaskTypes.RECTANGLE) {
    return children;
  }

  // @todo Temporary, remove this for solid borders.
  if (!borderGap || !borderDash) {
    return children;
  }
  const { color: { r, g, b, a } } = borderColor;
  return (
    <Border
      color={`rgba(${r},${g},${b},${a || 1})`}
      {...border}
      dash={borderDash}
      gap={borderGap}
    >
      {children}
    </Border>
  );
}
