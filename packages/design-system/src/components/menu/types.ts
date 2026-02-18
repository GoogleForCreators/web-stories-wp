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
import type {
  ComponentPropsWithoutRef,
  FC,
  RefAttributes,
  RefObject,
} from 'react';

/**
 * Internal dependencies
 */
import type { StyleOverride } from '../../types/theme';

export type DropdownValue = string | number | boolean;
export interface DropdownItem {
  label: string;
  value: DropdownValue;
  disabled?: boolean;
}
export interface NestedDropdownItem {
  label?: string;
  options: DropdownItem[];
}

export interface DefaultListItemProps extends ComponentPropsWithoutRef<'li'> {
  option: DropdownItem;
  isSelected?: boolean;
}

export type ListItemProps = DefaultListItemProps & RefAttributes<HTMLLIElement>;

export interface SharedMenuProps {
  groups: NestedDropdownItem[];
  activeValue?: DropdownValue;
  handleMenuItemSelect: (evt: Event, value: DropdownValue) => void;

  handleReturnToParent?: () => void;
  isRTL?: boolean;
  onDismissMenu: (evt: Event) => void;

  listId?: string;
  hasMenuRole?: boolean;
  renderItem?: FC<ListItemProps>;
}

export interface UseDropDownMenuProps extends Omit<
  SharedMenuProps,
  'listId' | 'hasMenuRole' | 'renderItem'
> {
  listRef: RefObject<HTMLElement>;
}

export interface ListGroupProps extends Omit<
  SharedMenuProps,
  'handleReturnToParent' | 'isRTL' | 'onDismissMenu'
> {
  optionsRef: RefObject<HTMLLIElement[]>;
  listLength?: number;
}

export interface MenuProps extends SharedMenuProps {
  dropDownHeight?: number;
  emptyText?: string;
  menuStylesOverride?: StyleOverride;
  isMenuFocused?: boolean;
  menuAriaLabel?: string;
  parentId?: string;
  isAbsolute?: boolean;
}
