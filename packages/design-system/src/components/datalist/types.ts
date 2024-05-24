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
import type {
  ComponentPropsWithoutRef,
  FunctionComponent,
  HTMLAttributes,
  RefAttributes,
} from 'react';

/**
 * Internal dependencies
 */
import type { StyleOverride } from '../../types/theme';

export interface AbstractOption {
  id: string;
  name: string;
}

export interface Group<O extends AbstractOption> {
  label: string;
  options: O[];
}

// !! Here be dragons !!
export type OptionRendererProps<O extends AbstractOption> =
  HTMLAttributes<HTMLLIElement> &
    RefAttributes<HTMLLIElement> & {
      option: O;
      value: O['id'];
    };

export type OptionRenderer<O extends AbstractOption> = FunctionComponent<
  OptionRendererProps<O>
>;

export interface OptionListProps<O extends AbstractOption> {
  keyword?: string;
  value?: O['id'];
  options?: O[];
  renderer?: OptionRenderer<O>;
  onSelect?: (option: O) => void;
  onClose?: () => void;
  onExpandedChange?: (isExpanded: boolean) => void;
  focusTrigger?: number;
  primaryOptions: O[];
  primaryLabel: string;
  priorityOptionGroups?: Group<O>[];
  searchResultsLabel: string;
  onObserve?: (options: string[]) => void;
  focusSearch?: () => void;
  listId?: string;
  listStyleOverrides?: StyleOverride;
  noMatchesFoundLabel?: string;
}

export type ContentRenderer<O> = (options: {
  searchKeyword: string;
  setIsExpanded: (isExpanded: boolean) => void;
  trigger: number;
  queriedOptions: O[] | null;
  listId: string;
}) => JSX.Element | null;

export interface OptionsContainerProps<O> {
  isOpen: boolean;
  onClose: () => void;
  getOptionsByQuery?: (query: string) => Promise<O[]>;
  hasSearch?: boolean;
  renderContents: ContentRenderer<O>;
  isInline?: boolean;
  hasDropDownBorder?: boolean;
  title?: string;
  placeholder?: string;
  containerStyleOverrides?: StyleOverride;
}

export interface SearchInputProps
  extends Omit<
    ComponentPropsWithoutRef<'input'>,
    'type' | 'role' | 'aria-autocomplete' | 'onChange'
  > {
  isExpanded: boolean;
  onClose: () => void;
  focusFontListFirstOption?: () => void;
  value: string;
  onChange: (value: string) => void;
}

// Either you specify options, or you specify a callback returning a promise. Not both, not neither.
export type DataListPropsOptions<O> =
  | { options: O[]; getOptionsByQuery: never }
  | { options: never; getOptionsByQuery: (query: string) => Promise<O[]> };

export type DataListProps<O extends AbstractOption> =
  DataListPropsOptions<O> & {
    onChange: (value: O) => void;
    disabled?: boolean;
    selectedId?: O['id'];
    hasSearch?: boolean;
    onObserve?: (options: string[]) => void;
    primaryOptions: O[];
    primaryLabel: string;
    priorityOptionGroups?: Group<O>[];
    searchResultsLabel: string;
    renderer?: OptionRenderer<O>;
    activeItemRender?: () => JSX.Element;
    isInline?: boolean;
    dropDownLabel: string;
    zIndex?: number;
    title?: string;
    dropdownButtonLabel: string;
    offsetOverride?: boolean;
    maxWidth?: number;
    activeItemRenderer?: FunctionComponent;
    highlightStylesOverride?: StyleOverride;
    hasDropDownBorder?: boolean;
    listStyleOverrides?: StyleOverride;
    containerStyleOverrides?: StyleOverride;
    className?: string;
    noMatchesFoundLabel?: string;
    searchPlaceholder?: string;
    getPrimaryOptions?: () => Promise<O[]>;
  };
