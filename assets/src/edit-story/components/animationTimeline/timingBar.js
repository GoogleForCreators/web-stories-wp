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
import * as React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';

const BAR_HEIGHT = 24;

const Bar = styled.div`
  position: relative;
  background-color: #3988f7;
  width: ${({ width }) => (width / 10) * 40}px;
  height: ${BAR_HEIGHT}px;
  text-align: center;
  clip-path: polygon(
    calc(100% - ${BAR_HEIGHT / 2}px) 0,
    100% 50%,
    calc(100% - ${BAR_HEIGHT / 2}px) 100%,
    ${BAR_HEIGHT / 2}px 100%,
    0% 50%,
    ${BAR_HEIGHT / 2}px 0
  );
`;

const Handle = styled.div``;

export default function TimingBar({ duration }) {
  return (
    <Bar width={duration}>
      <Handle position="left" />
      <Handle position="right" />
    </Bar>
  );
}

TimingBar.propTypes = {
  duration: propTypes.number.isRequired,
};
