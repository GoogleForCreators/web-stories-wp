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

/**
 * Internal dependencies
 */
import {
  AnimatedContextMenu,
  MenuItemProps,
  themeHelpers,
} from '@web-stories-wp/design-system';
import { StoryPropType } from '../../types';
import { MoreVertical as MoreVerticalSvg } from '../../icons';

export const MoreVerticalButton = styled.button`
  display: flex;
  background: transparent;
  padding: 0 8px;
  opacity: ${({ menuOpen, isVisible }) => (menuOpen || isVisible ? 1 : 0)};
  transition: opacity ease-in-out 300ms;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.interactiveFg.brandNormal};

  & > svg {
    width: 4px;
    max-height: 100%;
  }

  border: 0;
  border-radius: ${({ theme }) => theme.borders.radius.small};

  ${themeHelpers.focusableOutlineCSS};
`;

MoreVerticalButton.propTypes = {
  menuOpen: PropTypes.bool,
};

const MenuContainer = styled.div`
  position: relative;
  align-self: ${({ verticalAlign = 'flex-start' }) => verticalAlign};
  text-align: right;

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
  story,
  verticalAlign,
  menuItems,
  itemActive,
  tabIndex,
}) {
  const isPopoverMenuOpen = contextMenuId === story.id;

  const handleDismiss = useCallback(
    () => onMoreButtonSelected(-1),
    [onMoreButtonSelected]
  );

  return (
    <MenuContainer verticalAlign={verticalAlign}>
      <MoreVerticalButton
        tabIndex={tabIndex}
        menuOpen={isPopoverMenuOpen}
        isVisible={itemActive}
        aria-label={__('More Options', 'web-stories')}
        onClick={() => onMoreButtonSelected(isPopoverMenuOpen ? -1 : story.id)}
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
  itemActive: PropTypes.bool,
  tabIndex: PropTypes.number,
  story: StoryPropType,
  onMoreButtonSelected: PropTypes.func.isRequired,
  contextMenuId: PropTypes.number.isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.shape(MenuItemProps)).isRequired,
  verticalAlign: PropTypes.oneOf(['center', 'flex-start', 'flex-end']),
};
