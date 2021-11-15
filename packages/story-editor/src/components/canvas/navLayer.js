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
import { memo, useCallback } from '@web-stories-wp/react';
import { __ } from '@web-stories-wp/i18n';
import { ContextMenu } from '@web-stories-wp/design-system';
import Proptypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useQuickActions } from '../../app/highlights';
import DirectionAware from '../directionAware';
import Footer from '../footer';
import { useLayout } from '../../app';
import {
  FooterArea,
  HeadArea,
  Layer,
  QuickActionsArea,
  Z_INDEX,
} from './layout';

function NavLayer({ header }) {
  const { hasHorizontalOverflow } = useLayout(
    ({ state: { hasHorizontalOverflow } }) => ({ hasHorizontalOverflow })
  );
  const quickActions = useQuickActions();

  /**
   * Stop the event from bubbling if the user clicks in between buttons.
   *
   * This prevents the selected element in the canvas from losing focus.
   */
  const handleMenuBackgroundClick = useCallback((ev) => {
    ev.stopPropagation();
  }, []);

  const showQuickActions =
    !hasHorizontalOverflow && Boolean(quickActions.length);

  return (
    <Layer
      pointerEvents="none"
      zIndex={Z_INDEX.NAV}
      onMouseDown={(evt) => evt.stopPropagation()}
    >
      <HeadArea pointerEvents="initial">{header}</HeadArea>
      {showQuickActions && (
        <DirectionAware>
          <QuickActionsArea>
            <ContextMenu
              isAlwaysVisible
              isIconMenu
              disableControlledTabNavigation
              groupLabel={__(
                'Group of available options for selected element',
                'web-stories'
              )}
              items={quickActions}
              onMouseDown={handleMenuBackgroundClick}
            />
          </QuickActionsArea>
        </DirectionAware>
      )}
      <FooterArea pointerEvents="initial">
        <Footer />
      </FooterArea>
    </Layer>
  );
}

NavLayer.propTypes = {
  header: Proptypes.node,
};

export default memo(NavLayer);
