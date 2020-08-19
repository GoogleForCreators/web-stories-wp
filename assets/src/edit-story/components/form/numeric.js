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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rgba } from 'polished';
import { useCallback, useRef, useState, useEffect } from 'react';
import Big from 'big.js';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import useFocusAndSelect from '../../utils/useFocusAndSelect';
import { useKeyDownEffect } from '../keyboard';
import Input from './input';
import MULTIPLE_VALUE from './multipleValue';

const DECIMAL_POINT = (1.1).toLocaleString().substring(1, 2);

const StyledInput = styled(Input)`
  width: 100%;
  flex: 1 1 auto;
  min-width: 0;
  border: none;
  padding-right: ${({ suffix }) => (suffix ? 6 : 0)}px;
  padding-left: ${({ prefix, label }) => (prefix || label ? 6 : 0)}px;
  letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing};
  ${({ textCenter }) => textCenter && `text-align: center`};
`;

const Container = styled.div`
  color: ${({ theme }) => rgba(theme.colors.fg.white, 0.3)};
  font-family: ${({ theme }) => theme.fonts.body2.family};
  font-size: ${({ theme }) => theme.fonts.body2.size};
  line-height: ${({ theme }) => theme.fonts.body2.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => rgba(theme.colors.bg.black, 0.3)};
  flex-basis: ${({ flexBasis }) => flexBasis}px;
  border: 1px solid;
  border-color: ${({ theme, focused }) =>
    focused ? theme.colors.whiteout : 'transparent'};
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
`;

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
  ...rest
}) {
  const isMultiple = value === MULTIPLE_VALUE;
  const placeholder = isMultiple ? __('multiple', 'web-stories') : '';
  const [dot, setDot] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const ref = useRef();

  useEffect(() => setInputValue(value), [value]);

  const handleUpDown = useCallback(
    ({ key, altKey }) => {
      if (isMultiple) {
        return;
      }

      let newValue;
      const diff = Big(float && altKey ? 0.1 : 1);
      if (key === 'ArrowUp') {
        // Increment value
        newValue =
          typeof max !== 'undefined'
            ? Math.min(max, Big(value).plus(diff))
            : Big(value).plus(diff);
      } else if (key === 'ArrowDown') {
        // Decrement value
        newValue =
          typeof min !== 'undefined'
            ? Math.max(min, Big(value).minus(diff))
            : Big(value).minus(diff);
      }
      onChange(parseFloat(newValue.toString()));
    },
    [isMultiple, float, onChange, max, value, min]
  );

  useKeyDownEffect(
    ref,
    { key: ['up', 'alt+up', 'down', 'alt+down'], editable: true },
    handleUpDown,
    [handleUpDown]
  );

  const { focused, handleFocus, handleBlur } = useFocusAndSelect(ref);

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
        ref={ref}
        placeholder={placeholder}
        prefix={prefix}
        suffix={suffix}
        label={label}
        value={
          isMultiple
            ? ''
            : `${inputValue}${dot ? DECIMAL_POINT : ''}${focused ? '' : symbol}`
        }
        disabled={disabled}
        {...rest}
        onChange={(evt) => {
          const newValue = evt.target.value;
          if (newValue === '') {
            // Allow input to be empty
            if (canBeEmpty) {
              // Send empty up-stream
              onChange('', evt);
            } else {
              // Just update empty value internally but keep old value upstream
              setInputValue('');
            }
          } else if (newValue === '-' && canBeNegative) {
            // Allow a single "-" if negative values are allowed
            setInputValue(newValue);
          } else {
            setDot(float && newValue[newValue.length - 1] === DECIMAL_POINT);
            const valueAsNumber = float
              ? parseFloat(newValue)
              : parseInt(newValue);
            if (!isNaN(valueAsNumber)) {
              onChange(valueAsNumber, evt);
            }
          }
        }}
        onBlur={(evt) => {
          if (evt.target.form) {
            evt.target.form.dispatchEvent(
              new window.Event('submit', { cancelable: true })
            );
          }
          // Always update to latest value from upstream
          setInputValue(value);
          if (onBlur) {
            onBlur();
          }
          handleBlur();
        }}
        onFocus={handleFocus}
      />
      {suffix}
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
  flexBasis: PropTypes.number,
  textCenter: PropTypes.bool,
  float: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  canBeNegative: PropTypes.bool,
  canBeEmpty: PropTypes.bool,
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
