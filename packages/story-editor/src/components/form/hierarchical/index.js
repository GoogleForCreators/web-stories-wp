/*
 * Copyright 2021 Google LLC
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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Checkbox,
  Input,
  KEYS,
  Text,
  themeHelpers,
  THEME_CONSTANTS,
  useKeyDownEffect,
  useLiveRegion,
} from '@googleforcreators/design-system';
import { _n, sprintf, __ } from '@googleforcreators/i18n';
import {
  useCallback,
  useDebouncedCallback,
  useEffect,
  usePrevious,
  useRef,
  useState,
} from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import DirectionAware from '../../directionAware';
import { makeFlatOptionTree } from './utils';

export { makeFlatOptionTree };

const Container = styled.div`
  margin-bottom: 8px;
  display: block;
`;

const Label = styled(Text).attrs({
  forwardedAs: 'label',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  margin: 0 12px;
`;

const Border = styled.div`
  padding-top: 4px;
  margin-top: -4px; /* Run side borders into the search border  */
  border: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
  border-top: none;
  border-radius: ${({ theme }) =>
    `0 0 ${theme.borders.radius.small} ${theme.borders.radius.small}`};
`;

const CheckboxArea = styled.ul`
  max-height: 175px;
  padding: 12px 12px 0 12px;
  overflow-y: scroll;
  margin-top: 4px;
  margin-bottom: 0;

  ${themeHelpers.scrollbarCSS};

  :focus-within {
    ${({ theme }) =>
      themeHelpers.focusCSS(
        theme.colors.border.focus,
        theme.colors.bg.secondary
      )};
  }
`;

const CheckboxContainer = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  margin-left: ${({ $level }) => 20 * $level}px;
`;

