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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { themeHelpers } from '../../theme';
import { DropDownSelect } from '../dropDown';
import { Popup } from '../popup';
import OptionsContainer from './container';
import List from './list';

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

/**
 * @param {Object} props All props.
 * @param {Function} props.onChange Triggered when user clicks on the option in the list.
 * @param {boolean} props.disabled Disables opening the dropdown if set.
 * @param {number} props.selectedId The selected option ID.
 * @param {Array} props.options All options, used for search.
 * @param {boolean} props.hasSearch If to enable search feature in the dropdown.
 * @param {Function} props.getOptionsByQuery Function to query options in case options are not set.
 * @param {Function} props.onObserve When this is present, observer will detect new options coming into view and trigger the function for these entries.
 * @param {Array} props.primaryOptions Array of options to display by default when not searching
 * @param {string} props.primaryLabel Label to display above the primary options.
 * @param {Array} props.priorityOptionGroups Groups of options to display in front of all the other options (will not remove these from the `options`).
 * @param {string} props.searchResultsLabel Label to display in front of matching options when searching.
 * @param {Function} props.renderer Option renderer in case a custom renderer is required.
 * @param {Function} props.activeItemRenderer Active item renderer in case a activeItemLabel is not enough.
 * @param {boolean} props.isInline If to display the selection list inline instead of as a separate popup modal.
 * @param {string} props.dropDownLabel The visible label of the dropdown select.
 * @param {number} props.zIndex an override for default zIndex of popup
 * @param {string} props.title The title of the dialog (popup) container of the list.
 * @param {string} props.dropdownButtonLabel The label attached to the unexpanded datalist (button)
 * @param {boolean} props.offsetOverride override popup offsets updates, use x and y offset based on anchor
 * @param {number} props.maxWidth sets a max-width on the Popup component
 * @return {*} Render.
 */
const Datalist = forwardRef(function Datalist(
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
  },
  ref
) {
  const searchRef = useRef();
  const listRef = useRef();
  if (!options && !getOptionsByQuery) {
    throw new Error(
      'Dropdown initiated with invalid params: options or getOptionsByQuery has to be set'
    );
  }
  // If search is not enabled, always display all options.
  if (!hasSearch) {
    primaryOptions = options;
  }
  const internalRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [_primaryOptions, _setPrimaryOptions] = useState([]);

  const closeDropDown = useCallback(() => {
    setIsOpen(false);
    // Restore focus
    internalRef.current?.focus();
  }, [internalRef]);

  const toggleDropDown = useCallback(() => setIsOpen((val) => !val), []);
  // Must be debounced to account for clicking the select box again
  // (closing in useFocusOut and then opening again in onClick)
  const debouncedCloseDropDown = useDebouncedCallback(closeDropDown, 100);

  const handleSelect = useCallback(
    (option) => {
      onChange(option);
      setIsOpen(false);
      internalRef.current?.focus();
    },
    [onChange, internalRef]
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
        <List
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

  const DropDownSelectRef = useCallback(
    (node) => {
      // `ref` can either be a callback ref or a normal ref.
      if (typeof ref == 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      internalRef.current = node;
    },
    [ref]
  );

  // Logic for fetching primaryOptions
  useEffect(() => {
    if (getPrimaryOptions) {
      getPrimaryOptions().then((res) => {
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
        ref={DropDownSelectRef}
        activeItemLabel={selectedOption?.name}
        activeItemRenderer={activeItemRenderer}
        dropDownLabel={dropDownLabel}
        onSelectClick={toggleDropDown}
        selectButtonStylesOverride={highlightStylesOverride || focusStyle}
        aria-label={dropdownButtonLabel}
        {...rest}
      />
      {isOpen && !disabled && isInline && list}
      {!disabled && !isInline && (
        <Popup
          anchor={internalRef}
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

Datalist.propTypes = {
  selectedId: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.array,
  hasSearch: PropTypes.bool,
  getOptionsByQuery: PropTypes.func,
  highlightStylesOverride: PropTypes.array,
  onObserve: PropTypes.func,
  primaryOptions: PropTypes.array,
  primaryLabel: PropTypes.string,
  priorityOptionGroups: PropTypes.array,
  searchResultsLabel: PropTypes.string,
  renderer: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  activeItemRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  dropDownLabel: PropTypes.string,
  isInline: PropTypes.bool,
  hasDropDownBorder: PropTypes.bool,
  zIndex: PropTypes.number,
  containerStyleOverrides: PropTypes.array,
  listStyleOverrides: PropTypes.array,
  title: PropTypes.string,
  dropdownButtonLabel: PropTypes.string,
  offsetOverride: PropTypes.bool,
  maxWidth: PropTypes.number,
  getPrimaryOptions: PropTypes.func,
};

export default Datalist;
