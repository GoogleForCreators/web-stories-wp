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
import { useState, useCallback, useRef, forwardRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { DropDownSelect } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import Popup from '../../popup';
import { focusStyle } from '../../panels/shared';
import OptionsContainer from './container';
import List from './list';

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
 * @param {Array} props.priorityOptions Options to display in front of all the other options in a separate group (will not remove these from the `options`).
 * @param {string} props.priorityLabel Label to display in front of the priority options.
 * @param {string} props.searchResultsLabel Label to display in front of matching options when searching.
 * @param {Function} props.renderer Option renderer in case a custom renderer is required.
 * @param {boolean} props.isInline If to display the selection list inline instead of as a separate popup modal.
 * @param {string} props.dropDownLabel The visible label of the dropdown select.
 * @return {*} Render.
 */
const DropDown = forwardRef(function DropDown(
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
    priorityOptions,
    priorityLabel,
    searchResultsLabel,
    renderer,
    isInline = false,
    dropDownLabel = '',
    highlightStylesOverride,
    ...rest
  },
  ref
) {
  if (!options && !getOptionsByQuery) {
    throw new Error(
      'Dropdown initiated with invalid params: options or getOptionsByQuery has to be set'
    );
  }
  // If search is not enabled, always display all options.
  if (!hasSearch) {
    primaryOptions = options;
  }
  const localRef = useRef();
  const dropdownRef = ref || localRef;

  const [isOpen, setIsOpen] = useState(false);

  const closeDropDown = useCallback(() => {
    setIsOpen(false);
    // Restore focus
    if (dropdownRef.current) {
      dropdownRef.current.focus();
    }
  }, [dropdownRef]);

  const toggleDropDown = useCallback(() => setIsOpen((val) => !val), []);
  // Must be debounced to account for clicking the select box again
  // (closing in useFocusOut and then opening again in onClick)
  const debouncedCloseDropDown = useDebouncedCallback(closeDropDown, 100);

  const handleSelect = useCallback(
    (option) => {
      onChange(option);
      setIsOpen(false);
      dropdownRef.current.focus();
    },
    [onChange, dropdownRef]
  );

  const list = (
    <OptionsContainer
      isOpen={isOpen}
      onClose={debouncedCloseDropDown}
      getOptionsByQuery={getOptionsByQuery}
      hasSearch={hasSearch}
      isInline={isInline}
      renderContents={({
        searchKeyword,
        setIsExpanded,
        trigger,
        queriedOptions,
        listId,
      }) => (
        <List
          listId={listId}
          value={selectedId}
          keyword={searchKeyword}
          onSelect={handleSelect}
          onClose={debouncedCloseDropDown}
          onExpandedChange={setIsExpanded}
          focusTrigger={trigger}
          onObserve={onObserve}
          options={options || queriedOptions}
          primaryOptions={primaryOptions}
          primaryLabel={primaryLabel}
          priorityOptions={priorityOptions}
          priorityLabel={priorityLabel}
          searchResultsLabel={searchResultsLabel}
          renderer={renderer}
        />
      )}
    />
  );

  const selectedOption = primaryOptions.find(({ id }) => id === selectedId);
  // In case of isInline, the list is displayed with 'absolute' positioning instead of using a separate popup.
  return (
    <Container>
      <DropDownSelect
        aria-pressed={isOpen}
        aria-haspopup
        aria-expanded={isOpen}
        ref={dropdownRef}
        activeItemLabel={selectedOption?.name}
        dropDownLabel={dropDownLabel}
        onSelectClick={toggleDropDown}
        selectButtonStylesOverride={highlightStylesOverride || focusStyle}
        {...rest}
      />
      {isOpen && !disabled && isInline && list}
      {!disabled && !isInline && (
        <Popup anchor={dropdownRef} isOpen={isOpen} fillWidth={DEFAULT_WIDTH}>
          {list}
        </Popup>
      )}
    </Container>
  );
});

DropDown.propTypes = {
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
  priorityOptions: PropTypes.array,
  priorityLabel: PropTypes.string,
  searchResultsLabel: PropTypes.string,
  renderer: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  dropDownLabel: PropTypes.string,
  isInline: PropTypes.bool,
};

export default DropDown;