const NoResultsText = styled(Text)`
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

const buildOptionId = (id) => `hierarchical_term_option_${id}`;
const buildOptionName = (name) => `hierarchical_term_${name}`;

/**
 * Renders a checkbox and all children of the checkbox.
 *
 * @param {Object} option The option to render.
 * @param {string} option.id the option id
 * @param {string} option.label The label of the checkbox
 * @param {Function} option.onChange Change event handler
 * @param {boolean} option.checked The value of the checkbox
 * @param {Object} option.optionRefs Ref used to store refs to checkboxes.
 * @param {number} option.$level The indentation level.
 * @return {Node} The rendered option and children.
 */
const Option = ({ optionRefs = { current: {} }, $level = 0, ...option }) => {
  const { id, label, onBlur, onChange, onFocus, checked, value } = option;

  const optionId = buildOptionId(option.id);
  const optionName = buildOptionName(option.label);

  return (
    <CheckboxContainer aria-selected={checked} role="treeitem" $level={$level}>
      <Checkbox
        id={optionId}
        ref={(node) => {
          optionRefs.current[id] = node;
        }}
        value={value}
        checked={checked}
        name={optionName}
        onChange={(evt) => onChange(evt, option)}
        onBlur={onBlur}
        onFocus={onFocus}
        tabIndex={-1}
      />
      <Label htmlFor={optionId}>{label}</Label>
    </CheckboxContainer>
  );
};
const OptionPropType = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  checked: PropTypes.bool,
  label: PropTypes.string.isRequired,
  $level: PropTypes.number,
  optionRefs: PropTypes.shape({
    current: PropTypes.shape({
      [PropTypes.string.isRequired]: PropTypes.node,
    }),
  }),
};
Option.propTypes = OptionPropType;

/**
 * Hierarchical input
 *
 * @param {Object} props props
 * @param {string} props.className Class name to add to outer container
 * @param {string} props.inputValue The value of the input
 * @param {Function} props.onInputChange The change event handler of the input
 * @param {string} props.label Input label
 * @param {string} props.noOptionsText Text to display no options are found
 * @param {Array} props.options Array of options
 * @param {Function} props.onChange Change event handler. Passed to checkboxes.
 * @return {Node} The input
 */
const HierarchicalInput = ({
  className,
  inputValue,
  onInputChange,
  label,
  noOptionsText,
  options,
  onChange,
  ...inputProps
}) => {
  const speak = useLiveRegion('assertive');
  const debouncedSpeak = useDebouncedCallback(speak, 500);
  const checkboxListRef = useRef(null);
  const inputRef = useRef(null);

  // Focus handling
  const [focusedCheckboxId, setFocusedCheckboxId] = useState(-1);
  const optionRefs = useRef({});

  /**
   * Handles listbox and checkbox focus.
   *
   * When listbox receives focus:
   * - If none of the options are selected before the listbox receives focus, focus is set on the first option.
   * - If one or more options are selected before the listbox receives focus, focus is set on the first option in the list that is selected.
   */
  const handleListboxFocus = useCallback(
    (evt) => {
      if (document.activeElement === checkboxListRef.current) {
        if (!options.length) {
          return;
        }

        // If the focus came from inside the list, focus input
        // only happens when tabbing backwards
        if (checkboxListRef.current.contains(evt.relatedTarget)) {
          inputRef.current?.focus();
          return;
        }

        // if there wasn't an option focused, find first selected
        if (focusedCheckboxId === -1) {
          const firstCheckedOption = options.find(
            (option) => option.checked
          )?.id;

          setFocusedCheckboxId(firstCheckedOption ? firstCheckedOption : 0);
        } else {
          // else focus the previously focused option
          optionRefs.current[focusedCheckboxId]?.focus();
        }
      }
    },
    [focusedCheckboxId, options]
  );

  /**
   * Handle keyboard interactions.
   */
  const handleKeyDown = useCallback(
    (evt) => {
      const currentSelectedIndex = options.findIndex(
        (option) => option.id === focusedCheckboxId
      );

      switch (evt.key) {
        case KEYS.UP:
          if (currentSelectedIndex > 0) {
            setFocusedCheckboxId(options[currentSelectedIndex - 1].id);
          }
          break;
        case KEYS.DOWN:
          if (currentSelectedIndex < options.length - 1) {
            setFocusedCheckboxId(options[currentSelectedIndex + 1].id);
          }
          break;
        default:
          break;
      }
    },
    [options, focusedCheckboxId]
  );

  /**
   * Sets the value that filters the displayed items.
   */
  const handleInputChange = useCallback(
    (evt) => {
      onInputChange(evt.target.value);
    },
    [onInputChange]
  );

  /**
   * Callback that is called when a checkbox is clicked.
   */
  const handleCheckboxChange = useCallback(
    (evt, option) => {
      onChange(evt, { id: option.id, checked: !option.checked });
    },
    [onChange]
  );

  /* Announce count of results found */
  const previousInput = usePrevious(inputValue);
  useEffect(() => {
    // only run effect when input changes. Ignore when options change.
    if (previousInput !== inputValue) {
      const count = options.length;

      const message = sprintf(
        /* Translators: %d: Number of results. */
        _n('%d result found.', '%d results found.', count, 'web-stories'),
        count
      );

      debouncedSpeak(message);
    }
  }, [debouncedSpeak, options, inputValue, previousInput]);

  useKeyDownEffect(
    checkboxListRef,
    { key: ['up', 'down', 'shift+up', 'shift+down'] },
    handleKeyDown,
    [handleKeyDown]
  );

  /**
   * Focus checkbox when 'focusedCheckboxId' changes
   */
  useEffect(() => {
    // only focus checkbox if focus is in the list
    if (checkboxListRef.current?.contains(document.activeElement)) {
      optionRefs.current[focusedCheckboxId]?.focus();
    }
  }, [focusedCheckboxId]);

  const showOptionArea = Boolean(options.length) || Boolean(inputValue.length);

  return (
    <Container className={className}>
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        label={label}
        type="search"
        placeholder={__('Search', 'web-stories')}
        {...inputProps}
      />
      {showOptionArea && (
        <Border>
          <DirectionAware>
            <CheckboxArea
              id="checkbox_list"
              ref={checkboxListRef}
              tabIndex={0}
              onFocus={handleListboxFocus}
              role="tree"
              aria-activedescendant={
                focusedCheckboxId !== -1
                  ? buildOptionId(focusedCheckboxId)
                  : undefined
              }
              aria-multiselectable
            >
              {options.length ? (
                options.map((option) => (
                  <Option
                    key={option.id}
                    {...option}
                    onChange={handleCheckboxChange}
                    optionRefs={optionRefs}
                  />
                ))
              ) : (
                <NoResultsText
                  role="treeitem"
                  size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                >
                  {noOptionsText}
                </NoResultsText>
              )}
            </CheckboxArea>
          </DirectionAware>
        </Border>
      )}
    </Container>
  );
};
HierarchicalInput.propTypes = {
  className: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  inputValue: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  noOptionsText: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape(OptionPropType)).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default HierarchicalInput;
