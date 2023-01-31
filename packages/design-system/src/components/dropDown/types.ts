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
import type {
  DropdownItem,
  DropdownValue,
  MenuProps,
  NestedDropdownItem,
} from '../menu';
import type { Placement } from '../popup';

export interface UseDropDownProps {
  options: DropdownItem[] | NestedDropdownItem[];
  selectedValue: DropdownValue;
}

export type DropDownProps = Omit<
  MenuProps,
  'handleMenuItemSelect' | 'onDismissMenu' | 'groups'
> &
  UseDropDownProps & {
    onMenuItemClick?: MenuProps['handleMenuItemSelect'];
    ariaLabel?: string;
    disabled?: boolean;
    dropDownLabel: string;
    hasError?: boolean;
    hint?: string;
    isKeepMenuOpenOnSelection?: boolean;
    placement?: Placement;
    popupFillWidth?: boolean;
    popupZIndex?: number;
    isInline?: boolean;
    direction?: 'up' | 'down';
    className?: string;
  };
