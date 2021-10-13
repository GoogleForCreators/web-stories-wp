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
} from '@web-stories-wp/design-system';
import { _n, sprintf, __ } from '@web-stories-wp/i18n';
import {
  useCallback,
  useDebouncedCallback,
  useEffect,
  useMemo,
  usePrevious,
  useRef,
  useState,
} from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import DirectionAware from '../../directionAware';
import {
  buildOptionsTree,
  getOptionCount,
  filterOptionsByLabelText,
  flattenOptionsTree,
} from './utils';

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
 * @param {Object} option.optionRefs Ref used to store refs to checkboxes.
 * @param {number} option.level The indentation level.
 * @return {Node} The rendered option and children.
 */
const Option = ({ optionRefs = { current: {} }, level = 0, ...option }) => {
  const { id, label, options, onChange, checked, value } = option;

  const optionId = buildOptionId(id);
  const optionName = buildOptionName(label);

  const hasChildren = Boolean(options?.length);

  return (
    <>
      <CheckboxContainer aria-selected={checked} role="treeitem" $level={level}>
        <Checkbox
          id={optionId}
          value={value}
          checked={checked}
          name={optionName}
          onChange={(evt) => onChange(evt, option)}
          tabIndex={-1}
          ref={(node) => {
            optionRefs.current[id] = node;
          }}
        />
        <Label htmlFor={optionId}>{label}</Label>
      </CheckboxContainer>
      {hasChildren &&
        options.map((child) => (
          <Option
            key={child.id}
            level={level + 1}
            onChange={onChange}
            optionRefs={optionRefs}
            {...child}
          />
        ))}
    </>
  );
};
const OptionPropType = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  checked: PropTypes.bool,
  label: PropTypes.string.isRequired,
  level: PropTypes.number,
  optionRefs: PropTypes.shape({
    current: PropTypes.shape({
      [PropTypes.string.isRequired]: PropTypes.node,
    }),
  }),
  options: PropTypes.array,
};
Option.propTypes = OptionPropType;

const HierarchicalInput = ({
  className,
  label,
  noOptionsText,
  options,
  onChange,
  ...inputProps
}) => {
  const [inputText, setInputText] = useState('');
  const speak = useLiveRegion('assertive');
  const debouncedSpeak = useDebouncedCallback(speak, 500);
  const checkboxListRef = useRef(null);

  // Focus handling
  const [focusedCheckboxId, setFocusedCheckboxId] = useState(-1);
  const optionRefs = useRef({});

  const filteredOptionTree = useMemo(
    () => buildOptionsTree(options),
    [options]
  );

  const filteredOptions = useMemo(
    () => filterOptionsByLabelText(filteredOptionTree, inputText),
    [filteredOptionTree, inputText]
  );

  const flattenedOrderedOptions = useMemo(
    () => flattenOptionsTree(filteredOptions),
    [filteredOptions]
  );

  /**
   * Handles listbox and checkbox focus.
   *
   * When listbox receives focus:
   * - If none of the options are selected before the listbox receives focus, focus is set on the first option.
   * - If one or more options are selected before the listbox receives focus, focus is set on the first option in the list that is selected.
   */
  const handleListboxFocus = useCallback(() => {
    if (document.activeElement === checkboxListRef.current) {
      if (!flattenedOrderedOptions.length) {
        return;
      }

      const selectedId = flattenedOrderedOptions.find(
        (option) => option.checked
      )?.id;

      setFocusedCheckboxId(selectedId || selectedId === 0 ? selectedId : -1);
    }
  }, [flattenedOrderedOptions]);

  /**
   * Handle keyboard interactions.
   */
  const handleKeyDown = useCallback(
    (evt) => {
      const currentSelectedIndex = flattenedOrderedOptions.findIndex(
        (option) => option.id === focusedCheckboxId
      );

      switch (evt.key) {
        case KEYS.UP:
          if (currentSelectedIndex > 0) {
            setFocusedCheckboxId(
              flattenedOrderedOptions[currentSelectedIndex - 1].id
            );
          }
          break;
        case KEYS.DOWN:
          if (currentSelectedIndex < flattenedOrderedOptions.length - 1) {
            setFocusedCheckboxId(
              flattenedOrderedOptions[currentSelectedIndex + 1].id
            );
          }
          break;
        default:
          evt.propagate();
          break;
      }
    },
    [flattenedOrderedOptions, focusedCheckboxId]
  );

  /**
   * Sets the value that filters the displayed items.
   */
  const handleInputChange = useCallback((evt) => {
    setInputText(evt.target.value);
  }, []);

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
  const previousInput = usePrevious(inputText);
  useEffect(() => {
    // only run effect when input changes. Ignore when options change.
    if (previousInput !== inputText) {
      const count = getOptionCount(filteredOptions);

      const message = sprintf(
        /* Translators: %d: Number of results. */
        _n(
          '%d result found.',
          '%d results found.',
          'web-stories',
          'web-stories'
        ),
        count
      );

      debouncedSpeak(message);
    }
  }, [debouncedSpeak, filteredOptions, inputText, previousInput]);

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
    optionRefs.current[focusedCheckboxId]?.focus();
  }, [focusedCheckboxId]);

  const showOptionArea =
    Boolean(filteredOptions.length) || Boolean(inputText.length);

  return (
    <Container className={className}>
      <Input
        value={inputText}
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
              {filteredOptions.length ? (
                filteredOptions.map((option) => (
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
  label: PropTypes.string.isRequired,
  noOptionsText: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      ...OptionPropType,
      parent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default HierarchicalInput;
