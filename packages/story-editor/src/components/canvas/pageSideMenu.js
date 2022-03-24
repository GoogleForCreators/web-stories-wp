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
import {
  ContextMenu,
  ContextMenuComponents,
  noop,
  Tooltip,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import styled from 'styled-components';
import { rgba } from 'polished';
import { Fragment } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useLayout } from '../../app';
import { MediaPicker, useQuickActions } from '../../app/highlights';
import { ZOOM_SETTING } from '../../constants';
import { Z_INDEX_CANVAS_SIDE_MENU } from '../../constants/zIndex';
import PageMenu from './pagemenu/pageMenu';

const MenusWrapper = styled.section`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  z-index: ${Z_INDEX_CANVAS_SIDE_MENU};
  pointer-events: auto;
  min-height: 100%;
  ${({ isZoomed, theme }) =>
    isZoomed &&
    `
    min-height: initial;
    background-color: ${rgba(theme.colors.standard.black, 0.45)};
    border-radius: ${theme.borders.radius.small};
    padding: 8px;
    margin-left: -24px;
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

  const isZoomed = zoomSetting !== ZOOM_SETTING.FIT;

  return (
    <MenusWrapper
      aria-label={__('Page side menu', 'web-stories')}
      isZoomed={isZoomed}
    >
      {
        // Dont render a menu wrapper if there are no quick actions
        quickActions.length ? (
          <ContextMenu
            isInline
            isAlwaysVisible
            isIconMenu
            disableControlledTabNavigation
            data-testid="Element quick actions"
            aria-label={__(
              'Group of available options for selected element',
              'web-stories'
            )}
            onMouseDown={(e) => {
              // Stop the event from bubbling if the user clicks in between buttons.
              // This prevents the selected element in the canvas from losing focus.
              e.stopPropagation();
            }}
          >
            {quickActions.map(
              ({
                Icon,
                label,
                onClick,
                separator,
                tooltipPlacement,
                wrapWithMediaPicker,
                ...quickAction
              }) => {
                const action = (externalOnClick = noop) => (
                  <Fragment key={label}>
                    {separator === 'top' && (
                      <ContextMenuComponents.MenuSeparator />
                    )}
                    <Tooltip placement={tooltipPlacement} title={label}>
                      <ContextMenuComponents.MenuButton
                        aria-label={label}
                        onClick={(evt) => {
                          onClick(evt);
                          externalOnClick(evt);
                        }}
                        {...quickAction}
                      >
                        <ContextMenuComponents.MenuIcon title={label}>
                          <Icon />
                        </ContextMenuComponents.MenuIcon>
                      </ContextMenuComponents.MenuButton>
                    </Tooltip>
                    {separator === 'bottom' && (
                      <ContextMenuComponents.MenuSeparator />
                    )}
                  </Fragment>
                );

                if (wrapWithMediaPicker) {
                  return (
                    <MediaPicker
                      key={label}
                      render={({ onClick: openMediaPicker }) =>
                        action(openMediaPicker)
                      }
                    />
                  );
                }

                return action();
              }
            )}
          </ContextMenu>
        ) : null
      }
      {isZoomed && <Divider />}
      <PageMenu />
    </MenusWrapper>
  );
}

export default PageSideMenu;
