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
import { useEffect, useRef } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { MenuContainer } from './components';
import useDropDownMenu from './useDropDownMenu';
import { EmptyList, ListGroup } from './list';
import type { MenuProps } from './types';

function Menu({
  dropDownHeight,
  emptyText,
  menuStylesOverride,
  hasMenuRole,
  handleReturnToParent,
  isMenuFocused = true,
  isRTL,
  groups = [],
  listId,
  handleMenuItemSelect,
  onDismissMenu,
  renderItem,
  activeValue,
  menuAriaLabel,
  parentId,
  isAbsolute = false,
}: MenuProps) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const optionsRef = useRef<HTMLLIElement[]>([]);

  const { focusedIndex, listLength } = useDropDownMenu({
    activeValue,
    handleMenuItemSelect,
    isRTL,
    groups,
    listRef,
    onDismissMenu,
    handleReturnToParent,
  });

  useEffect(() => {
    const listEl = listRef?.current;

    if (!listEl || focusedIndex === null || !isMenuFocused) {
      return;
    }

    if (focusedIndex === -1) {
      listEl.scrollTo(0, 0);
      return;
    }

    const highlighedOptionEl = optionsRef.current[focusedIndex];
    if (!highlighedOptionEl) {
      return;
    }

    highlighedOptionEl.focus();
    listEl.scrollTo?.(
      0,
      highlighedOptionEl.offsetTop - listEl.clientHeight / 2
    );
  }, [focusedIndex, isMenuFocused]);

  return (
    <MenuContainer
      id={listId}
      dropDownHeight={dropDownHeight}
      styleOverride={menuStylesOverride}
      ref={listRef}
      aria-label={menuAriaLabel}
      aria-labelledby={parentId}
      aria-expanded="true"
      isAbsolute={isAbsolute}
    >
      {groups.length === 0 ? (
        <EmptyList emptyText={emptyText} />
      ) : (
        <ListGroup
          groups={groups}
          activeValue={activeValue}
          listId={listId}
          listLength={listLength}
          hasMenuRole={hasMenuRole}
          handleMenuItemSelect={handleMenuItemSelect}
          renderItem={renderItem}
          optionsRef={optionsRef}
        />
      )}
    </MenuContainer>
  );
}

export default Menu;
