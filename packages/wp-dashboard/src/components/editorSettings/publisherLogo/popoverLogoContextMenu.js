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
import PropTypes from 'prop-types';
import { Fragment, useCallback } from '@googleforcreators/react';
import { __, sprintf } from '@googleforcreators/i18n';
import {
  Icons,
  ContextMenu,
  ContextMenuComponents,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { MenuContainer, LogoMenuButton } from '../components';

function PopoverLogoContextMenu({
  isActive,
  idx,
  publisherLogo,
  contextMenuId,
  onMenuItemToggle,
  items,
}) {
  const isPopoverMenuOpen = contextMenuId.value === publisherLogo.id;
  const tabIndex = isActive ? 0 : -1;

  const onMoreButtonSelected = useCallback(
    (openMenuLogoId) => contextMenuId.set(openMenuLogoId),
    [contextMenuId]
  );

  const handleDismiss = useCallback(
    () => onMoreButtonSelected(-1),
    [onMoreButtonSelected]
  );

  return (
    <MenuContainer>
      <LogoMenuButton
        tabIndex={tabIndex}
        isActive={isActive}
        menuOpen={isPopoverMenuOpen}
        data-testid={`publisher-logo-context-menu-button-${idx}`}
        aria-label={sprintf(
          /* translators: %s: logo title */
          __('Publisher logo menu for %s', 'web-stories'),
          publisherLogo.title
        )}
        onClick={(e) => {
          e.preventDefault();
          onMenuItemToggle(isPopoverMenuOpen ? null : publisherLogo.id);
          onMoreButtonSelected(isPopoverMenuOpen ? -1 : publisherLogo.id);
        }}
        onFocus={() => {
          onMenuItemToggle(isPopoverMenuOpen ? null : publisherLogo.id);
        }}
      >
        <Icons.Pencil aria-hidden="true" />
      </LogoMenuButton>
      <ContextMenu
        animate
        isOpen={isPopoverMenuOpen}
        data-testid={`publisher-logo-context-menu-${idx}`}
        onDismiss={handleDismiss}
      >
        {items.map(({ label, separator, ...props }) => {
          // eslint-disable-next-line react/prop-types -- map is not picking up definition from StoryMenu proptypes.
          const MenuItem = props.href
            ? ContextMenuComponents.MenuLink
            : ContextMenuComponents.MenuButton;

          return (
            <Fragment key={label}>
              {separator === 'top' && <ContextMenuComponents.MenuSeparator />}
              <MenuItem {...props}>{label}</MenuItem>
              {separator === 'bottom' && (
                <ContextMenuComponents.MenuSeparator />
              )}
            </Fragment>
          );
        })}
      </ContextMenu>
    </MenuContainer>
  );
}

export const PopoverLogoContextMenuPropTypes = {
  contextMenuId: PropTypes.shape({
    value: PropTypes.number,
    set: PropTypes.func,
  }).isRequired,
  idx: PropTypes.number,
  isActive: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      disabled: PropTypes.bool,
      href: PropTypes.string,
      label: PropTypes.string.isRequired,
      openNewTab: PropTypes.bool,
      onClick: PropTypes.func,
      onFocus: PropTypes.func,
    })
  ).isRequired,
  onMenuItemToggle: PropTypes.func.isRequired,
  publisherLogo: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string,
    id: PropTypes.number,
    active: PropTypes.bool,
  }).isRequired,
};

PopoverLogoContextMenu.propTypes = PopoverLogoContextMenuPropTypes;

export default PopoverLogoContextMenu;
