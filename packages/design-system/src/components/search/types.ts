/*
 * Copyright 2022 Google LLC
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
 * Internal dependencies
 */
import type { DropdownItem, DropdownValue, NestedDropdownItem } from '../menu';
import type { Placement } from '../popup';

export interface UseSearchProps {
  options: NestedDropdownItem[] | DropdownItem[];
  handleSearchValueChange?: (value: string) => void;
  selectedValue?: DropdownItem;
  searchValue?: string;
}

export interface SearchProps extends Omit<UseSearchProps, 'options'> {
  options?: NestedDropdownItem[] | DropdownItem[];
  ariaInputLabel?: string;
  ariaClearLabel?: string;
  disabled?: boolean;
  hasError?: boolean;
  hint?: string;
  label?: string;
  onMenuItemClick?: (evt: Event, value: DropdownValue) => void;
  onClear?: () => void;
  placeholder?: string;
  placement?: Placement;
  popupFillWidth?: number;
  popupZIndex?: number;
}
