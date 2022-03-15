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
import { memo } from '@googleforcreators/react';
import Proptypes from 'prop-types';

/**
 * Internal dependencies
 */
import { Z_INDEX_NAV_LAYER } from '../../constants/zIndex';
import { ChecklistCountProvider } from '../checklist';
import Footer from '../footer';
import DirectionAware from '../directionAware';
import PageSideMenu from './pageSideMenu';
import { FooterArea, HeadArea, Layer, PageMenuArea } from './layout';

function NavLayer({ header, footer }) {
  return (
    <ChecklistCountProvider
      hasChecklist={Boolean(footer?.secondaryMenu?.checklist)}
    >
      <Layer pointerEvents="none" onMouseDown={(evt) => evt.stopPropagation()}>
        <HeadArea pointerEvents="initial" zIndex={Z_INDEX_NAV_LAYER}>
          {header}
        </HeadArea>
        <DirectionAware>
          <PageMenuArea>
            <PageSideMenu />
          </PageMenuArea>
        </DirectionAware>
        <FooterArea pointerEvents="initial" zIndex={Z_INDEX_NAV_LAYER}>
          <Footer footer={footer} />
        </FooterArea>
      </Layer>
    </ChecklistCountProvider>
  );
}

NavLayer.propTypes = {
  header: Proptypes.node,
  footer: Proptypes.object,
};

export default memo(NavLayer);
