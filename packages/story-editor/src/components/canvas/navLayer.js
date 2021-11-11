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
import { memo } from '@web-stories-wp/react';
import Proptypes from 'prop-types';

/**
 * Internal dependencies
 */
import Carousel from '../carousel';
import { CarouselArea, HeadArea, Layer, PageMenuArea, Z_INDEX } from './layout';
import PageSideMenu from './pageSideMenu';

function NavLayer({ header }) {
  return (
    <Layer
      pointerEvents="none"
      zIndex={Z_INDEX.NAV}
      onMouseDown={(evt) => evt.stopPropagation()}
    >
      <HeadArea pointerEvents="initial">{header}</HeadArea>
      <PageMenuArea>
        <PageSideMenu />
      </PageMenuArea>
      <CarouselArea pointerEvents="initial">
        <Carousel />
      </CarouselArea>
    </Layer>
  );
}

NavLayer.propTypes = {
  header: Proptypes.node,
};

export default memo(NavLayer);
