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

const videoWithScale = css`
  width: ${({ width }) => `${width}px`};
  left: ${({ offsetX }) => `${-offsetX}px`};
  top: ${({ offsetY }) => `${-offsetY}px`};
  max-width: ${({ isBackground }) => (isBackground ? 'initial' : null)};
`;

export const getBackgroundStyle = () => {
  return {
    minWidth: '100%',
    minHeight: '100%',
    maxWidth: 'initial',
  };
};

export const Video = styled.video`
  position: absolute;
  max-width: initial;
  max-height: initial;
  height: ${({ height }) => `${height}px`};
  background-image: ${({ poster }) => `url("${poster}")`};
  ${videoWithScale}
`;

export const VideoImage = styled.img`
  position: absolute;
  max-height: initial;
  object-fit: contain;
  ${videoWithScale}
`;
