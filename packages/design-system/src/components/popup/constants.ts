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
import styled, { type CSSProperties } from 'styled-components';

export enum Placement {
  Top = 'top',
  TopStart = 'top-start',
  TopEnd = 'top-end',
  Bottom = 'bottom',
  BottomStart = 'bottom-start',
  BottomEnd = 'bottom-end',
  Right = 'right',
  RightStart = 'right-start',
  RightEnd = 'right-end',
  Left = 'left',
  LeftStart = 'left-start',
  LeftEnd = 'left-end',
}

export const RTL_PLACEMENT = {
  [Placement.Top]: Placement.Top,
  [Placement.TopStart]: Placement.TopStart,
  [Placement.TopEnd]: Placement.TopEnd,
  [Placement.Bottom]: Placement.Bottom,
  [Placement.BottomEnd]: Placement.BottomEnd,
  [Placement.BottomStart]: Placement.BottomStart,
  [Placement.Right]: Placement.Left,
  [Placement.RightStart]: Placement.LeftStart,
  [Placement.RightEnd]: Placement.LeftEnd,
  [Placement.Left]: Placement.Right,
  [Placement.LeftStart]: Placement.RightStart,
  [Placement.LeftEnd]: Placement.RightEnd,
};

export const PopupContainer = styled.div<{
  $offset: { x: number; y: number; width: number };
  fillWidth?: boolean;
  transforms?: string;
  zIndex?: number;
  maxWidth?: number;
  noOverFlow?: boolean;
  topOffset?: number;
}>`
  ${({
    $offset: { x, y, width },
    fillWidth,
    transforms = '',
    zIndex,
    maxWidth,
  }) => {
    // set the width properties
    const widthProp: CSSProperties = {};

    // fillWidth should expand the PopupContainer width to the offset.width
    if (fillWidth) {
      // if maxWidth is given with fillWidth, set the PopupContainers min-width
      // to offset.width to ensure the PopupContainer does not get any smaller
      // than offset.width
      if (maxWidth) {
        widthProp.minWidth = `${width}px`;
      } else {
        widthProp.width = `${width}px`;
      }
    }
    // if maxWidth is given and the width propery hasn't been set
    // set the PopupContainers max-width
    if (maxWidth && !widthProp.width) {
      widthProp.maxWidth = `${maxWidth}px`;
    }

    return {
      transform: `translate(${x}px, ${y}px) ${transforms}`,
      ...widthProp,
      zIndex,
    };
  }}
  /*! @noflip */
  left: 0px;
  top: 0px;
  position: fixed;
  ${({ noOverFlow }) => (noOverFlow ? '' : 'overflow-y: auto;')};
  max-height: ${({ topOffset = 0 }) => `calc(100vh - ${topOffset}px)`};
`;
