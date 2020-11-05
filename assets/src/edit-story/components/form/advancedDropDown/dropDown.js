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
import { useState, useCallback, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ReactComponent as DropDownIcon } from '../../../icons/dropdown.svg';
import Popup from '../../popup';
import OptionsContainer from './container';
import List from './list';

const DEFAULT_WIDTH = 240;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  color: ${({ theme }) => theme.colors.fg.black};
  font-family: ${({ theme }) => theme.fonts.body1.font};
`;

const DropDownSelect = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  background-color: ${({ theme, lightMode }) =>
    lightMode
      ? rgba(theme.colors.fg.white, 0.1)
      : rgba(theme.colors.bg.black, 0.3)};
  border-radius: 4px;
  padding: 2px 0 2px 6px;
  cursor: pointer;
  border: 0;

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.3;
    `}

  svg {
    width: 28px;
    height: 28px;
    color: ${({ theme, lightMode }) =>
      lightMode ? theme.colors.fg.white : rgba(theme.colors.fg.white, 0.3)};
  }
`;

const DropDownTitle = styled.span`
  user-select: none;
  color: ${({ theme }) => theme.colors.fg.white};
  font-family: ${({ theme }) => theme.fonts.label.family};
  font-size: ${({ theme }) => theme.fonts.label.size};
  line-height: ${({ theme }) => theme.fonts.label.lineHeight};
  font-weight: ${({ theme }) => theme.fonts.label.weight};
  letter-spacing: ${({ theme }) => theme.fonts.label.letterSpacing};
`;

/**
 * @param {Object} props All props.
 * @param {Function} props.onChange Triggered when user clicks on the option in the list.
 * @param {boolean} props.lightMode Lightmode.
 * @param {string} props.placeholder Displayed in the input when the dropdown is not open.
 * @param {boolean} props.disabled Disables opening the dropdown if set.
 * @param {number} props.selectedId The selected option ID.
 * @param {Array} props.options All options, used for search.
 * @param {boolean} props.hasSearch If to enable search feature in the dropdown.
 * @param {Function} props.getOptionsByQuery Function to query options in case options are not set.
 * @param {Function} props.onObserve When this is present, observer will detect new options coming into view and trigger the funcion for these entries.
 * @param {Array} props.primaryOptions Array of options to display by default, when the user hasn't searched.
 * @param {string} props.primaryLabel Label to display above the primary options.
 * @param {Array} props.priorityOptions Options to display in front of all the other options in a separate group (will not remove these from the `options`).
 * @param {string} props.priorityLabel Label to display in front of the priority options.
 * @param {Function} props.renderer Option renderer in case a custom renderer is required.
 * @return {*} Render.
 */
function DropDown({
  onChange,
  lightMode = false,
  placeholder = __('Select an Option', 'web-stories'),
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
  renderer,
  ...rest
}) {
  if (!options && !getOptionsByQuery) {
    throw new Error(
      'Dropdown initiated with invalid params: options or getOptionsByQuery has to be set'
    );
  }
  // If search is not enabled, always display all options.
  if (!hasSearch) {
    primaryOptions = options;
  }
  const ref = useRef();

  const [isOpen, setIsOpen] = useState(false);

  const closeDropDown = useCallback(() => {
    setIsOpen(false);
    // Restore focus
    if (ref.current) {
      ref.current.focus();
    }
  }, []);
  const toggleDropDown = useCallback(() => setIsOpen((val) => !val), []);
  // Must be debounced to account for clicking the select box again
  // (closing in useFocusOut and then opening again in onClick)
  const [debouncedCloseDropDown] = useDebouncedCallback(closeDropDown, 100);

  const handleSelect = useCallback(
    (option) => {
      onChange(option);
      setIsOpen(false);
      ref.current.focus();
    },
    [onChange]
  );

  const handleKeyPress = useCallback(
    ({ key }) => {
      if (
        !isOpen &&
        key === 'ArrowDown' &&
        document.activeElement === ref.current
      ) {
        setIsOpen(true);
      }
    },
    [isOpen]
  );

  const selectedOption = primaryOptions.find(({ id }) => id === selectedId);
  return (
    <Container onKeyDown={handleKeyPress}>
      <DropDownSelect
        onClick={toggleDropDown}
        aria-pressed={isOpen}
        aria-haspopup
        aria-expanded={isOpen}
        ref={ref}
        lightMode={lightMode}
        {...rest}
      >
        <DropDownTitle>{selectedOption?.name || placeholder}</DropDownTitle>
        <DropDownIcon />
      </DropDownSelect>
      {!disabled && (
        <Popup anchor={ref} isOpen={isOpen} fillWidth={DEFAULT_WIDTH}>
          <OptionsContainer
            isOpen={isOpen}
            onClose={debouncedCloseDropDown}
            getOptionsByQuery={getOptionsByQuery}
            hasSearch={hasSearch}
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
                renderer={renderer}
              />
            )}
          />
        </Popup>
      )}
    </Container>
  );
}

DropDown.propTypes = {
  selectedId: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  lightMode: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.array,
  hasSearch: PropTypes.bool,
  getOptionsByQuery: PropTypes.func,
  onObserve: PropTypes.func,
  primaryOptions: PropTypes.array,
  primaryLabel: PropTypes.string,
  priorityOptions: PropTypes.array,
  priorityLabel: PropTypes.string,
  renderer: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

export default DropDown;
