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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';
import { useCallback, useRef, useState, useEffect } from 'react';
import Big from 'big.js';

/**
 * Internal dependencies
 */
import { defaultUnit } from '../../../animation/utils/defaultUnit';
import useFocusAndSelect from '../../utils/useFocusAndSelect';
import { useKeyDownEffect } from '../../../design-system';
import { MULTIPLE_VALUE, MULTIPLE_DISPLAY_VALUE } from '../../constants';
import Input from './input';

const ONCHANGE_DEBOUNCE_DELAY = 500;
const SELECT_CONTENTS_DELAY = 10;

const StyledInput = styled(Input)`
  width: 100%;
  flex: 1 1 auto;
  min-width: 0;
  border: none;
  padding-right: ${({ suffix }) => (suffix ? 6 : 0)}px;
  padding-left: ${({ prefix, label }) => (prefix || label ? 6 : 0)}px;
  letter-spacing: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.body2.letterSpacing};
  ${({ textCenter }) => textCenter && `text-align: center`};
`;

const Container = styled.div`
  color: ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.fg.white, 0.3)};
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.family};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.size};
  line-height: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.lineHeight};
  letter-spacing: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.body2.letterSpacing};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) =>
    rgba(theme.DEPRECATED_THEME.colors.bg.black, 0.3)};
  flex-basis: ${({ flexBasis }) => defaultUnit(flexBasis, 'px')};
  border: 1px solid;
  border-color: ${({ theme, focused }) =>
    focused ? theme.DEPRECATED_THEME.colors.whiteout : 'transparent'};
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
`;

const Suffix = styled.span`
  ${({ isSingleCharacter }) =>
    isSingleCharacter &&
    css`
      flex-shrink: 0;
      display: inline-block;
      width: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.size};
      text-align: center;
    `}
`;

// If value is valid, returns parsed value, else returns null
function validateInput(
  value,
  { float, canBeNegative, canBeEmpty, defaultValue }
) {
  if (`${value}`.length > 0) {
    const valueAsNumber = float ? parseFloat(value) : parseInt(value);
    const signedNumber = !canBeNegative
      ? Math.abs(valueAsNumber)
      : valueAsNumber;

    return !isNaN(signedNumber) ? signedNumber : defaultValue;
  } else if (canBeEmpty) {
    return '';
  }

  return defaultValue;
}

