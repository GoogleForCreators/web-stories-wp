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

const rgb = ({ r = 0, g = 0, b = 0 } = {}) => {
  return `rgb(${r},${g},${b})`;
};

const rgba = ({ r, g, b, a }) => {
  const al = (color) => (1 - a) * 255 + a * color;
  return `rgb(${al(r)}, ${al(g)}, ${al(b)})`;
};

const POINTER_SIZE = 12;
const BORDER_WIDTH = 2;

// The attrs method is more performant for frequently changed styles.
const Pointer = styled.div.attrs(({ currentColor, withAlpha }) => {
  return {
    style: {
      background: withAlpha ? rgba(currentColor) : rgb(currentColor),
    },
  };
})`
  width: ${POINTER_SIZE}px;
  height: ${POINTER_SIZE}px;
  transform: translate(
    ${({ offset }) => `${offset}px`},
    -${POINTER_SIZE / 2}px
  );
  background: transparent;
  border: ${BORDER_WIDTH}px solid #fff;
  border-radius: 100%;
  filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.38));
  position: relative;

  &:before {
    content: '';
    display: block;
    width: ${2 * POINTER_SIZE}px;
    height: ${2 * POINTER_SIZE}px;
    position: absolute;
    top: -${POINTER_SIZE / 2 + BORDER_WIDTH}px;
    left: -${POINTER_SIZE / 2 + BORDER_WIDTH}px;
  }
`;

Pointer.defaultProps = {
  currentRGB: {},
  currentRGBA: {},
  currentColor: {},
};

export default Pointer;
