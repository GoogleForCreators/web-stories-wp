/*
 * Copyright 2021 Google LLC
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
import { ContextMenu } from '@web-stories-wp/design-system';
import { __ } from '@web-stories-wp/i18n';
import { useCallback } from '@web-stories-wp/react';
import styled from 'styled-components';
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import DirectionAware from '../directionAware';
import { useLayout } from '../../app';
import { useQuickActions } from '../../app/highlights';
import { ZOOM_SETTING } from '../../constants';
import PageMenu from './pagemenu/pageMenu';

const MenusWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  z-index: 9999;
  pointer-events: auto;
  min-height: 100%;
  ${({ isZoomed, theme }) =>
    isZoomed &&
    `
    min-height: initial;
    background-color: ${rgba(theme.colors.standard.black, 0.45)};
    border-radius: ${theme.borders.radius.small};
    padding: 8px;
    margin-left: -16px;
  `}
`;

const Divider = styled.div`
  width: 20px;
  height: 1px;
  margin: 13px auto 1px;
  background-color: ${({ theme }) => theme.colors.divider.primary};
`;

function PageSideMenu() {
  const { zoomSetting } = useLayout(({ state: { zoomSetting } }) => ({
    zoomSetting,
  }));
  const quickActions = useQuickActions();

  /**
   * Stop the event from bubbling if the user clicks in between buttons.
   *
   * This prevents the selected element in the canvas from losing focus.
   */
  const handleMenuBackgroundClick = useCallback((ev) => {
    ev.stopPropagation();
  }, []);

  const showQuickActions = Boolean(quickActions.length);

  const isZoomed = zoomSetting !== ZOOM_SETTING.FIT;

  return (
    <DirectionAware>
      <MenusWrapper isZoomed={isZoomed}>
        {showQuickActions && (
          <>
            <ContextMenu
              isInline
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
            {isZoomed && <Divider />}
          </>
        )}
        <PageMenu />
      </MenusWrapper>
    </DirectionAware>
  );
}

export default PageSideMenu;
