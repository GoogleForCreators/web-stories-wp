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
 * External dependencies
 */
import type { RefObject, SyntheticEvent } from 'react';

export interface InnerContextMenuProps {
  onFocus?: (e: SyntheticEvent) => void;
  disableControlledTabNavigation?: boolean;
  isOpen?: boolean;
  onCloseSubMenu?: () => void;
  isIconMenu?: boolean;
  isSubMenu?: boolean;
  isSecondary?: boolean;
  isRTL?: boolean;
  parentMenuRef: RefObject<HTMLElement>;
  dismissOnEscape?: boolean;
}

export interface ContextMenuProps extends InnerContextMenuProps {
  animate?: boolean;
  'aria-label'?: string;
  id?: string;
  isOpen?: boolean;
  onDismiss?: (evt?: Event) => void;
  isAlwaysVisible?: boolean;
  isRTL?: boolean;
  isInline?: boolean;
  isHorizontal?: boolean;
  popoverZIndex?: number;
}

export interface ContextMenuState {
  focusedId: string | null;
  isIconMenu: boolean;
  isHorizontal: boolean;
}

export interface ContextMenuActions {
  onDismiss: (evt?: Event) => void;
  onMenuItemBlur: () => void;
  onMenuItemFocus: (id: string) => void;
  setFocusedId: (id: string | null) => void;
}

export interface ContextMenuProvider {
  state: ContextMenuState;
  actions: ContextMenuActions;
}
