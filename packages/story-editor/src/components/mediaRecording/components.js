/*
 * Copyright 2022 Google LLC
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
import { Text, THEME_CONSTANTS } from '@googleforcreators/design-system';
import { withOverlay } from '@googleforcreators/moveable';

/**
 * Internal dependencies
 */
import { Layer, PageArea } from '../canvas/layout';
import { Z_INDEX_RECORDING_MODE } from '../../constants/zIndex';

export const MessageWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  padding: 20px;
  height: 100%;
  justify-content: center;
  text-align: center;
  user-select: text;
`;

export const MessageHeading = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_LARGE,
})`
  margin: 0 0 14px;
`;

export const MessageText = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  margin: 0 0 14px;
`;

export const LayerWithGrayout = withOverlay(styled(Layer)`
  background-color: ${({ theme }) => theme.colors.opacity.overlayExtraDark};
  z-index: ${Z_INDEX_RECORDING_MODE};
`);

export const DisplayPageArea = styled(PageArea)`
  position: absolute;
`;

export const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.standard.white};
  border-radius: 5px;
  position: absolute;
  transform: translateZ(0);
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  cursor: default;
`;

export const VideoWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Photo = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
`;

export const Video = styled.video.attrs({
  autoPlay: true,
  disablePictureInPicture: true,
})`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
`;