function Numeric({
  className,
  onBlur,
  onChange,
  prefix,
  suffix,
  label,
  symbol,
  value,
  float,
  flexBasis,
  disabled,
  min,
  max,
  canBeNegative,
  canBeEmpty,
  placeholder,
  ...rest
}) {
  const [inputValue, setInputValue] = useState(value);

  const inputRef = useRef();
  const targetFormRef = useRef(null);
  const skipValidationRef = useRef(false);
  const selectInputContents = useRef(false);
  const submitOnChangeTimeout = useRef(-1);

  const { focused, handleFocus, handleBlur } = useFocusAndSelect(inputRef);

  const isMultiple = inputValue === MULTIPLE_VALUE;
  placeholder = isMultiple ? MULTIPLE_DISPLAY_VALUE : placeholder;

  const handleChange = useCallback((event) => {
    // If the user types something in, clear timeout
    // so onChange doesn't get triggered with possibly
    // old value.
    window.clearTimeout(submitOnChangeTimeout.current);

    setInputValue(event.target.value);
  }, []);

  const submitOnChange = useCallback(
    (val, { selectContentOnUpdate }) => {
      selectInputContents.current = selectContentOnUpdate;
      onChange(val);
    },
    [onChange]
  );

  const validateAndSubmitInput = useCallback(
    (
      val,
      { ignoreValidation, selectContentOnUpdate, debounceOnChange } = {}
    ) => {
      targetFormRef.current = inputRef.current.form;

      const validValue = ignoreValidation
        ? val
        : validateInput(val, {
            canBeNegative,
            canBeEmpty,
            float,
            defaultValue: value,
          });

      setInputValue(validValue);

      window.clearTimeout(submitOnChangeTimeout.current);
      if (debounceOnChange) {
        submitOnChangeTimeout.current = window.setTimeout(() => {
          submitOnChange(validValue, { selectContentOnUpdate });
        }, ONCHANGE_DEBOUNCE_DELAY);
      } else {
        submitOnChange(validValue, { selectContentOnUpdate });
      }
    },
    [canBeNegative, canBeEmpty, float, value, submitOnChange]
  );

  const handleUpDown = useCallback(
    ({ key, altKey }) => {
      if (isMultiple) {
        return;
      }

      const validValue = validateInput(inputValue, {
        canBeNegative,
        canBeEmpty,
        float,
        defaultValue: value,
      });

      // The `|| 0` is to prevent newValue from being set to
      // empty string which could be a valid value
      let newValue = validValue || 0;
      const diff = Big(float && altKey ? 0.1 : 1);
      if (key === 'ArrowUp') {
        // Increment value
        newValue =
          typeof max !== 'undefined'
            ? Math.min(max, Big(newValue).plus(diff))
            : Big(newValue).plus(diff);
      } else if (key === 'ArrowDown') {
        // Decrement value
        newValue =
          typeof min !== 'undefined'
            ? Math.max(min, Big(newValue).minus(diff))
            : Big(newValue).minus(diff);
      }

      validateAndSubmitInput(Number(newValue), {
        ignoreValidation: true,
        selectContentOnUpdate: true,
        debounceOnChange: true,
      });
    },
    [
      isMultiple,
      float,
      max,
      inputValue,
      value,
      min,
      canBeNegative,
      canBeEmpty,
      validateAndSubmitInput,
    ]
  );

  const handleEsc = useCallback(() => {
    // Revert input value and exit input focus without
    // triggering blur validation
    setInputValue(value);
    skipValidationRef.current = true;
    inputRef.current.blur();
  }, [value]);

  const handleEnter = useCallback(() => {
    validateAndSubmitInput(inputValue, { selectContentOnUpdate: true });
  }, [validateAndSubmitInput, inputValue]);

  const submitForm = useCallback(() => {
    if (targetFormRef.current) {
      targetFormRef.current.dispatchEvent(
        new window.Event('submit', { cancelable: true })
      );

      // Resetting to null after dispatch, it'll get
      // re-assigned on component blur
      targetFormRef.current = null;
    }
  }, []);

  useKeyDownEffect(
    inputRef,
    {
      key: ['up', 'alt+up', 'down', 'alt+down'],
      editable: true,
    },
    handleUpDown,
    [handleUpDown]
  );

  useKeyDownEffect(
    inputRef,
    {
      key: ['escape'],
      editable: true,
    },
    handleEsc,
    [handleEsc]
  );

  useKeyDownEffect(
    inputRef,
    {
      key: ['enter'],
      editable: true,
    },
    handleEnter,
    [handleEnter]
  );

  useEffect(() => {
    if (targetFormRef.current) {
      submitForm();
    }

    setInputValue(value);
  }, [submitForm, value]);

  useEffect(() => {
    let selectContentsTimeout = -1;

    if (selectInputContents.current) {
      if (inputRef.current) {
        inputRef.current.select();
      }

      // When we want to select the content of the input
      // we hold open the door for a slight moment to allow
      // all the data to flush down the pipeline.
      selectContentsTimeout = window.setTimeout(() => {
        selectInputContents.current = false;
      }, SELECT_CONTENTS_DELAY);
    }

    return () => {
      window.clearTimeout(selectContentsTimeout);
    };
  }, [inputValue]);

  useEffect(() => {
    return () => {
      // Make sure we clearout any remaining timeouts on unmount
      window.clearTimeout(submitOnChangeTimeout.current);
    };
  }, []);

  return (
    <Container
      className={`${className}`}
      flexBasis={flexBasis}
      focused={focused}
      disabled={disabled}
    >
      {label}
      {prefix}
      {/* type="text" is default but added here due to an a11y-related bug. See https://github.com/A11yance/aria-query/pull/42 */}
      <StyledInput
        type="text"
        ref={inputRef}
        placeholder={placeholder}
        prefix={prefix}
        suffix={suffix}
        label={label}
        value={isMultiple ? '' : `${inputValue}${focused ? '' : symbol}`}
        disabled={disabled}
        {...rest}
        onChange={handleChange}
        onBlur={() => {
          if (!skipValidationRef.current) {
            validateAndSubmitInput(inputValue);
          }

          // Reset flag after use
          skipValidationRef.current = false;

          if (onBlur) {
            onBlur();
          }

          handleBlur();
        }}
        onFocus={handleFocus}
      />
      {suffix && (
        <Suffix isSingleCharacter={suffix.length === 1}>{suffix}</Suffix>
      )}
    </Container>
  );
}

Numeric.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  prefix: PropTypes.any,
  suffix: PropTypes.any,
  disabled: PropTypes.bool,
  symbol: PropTypes.string,
  flexBasis: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  textCenter: PropTypes.bool,
  float: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  canBeNegative: PropTypes.bool,
  canBeEmpty: PropTypes.bool,
  placeholder: PropTypes.string,
};

Numeric.defaultProps = {
  className: null,
  disabled: false,
  symbol: '',
  flexBasis: 110,
  textCenter: false,
  float: false,
  canBeNegative: false,
  canBeEmpty: false,
};

export default Numeric;
