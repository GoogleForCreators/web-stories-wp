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

const Pointer = styled.div`
  width: ${({ size }) => `${2 * size}px`};
  height: ${({ size }) => `${2 * size}px`};

  transform: translateX(${({ offset }) => `${offset}px`});
  transform: translate(
    ${({ offset, size }) => `${offset - size / 2}px`},
    ${({ size }) => `-${size}px`}
  );

  &:before {
    content: '';
    display: block;
    width: ${({ size }) => `${size}px`};
    height: ${({ size }) => `${size}px`};
    background: ${({ currentColor, currentColor: { r, g, b, a } }) =>
      currentColor ? `rgba(${r},${g},${b},${a})` : 'transparent'};
    border: 2px solid #fff;
    border-radius: 100%;
    filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.38));
    transform: translate(
      ${({ size }) => `${size / 2}px`},
      ${({ size }) => `${size / 2}px`}
    );
  }
`;

export default Pointer;
