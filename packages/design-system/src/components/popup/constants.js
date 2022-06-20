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

export const PLACEMENT = {
  // TOP
  TOP: 'top',
  TOP_START: 'top-start',
  TOP_END: 'top-end',
  // BOTTOM
  BOTTOM: 'bottom',
  BOTTOM_START: 'bottom-start',
  BOTTOM_END: 'bottom-end',
  // RIGHT
  RIGHT: 'right',
  RIGHT_START: 'right-start',
  RIGHT_END: 'right-end',
  // LEFT
  LEFT: 'left',
  LEFT_START: 'left-start',
  LEFT_END: 'left-end',
};

export const RTL_PLACEMENT = {
  // TOP
  [PLACEMENT.TOP]: PLACEMENT.TOP,
  [PLACEMENT.TOP_START]: PLACEMENT.TOP_START,
  [PLACEMENT.TOP_END]: PLACEMENT.TOP_END,
  // BOTTOM
  [PLACEMENT.BOTTOM]: PLACEMENT.BOTTOM,
  [PLACEMENT.BOTTOM_END]: PLACEMENT.BOTTOM_END,
  [PLACEMENT.BOTTOM_START]: PLACEMENT.BOTTOM_START,
  // RIGHT
  [PLACEMENT.RIGHT]: PLACEMENT.LEFT,
  [PLACEMENT.RIGHT_START]: PLACEMENT.LEFT_START,
  [PLACEMENT.RIGHT_END]: PLACEMENT.LEFT_END,
  // LEFT
  [PLACEMENT.LEFT]: PLACEMENT.RIGHT,
  [PLACEMENT.LEFT_START]: PLACEMENT.RIGHT_START,
  [PLACEMENT.LEFT_END]: PLACEMENT.RIGHT_END,
};

export const PopupContainer = styled.div.attrs(
  ({ $offset: { x, y, width }, fillWidth, transforms, zIndex, maxWidth }) => {
    // set the width properties
    const widthProp = {};

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
      style: {
        transform: `translate(${x}px, ${y}px) ${transforms}`,
        ...widthProp,
        zIndex,
      },
    };
  }
)`
  /*! @noflip */
  left: 0px;
  top: 0px;
  position: fixed;
  ${({ noOverFlow }) => (noOverFlow ? '' : 'overflow-y: auto;')};
  max-height: ${({ topOffset }) => `calc(100vh - ${topOffset}px)`};
`;
