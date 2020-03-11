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
import { PanelTypes } from '../../components/panels';

export { default as getMediaSizePositionProps } from './getMediaSizePositionProps';
export { default as getFocalFromOffset } from './getFocalFromOffset';
export { default as EditPanMovable } from './editPanMovable';
export { default as ScalePanel } from './scalePanel';

export const CropBox = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: 1px solid ${({ theme }) => theme.colors.mg.v1};
    pointer-events: none;
  }
`;

export const MEDIA_MASK_OPACITY = 0.4;

export const MEDIA_DEFAULT_ATTRIBUTES = {
  scale: 100,
  focalX: 50,
  focalY: 50,
  isFill: false,
};

export const hasEditMode = true;

export const isMedia = true;

export const canFlip = true;

export const canFill = true;

export const isMaskable = true;

export const editModeGrayout = true;

export const resizeRules = {
  vertical: true,
  horizontal: true,
  diagonal: true,
};

export const MEDIA_PANELS = [
  PanelTypes.BACKGROUND_SIZE_POSITION,
  PanelTypes.LAYER_STYLE,
  PanelTypes.BACKGROUND_DISPLAY,
  PanelTypes.SIZE_POSITION,
];
