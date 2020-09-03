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
import styled from 'styled-components';
import { useCallback, useRef } from 'react';

/**
 * Internal dependencies
 */
import { StoryPropType } from '../../types';
import { MoreVertical as MoreVerticalSvg } from '../../icons';
import useFocusOut from '../../utils/useFocusOut';
import { PopoverMenuCard } from '../popoverMenu';
import { DROPDOWN_ITEM_PROP_TYPE } from '../types';

export const MoreVerticalButton = styled.button`
  display: flex;
  border: none;
  background: transparent;
  padding: 0 8px;
  opacity: ${({ menuOpen, isVisible }) => (menuOpen || isVisible ? 1 : 0)};
  transition: opacity ease-in-out 300ms;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray900};

  & > svg {
    width: 4px;
    max-height: 100%;
  }
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
  onMenuItemSelected,
  story,
  verticalAlign,
  menuItems,
  itemActive,
  tabIndex,
}) {
  const containerRef = useRef(null);

  const handleFocusOut = useCallback(() => {
    if (contextMenuId === story.id) {
      onMoreButtonSelected(-1);
    }
  }, [contextMenuId, onMoreButtonSelected, story.id]);
  useFocusOut(containerRef, handleFocusOut, [contextMenuId]);

  const isPopoverMenuOpen = contextMenuId === story.id;

  return (
    <MenuContainer ref={containerRef} verticalAlign={verticalAlign}>
      <MoreVerticalButton
        tabIndex={tabIndex}
        menuOpen={isPopoverMenuOpen}
        isVisible={itemActive}
        aria-label="More Options"
        onClick={() => onMoreButtonSelected(isPopoverMenuOpen ? -1 : story.id)}
      >
        <MoreVerticalSvg />
      </MoreVerticalButton>
      <PopoverMenuCard
        isOpen={isPopoverMenuOpen}
        onSelect={(menuItem) => onMenuItemSelected(menuItem, story)}
        items={menuItems}
      />
    </MenuContainer>
  );
}

StoryMenu.propTypes = {
  itemActive: PropTypes.bool,
  tabIndex: PropTypes.number,
  story: StoryPropType,
  onMoreButtonSelected: PropTypes.func.isRequired,
  onMenuItemSelected: PropTypes.func.isRequired,
  contextMenuId: PropTypes.number.isRequired,
  menuItems: PropTypes.arrayOf(DROPDOWN_ITEM_PROP_TYPE).isRequired,
  verticalAlign: PropTypes.oneOf(['center', 'flex-start', 'flex-end']),
};
