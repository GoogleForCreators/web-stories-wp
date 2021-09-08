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
  THEME_CONSTANTS,
} from '@web-stories-wp/design-system';
import { __, sprintf } from '@web-stories-wp/i18n';
import { useCallback, useMemo, useState } from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import { buildOptionsTree, filterOptionsByLabelText } from './utils';

const Label = styled(Text).attrs({
  forwardedAs: 'label',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  margin-left: 12px;
`;

const CheckboxArea = styled.div`
  padding: 8px 0;
`;

const StepContainer = styled.div`
  margin-top: 4px;
  margin-left: 20px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 0;
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
      <StepContainer>
        {options?.map((child) => (
          <Option key={child.id} onChange={onChange} {...child} />
        ))}
      </StepContainer>
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

const Hierarchical = ({ label, options, onChange, ...inputProps }) => {
  const [inputText, setInputText] = useState('');

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

  return (
    <>
      <Input
        value={inputText}
        onChange={handleInputChange}
        label={label}
        aria-label={sprintf(
          /* Translators: %s: Category grouping label. */
          __('Search %s', 'web-stories'),
          label
        )}
        type="search"
        {...inputProps}
      />
      <CheckboxArea role="group">
        {filteredOptions.map((option) => (
          <Option key={option.id} {...option} onChange={handleCheckboxChange} />
        ))}
      </CheckboxArea>
    </>
  );
};
Hierarchical.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape(OptionPropType)).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Hierarchical;
