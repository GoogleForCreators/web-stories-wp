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
import { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { MENU_OPTIONS, DROP_DOWN_VALUE_TYPE } from '../types';
import { MenuContainer } from './components';
import useDropDownMenu from './useDropDownMenu';
import EmptyList from './emptyList';
import ListGroupings from './listGroupings';

const DropDownMenu = ({
  anchorHeight,
  dropDownHeight,
  emptyText,
  menuStylesOverride,
  hasMenuRole,
  isRTL,
  options = [],
  listId,
  onMenuItemClick,
  onDismissMenu,
  renderItem,
  activeValue,
  menuAriaLabel,
}) => {
  const listRef = useRef();
  const optionsRef = useRef([]);

  const handleMenuItemSelect = useCallback(
    (event, { value }) => onMenuItemClick(event, value),
    [onMenuItemClick]
  );

  const { focusedIndex, listLength } = useDropDownMenu({
    activeValue,
    handleMenuItemSelect,
    isRTL,
    options,
    listRef,
    onDismissMenu,
  });

  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl || focusedIndex === null) {
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
    listEl.scrollTo(0, highlighedOptionEl.offsetTop - listEl.clientHeight / 2);
  }, [focusedIndex]);

  return (
    <MenuContainer
      id={listId}
      anchorHeight={anchorHeight}
      dropDownHeight={dropDownHeight}
      styleOverride={menuStylesOverride}
      ref={listRef}
      role={hasMenuRole ? 'menu' : 'listbox'}
      aria-label={menuAriaLabel}
    >
      {!options || options.length === 0 ? (
        <EmptyList emptyText={emptyText} />
      ) : (
        <ListGroupings
          options={options}
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
};

DropDownMenu.propTypes = {
  anchorHeight: PropTypes.number,
  dropDownHeight: PropTypes.number,
  emptyText: PropTypes.string,
  menuStylesOverride: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  hasMenuRole: PropTypes.bool,
  isRTL: PropTypes.bool,
  options: MENU_OPTIONS,
  listId: PropTypes.string.isRequired,
  menuAriaLabel: PropTypes.string,
  onMenuItemClick: PropTypes.func.isRequired,
  onDismissMenu: PropTypes.func.isRequired,
  renderItem: PropTypes.object,
  activeValue: DROP_DOWN_VALUE_TYPE,
};

export default DropDownMenu;
