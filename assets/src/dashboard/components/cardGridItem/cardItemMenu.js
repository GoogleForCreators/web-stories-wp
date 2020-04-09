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
import PopoverMenu from '../popover-menu';
import { STORY_CONTEXT_MENU_ITEMS } from '../../constants';
import { StoryPropType } from '../../types';
import { ReactComponent as MoreVerticalSvg } from '../../icons/moreVertical.svg';
import useFocusOut from '../../utils/useFocusOut';

export const MoreVerticalButton = styled.button`
  border: none;
  background: transparent;
  padding: 0 8px;
  margin: 12px 0;
  opacity: ${({ menuOpen }) => (menuOpen ? 1 : 0)};
  transition: opacity ease-in-out 300ms;
  cursor: pointer;
`;

MoreVerticalButton.propTypes = {
  menuOpen: PropTypes.bool,
};

const MenuContainer = styled.div`
  position: relative;
  align-self: flex-start;
  text-align: right;
  flex-grow: 1;
  margin-top: 12px;

  .grid-story-popover-menu {
    right: 0;
    top: 0;
  }
`;

export default function CardItemMenu({
  contextMenuId,
  onMoreButtonSelected,
  onMenuItemSelected,
  story,
}) {
  const containerRef = useRef(null);
  const handleFocusOut = useCallback(() => {
    if (contextMenuId === story.id) {
      onMoreButtonSelected(-1);
    }
  }, [contextMenuId, onMoreButtonSelected, story.id]);
  useFocusOut(containerRef, handleFocusOut, [contextMenuId]);

  return (
    <MenuContainer ref={containerRef}>
      <MoreVerticalButton
        menuOpen={contextMenuId === story.id}
        aria-label="More Options"
        onClick={() => onMoreButtonSelected(story.id)}
      >
        <MoreVerticalSvg width={4} height={20} />
      </MoreVerticalButton>
      <PopoverMenu
        className="grid-story-popover-menu"
        isOpen={contextMenuId === story.id}
        framelessButton
        onSelect={onMenuItemSelected}
        items={STORY_CONTEXT_MENU_ITEMS}
      />
    </MenuContainer>
  );
}

CardItemMenu.propTypes = {
  story: StoryPropType,
  onMoreButtonSelected: PropTypes.func.isRequired,
  onMenuItemSelected: PropTypes.func.isRequired,
  contextMenuId: PropTypes.number.isRequired,
};
