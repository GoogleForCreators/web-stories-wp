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

export const mediaWithScale = css`
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  left: ${({ offsetX }) => `${-offsetX}px`};
  top: ${({ offsetY }) => `${-offsetY}px`};
`;

const videoWithScale = css`
  width: ${({ width }) => `${width}px`};
  left: ${({ offsetX }) => `${-offsetX}px`};
  top: ${({ offsetY }) => `${-offsetY}px`};
  max-width: ${({ isBackground }) => (isBackground ? 'initial' : null)};
`;

export function getMediaWithScaleCss({ width, height, offsetX, offsetY }) {
  // @todo: This is a complete duplication of `mediaWithScale` above. But
  // no other apparent way to execute interpolate `mediaWithScale` dynamically.
  return `width:${width}px; height:${height}px; left:${-offsetX}px; top:${-offsetY}px;`;
}

export const getBackgroundStyle = () => {
  return {
    minWidth: '100%',
    minHeight: '100%',
    maxWidth: 'initial',
  };
};

// TODO: Display poster as actual <img> with crossorigin attr to avoid CORS issues.
export const Video = styled.video.attrs({ crossOrigin: 'anonymous' })`
  position: absolute;
  max-width: initial;
  max-height: initial;
  height: ${({ height }) => `${height}px`};
  background-image: ${({ poster }) => poster && `url("${poster}")`};
  background-repeat: no-repeat;
  background-size: cover;
  ${videoWithScale}
`;

export const VideoImage = styled.img.attrs({ crossOrigin: 'anonymous' })`
  position: absolute;
  max-height: initial;
  object-fit: contain;
  ${videoWithScale}
`;
