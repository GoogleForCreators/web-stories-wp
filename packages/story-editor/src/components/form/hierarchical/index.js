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
  Text,
  themeHelpers,
  THEME_CONSTANTS,
  useLiveRegion,
} from '@web-stories-wp/design-system';
import { __, _n, sprintf } from '@web-stories-wp/i18n';
import {
  useCallback,
  useDebouncedCallback,
  useEffect,
  useMemo,
  usePrevious,
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
  margin-top: -4px;
  border: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
  border-top: none;
  border-radius: ${({ theme }) =>
    `0 0 ${theme.borders.radius.small} ${theme.borders.radius.small}`};
`;

const CheckboxArea = styled.div`
  max-height: 175px;
  padding: 12px 12px 0 12px;
  overflow-y: scroll;

  ${themeHelpers.scrollbarCSS};
`;

const StepContainer = styled.div`
  margin-top: 4px;
  margin-left: 20px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const NoResultsText = styled(Text)`
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

/**
 * Renders a checkbox and all children of the checkbox.
 *
 * @param {Object} option The option to render.
 * @return {Node} The rendered option and children
 */
const Option = (option) => {
  const {
    id: optionId,
    label: optionLabel,
    options,
    onChange,
    ...checkboxProps
  } = option;

  return (
    <>
      <CheckboxContainer>
        <Checkbox
          {...checkboxProps}
          id={optionId}
          onChange={(evt) => onChange(evt, option)}
        />
        <Label htmlFor={optionId}>{optionLabel}</Label>
      </CheckboxContainer>
      {options?.map((child) => (
        <StepContainer key={child.id}>
          <Option onChange={onChange} {...child} />
        </StepContainer>
      ))}
    </>
  );
};
const OptionPropType = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  checked: PropTypes.bool,
  label: PropTypes.string.isRequired,
  options: PropTypes.array,
};
Option.propTypes = OptionPropType;

const HierarchicalInput = ({
  className,
  label,
  noOptionsText = __('Category Not Found', 'web-stories'),
  options,
  onChange,
  ...inputProps
}) => {
  const [inputText, setInputText] = useState('');
  const speak = useLiveRegion('assertive');
  const debouncedSpeak = useDebouncedCallback(speak, 500);

  const filteredOptionTree = useMemo(
    () => buildOptionsTree(options),
    [options]
  );

  const filteredOptions = filterOptionsByLabelText(
    filteredOptionTree,
    inputText
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

  const showOptionArea =
    Boolean(filteredOptions.length) || Boolean(inputText.length);

  return (
    <Container className={className}>
      <Input
        value={inputText}
        onChange={handleInputChange}
        label={label}
        type="search"
        {...inputProps}
      />
      {showOptionArea && (
        <Border>
          <DirectionAware>
            <CheckboxArea role="group">
              {filteredOptions.length ? (
                filteredOptions.map((option) => (
                  <Option
                    key={option.id}
                    {...option}
                    onChange={handleCheckboxChange}
                  />
                ))
              ) : (
                <NoResultsText
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
  noOptionsText: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      ...OptionPropType,
      parent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default HierarchicalInput;
