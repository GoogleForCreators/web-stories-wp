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
import { useCallback, useRef } from 'react';
import { __, sprintf } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import {
  AnimatedContextMenu,
  MenuItemProps,
  noop,
  useFocusOut,
} from '@web-stories-wp/design-system';
import { EditPencil as EditPencilIcon } from '../../../../icons';
import { MenuContainer, LogoMenuButton } from '../components';

function PopoverLogoContextMenu({
  isActive,
  idx,
  publisherLogo,
  contextMenuId,
  onMenuItemToggle,
  items,
}) {
  const popoverMenuContainerRef = useRef(null);

  const isPopoverMenuOpen = contextMenuId.value === publisherLogo.id;
  const tabIndex = isActive ? 0 : -1;

  const onMoreButtonSelected = useCallback(
    (openMenuLogoId) => contextMenuId.set(openMenuLogoId),
    [contextMenuId]
  );

  const handleFocusOut = useCallback(() => {
    if (contextMenuId.value === publisherLogo.id) {
      onMoreButtonSelected(-1);
    }
  }, [publisherLogo.id, contextMenuId.value, onMoreButtonSelected]);

  useFocusOut(
    popoverMenuContainerRef,
    contextMenuId.value === publisherLogo.id ? handleFocusOut : noop,
    [contextMenuId, publisherLogo.id]
  );

  return (
    <MenuContainer ref={popoverMenuContainerRef}>
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
        <EditPencilIcon aria-hidden="true" />
      </LogoMenuButton>
      <AnimatedContextMenu
        isOpen={isPopoverMenuOpen}
        data-testid={`publisher-logo-context-menu-${idx}`}
        items={items}
      />
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
  items: PropTypes.arrayOf(PropTypes.shape(MenuItemProps)).isRequired,
  onMenuItemToggle: PropTypes.func.isRequired,
  publisherLogo: PropTypes.shape({
    src: PropTypes.string,
    title: PropTypes.string,
    id: PropTypes.number,
    isDefault: PropTypes.bool,
  }).isRequired,
};

PopoverLogoContextMenu.propTypes = PopoverLogoContextMenuPropTypes;

export default PopoverLogoContextMenu;
