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
import { __ } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useCallback } from 'react';
import {
  AnimatedContextMenu,
  MenuItemProps,
  themeHelpers,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { MoreVertical as MoreVerticalSvg } from '../../icons';

export const CONTEXT_MENU_BUTTON_CLASS = 'context-menu-button';

export const MoreVerticalButton = styled.button`
  display: flex;
  background: transparent;
  padding: 0 8px;
  opacity: ${({ menuOpen, isVisible }) => (menuOpen || isVisible ? 1 : 0)};
  transition: opacity ease-in-out 300ms;
  cursor: pointer;
  color: ${({ theme, $isInverted }) =>
    $isInverted
      ? theme.colors.inverted.fg.primary
      : theme.colors.interactiveFg.brandNormal};
  & > svg {
    width: 4px;
    max-height: 100%;
  }

  border: 0;
  border-radius: ${({ theme }) => theme.borders.radius.small};

  ${({ theme, $isInverted }) =>
    themeHelpers.focusableOutlineCSS(
      false,
      $isInverted ? theme.colors.standard.black : false
    )};
`;

MoreVerticalButton.propTypes = {
  menuOpen: PropTypes.bool,
};

const MenuContainer = styled.div`
  position: relative;
  align-self: ${({ verticalAlign = 'flex-start' }) => verticalAlign};
  text-align: right;
  ${({ $menuStyleOverrides }) => $menuStyleOverrides}

  & > div {
    margin: 0; /* 0 out margin that is needed by default on other instances of popover menus */
  }
`;

MenuContainer.propTypes = {
  verticalAlign: PropTypes.oneOf(['center', 'flex-start', 'flex-end']),
};

export default function StoryMenu({
  contextMenuId,
  onMoreButtonSelected,
  storyId,
  verticalAlign,
  menuItems,
  itemActive,
  tabIndex,
  menuStyleOverrides,
  isInverted,
}) {
  const isPopoverMenuOpen = contextMenuId === storyId;

  const handleDismiss = useCallback(
    () => onMoreButtonSelected(-1),
    [onMoreButtonSelected]
  );

  return (
    <MenuContainer
      verticalAlign={verticalAlign}
      data-testid={`story-context-menu-${storyId}`}
      $menuStyleOverrides={menuStyleOverrides}
    >
      <MoreVerticalButton
        data-testid={`story-context-button-${storyId}`}
        tabIndex={tabIndex}
        menuOpen={isPopoverMenuOpen}
        isVisible={itemActive}
        aria-label={__('More Options', 'web-stories')}
        onClick={() => onMoreButtonSelected(isPopoverMenuOpen ? -1 : storyId)}
        className={CONTEXT_MENU_BUTTON_CLASS}
        $isInverted={isInverted}
      >
        <MoreVerticalSvg />
      </MoreVerticalButton>
      <AnimatedContextMenu
        isOpen={isPopoverMenuOpen}
        items={menuItems}
        onDismiss={handleDismiss}
      />
    </MenuContainer>
  );
}

StoryMenu.propTypes = {
  isInverted: PropTypes.bool,
  itemActive: PropTypes.bool,
  tabIndex: PropTypes.number,
  storyId: PropTypes.number,
  onMoreButtonSelected: PropTypes.func.isRequired,
  contextMenuId: PropTypes.number.isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.shape(MenuItemProps)).isRequired,
  menuStyleOverrides: PropTypes.array,
  verticalAlign: PropTypes.oneOf(['center', 'flex-start', 'flex-end']),
};
