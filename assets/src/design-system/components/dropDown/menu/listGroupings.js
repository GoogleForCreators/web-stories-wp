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

/**
 * Internal dependencies
 */

import { getInset } from '../utils';
import { DROP_DOWN_VALUE_TYPE, MENU_OPTIONS } from '../types';
import DefaultListItem from './defaultListItem';
import List from './list';

const ListGroupings = ({
  options,
  activeValue,
  listLength,
  listId,
  hasMenuRole,
  handleMenuItemSelect,
  renderItem,
  optionsRef,
}) => {
  const ListItem = renderItem || DefaultListItem;
  const isManyGroups = options?.length > 1;

  return options.map(({ label, group }, groupIndex) => (
    <List
      key={label || `menuGroup_${groupIndex}`}
      isManyGroups={isManyGroups}
      label={label}
      listId={listId}
      role={hasMenuRole ? 'menu' : 'listbox'}
    >
      {group.map((groupOption, optionIndex) => {
        const isSelected = groupOption.value === activeValue;
        const optionInset = getInset(options, groupIndex, optionIndex);

        return (
          <ListItem
            key={groupOption.value}
            aria-posinset={optionInset + 1}
            aria-selected={isSelected}
            aria-setsize={listLength}
            id={`dropDownMenuItem-${groupOption.value}`}
            isSelected={isSelected}
            onClick={(event) =>
              !groupOption.disabled && handleMenuItemSelect(event, groupOption)
            }
            option={groupOption}
            listLength={listLength}
            role={hasMenuRole ? 'menuitem' : 'option'}
            ref={(el) => (optionsRef.current[optionInset] = el)}
            tabIndex={0}
          />
        );
      })}
    </List>
  ));
};
ListGroupings.propTypes = {
  options: MENU_OPTIONS,
  isManyGroups: PropTypes.bool,
  activeValue: DROP_DOWN_VALUE_TYPE,
  listLength: PropTypes.number,
  hasMenuRole: PropTypes.bool,
  handleMenuItemSelect: PropTypes.func.isRequired,
  renderItem: PropTypes.object,
  optionsRef: PropTypes.object,
};
export default ListGroupings;
