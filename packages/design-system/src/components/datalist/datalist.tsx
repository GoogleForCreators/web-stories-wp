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
import {
  useState,
  useCallback,
  useRef,
  forwardRef,
  useDebouncedCallback,
  useEffect,
} from '@googleforcreators/react';
import styled, { css } from 'styled-components';
import type { ForwardedRef } from 'react';

/**
 * Internal dependencies
 */
import { themeHelpers } from '../../theme';
import useForwardedRef from '../../utils/useForwardedRef';
import { DropDownSelect } from '../dropDown';
import { Popup } from '../popup';
import OptionsContainer from './container';
import OptionList from './list';
import type { AbstractOption, DataListProps } from './types';

const focusStyle = css`
  ${({ theme }) =>
    themeHelpers.focusableOutlineCSS(
      theme.colors.border.focus,
      theme.colors.bg.secondary
    )};
`;

const DEFAULT_WIDTH = 240;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Datalist = forwardRef(function Datalist<O extends AbstractOption>(
  {
    onChange,
    disabled = false,
    selectedId,
    options,
    hasSearch = false,
    getOptionsByQuery,
    onObserve,
    primaryOptions,
    primaryLabel,
    priorityOptionGroups,
    searchResultsLabel,
    renderer,
    activeItemRenderer,
    isInline = false,
    dropDownLabel = '',
    highlightStylesOverride,
    hasDropDownBorder = false,
    zIndex,
    listStyleOverrides,
    containerStyleOverrides,
    title,
    dropdownButtonLabel,
    className,
    offsetOverride = false,
    noMatchesFoundLabel,
    searchPlaceholder,
    maxWidth,
    getPrimaryOptions,
    ...rest
  }: DataListProps<O>,
  forwardedRef: ForwardedRef<HTMLButtonElement>
) {
  const ref = useForwardedRef(forwardedRef);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  if (!options && !getOptionsByQuery) {
    throw new Error(
      'Dropdown initiated with invalid params: options or getOptionsByQuery has to be set'
    );
  }
  // If search is not enabled, always display all options.
  if (!hasSearch) {
    primaryOptions = options;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [_primaryOptions, _setPrimaryOptions] = useState<O[]>([]);

  const closeDropDown = useCallback(() => {
    setIsOpen(false);
    // Restore focus
    ref.current?.focus();
  }, [ref]);

  const toggleDropDown = useCallback(() => setIsOpen((val) => !val), []);
  // Must be debounced to account for clicking the select box again
  // (closing in useFocusOut and then opening again in onClick)
  const debouncedCloseDropDown = useDebouncedCallback(closeDropDown, 100);

  const handleSelect = useCallback(
    (option: O) => {
      onChange(option);
      setIsOpen(false);
      ref.current?.focus();
    },
    [onChange, ref]
  );

  const focusSearch = useCallback(() => {
    searchRef.current?.focus();
  }, []);

  const list = (
    <OptionsContainer
      ref={searchRef}
      isOpen={isOpen}
      onClose={debouncedCloseDropDown}
      getOptionsByQuery={getOptionsByQuery}
      hasSearch={hasSearch}
      isInline={isInline}
      title={title}
      hasDropDownBorder={hasDropDownBorder}
      containerStyleOverrides={containerStyleOverrides}
      placeholder={searchPlaceholder}
      renderContents={({
        searchKeyword,
        setIsExpanded,
        trigger,
        queriedOptions,
        listId,
      }) => (
        <OptionList
          ref={listRef}
          listId={listId}
          value={selectedId}
          keyword={searchKeyword}
          onSelect={handleSelect}
          onClose={debouncedCloseDropDown}
          onExpandedChange={setIsExpanded}
          focusTrigger={trigger}
          onObserve={onObserve}
          options={options || queriedOptions}
          primaryOptions={_primaryOptions}
          primaryLabel={primaryLabel}
          priorityOptionGroups={priorityOptionGroups}
          searchResultsLabel={searchResultsLabel}
          focusSearch={focusSearch}
          renderer={renderer}
          listStyleOverrides={listStyleOverrides}
          noMatchesFoundLabel={noMatchesFoundLabel}
        />
      )}
    />
  );

  // Logic for fetching primaryOptions
  useEffect(() => {
    if (getPrimaryOptions) {
      void getPrimaryOptions().then((res) => {
        _setPrimaryOptions(res);
      });
    } else if (primaryOptions) {
      _setPrimaryOptions(primaryOptions);
    }
  }, [
    _setPrimaryOptions,
    getOptionsByQuery,
    getPrimaryOptions,
    primaryOptions,
  ]);

  const selectedOption = _primaryOptions.find(({ id }) => id === selectedId);
  // In case of isInline, the list is displayed with 'absolute' positioning instead of using a separate popup.
  return (
    <Container className={className}>
      <DropDownSelect
        aria-pressed={isOpen}
        aria-haspopup
        aria-expanded={isOpen}
        ref={ref}
        activeItemLabel={selectedOption?.name}
        activeItemRenderer={activeItemRenderer}
        dropDownLabel={dropDownLabel}
        onSelectClick={toggleDropDown}
        selectButtonStylesOverride={highlightStylesOverride || focusStyle}
        aria-label={dropdownButtonLabel}
        isOpen={isOpen}
        disabled={disabled}
        {...rest}
      />
      {isOpen && !disabled && isInline && list}
      {!disabled && !isInline && (
        <Popup
          anchor={ref}
          isOpen={isOpen}
          zIndex={zIndex}
          offsetOverride={offsetOverride}
          maxWidth={maxWidth || DEFAULT_WIDTH}
          fillWidth
        >
          {list}
        </Popup>
      )}
    </Container>
  );
});

export default Datalist;
