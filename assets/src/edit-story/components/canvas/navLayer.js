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
import { memo, useRef, useCallback } from 'react';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import { ContextMenu } from '../../../design-system';
import { useQuickActions } from '../../app/highlights';
import DirectionAware from '../directionAware';
import Header from '../header';
import Carousel from '../carousel';
import {
  Layer,
  HeadArea,
  CarouselArea,
  Z_INDEX,
  QuickActionsArea,
} from './layout';

function NavLayer() {
  const carouselAreaRef = useRef(null);
  const headAreaRef = useRef(null);
  const enableQuickActionMenu = useFeature('enableQuickActionMenus');
  const quickActions = useQuickActions();

  /**
   * Stop the event from bubbling if the user clicks in between buttons.
   *
   * This prevents the selected element in the canvas from losing focus.
   */
  const handleMenuBackgroundClick = useCallback((ev) => {
    ev.stopPropagation();
  }, []);

  return (
    <Layer
      pointerEvents="none"
      zIndex={Z_INDEX.NAV}
      onMouseDown={(evt) => evt.stopPropagation()}
    >
      <HeadArea pointerEvents="initial" ref={headAreaRef}>
        <Header />
      </HeadArea>
      {enableQuickActionMenu && quickActions.length && (
        <DirectionAware>
          <QuickActionsArea>
            <ContextMenu
              isAlwaysVisible
              isIconMenu
              disableControlledTabNavigation
              items={quickActions}
              onMouseDown={handleMenuBackgroundClick}
            />
          </QuickActionsArea>
        </DirectionAware>
      )}
      <CarouselArea pointerEvents="initial" ref={carouselAreaRef}>
        <Carousel />
      </CarouselArea>
    </Layer>
  );
}

export default memo(NavLayer);
