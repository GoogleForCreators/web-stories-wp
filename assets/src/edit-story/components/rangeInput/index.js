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

const rangeThumb = css`
  appearance: none;
  width: ${({ thumbSize = 16 }) => thumbSize}px;
  height: ${({ thumbSize = 16 }) => thumbSize}px;
  background: #fff;
  cursor: pointer;
  border-radius: 50px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
`;

export default styled.input.attrs(({ min, max, step, value, onChange }) => ({
  type: 'range',
  min,
  max,
  step,
  value,
  onChange,
}))`
  margin: 4px;
  min-width: 100px;
  cursor: pointer;
  outline: none;
  background: #fff4;
  border-radius: 100px;
  height: 4px;
  appearance: none;
  flex: 1;

  &::-webkit-slider-thumb {
    ${rangeThumb}
  }

  &::-moz-range-thumb {
    ${rangeThumb}
  }

  &::-ms-thumb {
    ${rangeThumb}
  }
`;
