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
import { PAGE_NAV_WIDTH, PAGE_WIDTH, PAGE_HEIGHT, HEADER_HEIGHT } from '../../constants';
import PointerEventsCss from '../../utils/pointerEventsCss';

/**
 * @file See https://user-images.githubusercontent.com/726049/72654503-bfffe780-3944-11ea-912c-fc54d68b6100.png
 * for the layering details.
 */

// @todo: the menu and carousel heights are not correct until we make a var-size
// page.
const Layer = styled.div`
  ${PointerEventsCss}

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: grid;
  grid:
    "head      head      head      head      head    " ${HEADER_HEIGHT}px
    ".         .         .         .         .       " 1fr
    ".         prev      page      next      .       " ${PAGE_HEIGHT}px
    ".         .         menu      .         .       " 48px
    ".         .         .         .         .       " 1fr
    "carousel  carousel  carousel  carousel  carousel" 65px
    / 1fr ${PAGE_NAV_WIDTH}px ${PAGE_WIDTH}px ${PAGE_NAV_WIDTH}px 1fr;
`;

const Area = styled.div`
  ${PointerEventsCss}

  grid-area: ${({ area }) => area};
  overflow: ${({ overflow }) => overflow ? 'visible' : 'hidden'};
  position: relative;
  width: 100%;
  height: 100%;
`;

// Page area is not `overflow:hidden` by default to allow different clipping
// mechanisms.
const PageArea = styled(Area).attrs({ area: 'page', overflow: true })``;

const HeadArea = styled(Area).attrs({ area: 'head', overflow: false })``;

const MenuArea = styled(Area).attrs({ area: 'menu', overflow: false })``;

const NavArea = styled(Area).attrs({ overflow: false })`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavPrevArea = styled(NavArea).attrs({ area: 'prev' })``;

const NavNextArea = styled(NavArea).attrs({ area: 'next' })``;

const CarouselArea = styled(Area).attrs({ area: 'carousel', overflow: false })``;

export {
  Layer,
  PageArea,
  HeadArea,
  MenuArea,
  NavPrevArea,
  NavNextArea,
  CarouselArea,
};
