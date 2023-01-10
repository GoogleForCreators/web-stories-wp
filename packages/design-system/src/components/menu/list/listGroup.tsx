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
import type { MouseEvent } from 'react';

/**
 * Internal dependencies
 */
import { getInset } from '../utils';
import type { ListGroupProps } from '../types';
import DefaultListItem from './defaultListItem';
import List from './list';

function ListGroup({
  groups,
  activeValue,
  listLength,
  listId,
  hasMenuRole,
  handleMenuItemSelect,
  renderItem,
  optionsRef,
}: ListGroupProps) {
  const ListItem = renderItem || DefaultListItem;
  const isManyGroups = groups.length > 1;

  return (
    <>
      {groups.map(({ label, options }, groupIndex) => (
        <List
          key={label || `menuGroup_${groupIndex}`}
          isManyGroups={isManyGroups}
          label={label}
          listId={listId}
          role={hasMenuRole ? 'menu' : 'listbox'}
        >
          {options.map((groupOption, optionIndex) => {
            const isSelected = groupOption.value === activeValue;
            const optionInset = getInset(groups, groupIndex, optionIndex);

            return (
              <ListItem
                key={String(groupOption.value)}
                aria-posinset={optionInset + 1}
                aria-selected={isSelected}
                aria-setsize={listLength}
                id={`dropDownMenuItem-${String(groupOption.value)}`}
                isSelected={isSelected}
                onClick={(evt: MouseEvent<HTMLLIElement>) =>
                  !groupOption.disabled &&
                  handleMenuItemSelect(evt.nativeEvent, groupOption.value)
                }
                option={groupOption}
                role={hasMenuRole ? 'menuitem' : 'option'}
                ref={(el: HTMLLIElement | null) => {
                  if (el && optionsRef?.current) {
                    optionsRef.current[optionInset] = el;
                  }
                }}
                tabIndex={0}
              />
            );
          })}
        </List>
      ))}
    </>
  );
}
export default ListGroup;
