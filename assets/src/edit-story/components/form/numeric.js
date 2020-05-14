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
import { useCallback, useRef, useState } from 'react';
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
  cursor: inherit;
`;

const Container = styled.div`
  color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.3)};
  font-family: ${({ theme }) => theme.fonts.body2.family};
  font-size: ${({ theme }) => theme.fonts.body2.size};
  line-height: ${({ theme }) => theme.fonts.body2.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => rgba(theme.colors.bg.v0, 0.3)};
  flex-basis: ${({ flexBasis }) => flexBasis}px;
  user-select: none;

  ${({ disabled }) => disabled && `opacity: 0.3;`}
  ${({ scrub }) => scrub && `cursor: ew-resize;`}
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
  ariaLabel,
  disabled,
  scrub,
  ...rest
}) {
  const isMultiple = value === MULTIPLE_VALUE;
  const placeholder = isMultiple ? __('multiple', 'web-stories') : '';
  const [dot, setDot] = useState(false);
  const ref = useRef();

  const handleUpDown = useCallback(
    ({ key, altKey }) => {
      if (isMultiple) {
        return;
      }

      let newValue;
      const diff = Big(float && altKey ? 0.1 : 1);
      if (key === 'ArrowUp') {
        // Increment value
        newValue = Big(value).plus(diff);
      } else if (key === 'ArrowDown') {
        // Decrement value
        newValue = Big(value).minus(diff);
      }
      onChange(parseFloat(newValue.toString()));
    },
    [onChange, value, isMultiple, float]
  );

  useKeyDownEffect(
    ref,
    { key: ['up', 'alt+up', 'down', 'alt+down'], editable: true },
    handleUpDown,
    [handleUpDown]
  );

  const { focused, handleFocus, handleBlur } = useFocusAndSelect(ref);

  const changeCallback = useCallback(
    (newValue, e) => {
      if (newValue === '') {
        onChange('', e);
      } else {
        setDot(float && newValue[newValue.length - 1] === DECIMAL_POINT);
        const valueAsNumber = float ? parseFloat(newValue) : parseInt(newValue);
        if (!isNaN(valueAsNumber)) {
          onChange(valueAsNumber, e);
        }
      }
    },
    [onChange, float]
  );

  const submitCallback = useCallback(
    (e) => {
      if (e.target.form) {
        e.target.form.dispatchEvent(
          new window.Event('submit', { cancelable: true })
        );
      }
      if (onBlur) {
        onBlur();
      }
      handleBlur();
    },
    [onBlur, handleBlur]
  );

  const [scrubbing, setScrubbing] = useState(false);
  const [scrubbed, setScrubbed] = useState(false);

  const mouseUpCallback = useCallback(
    (e) => {
      setScrubbing(false);
      if (scrubbed) {
        submitCallback(e);
      } else if (!focused && ref.current.contains(e.target)) {
        handleFocus();
      }
    },
    [focused, scrubbed, handleFocus, ref, submitCallback]
  );

  const scrubProps = {
    onMouseMove: useCallback(
      (e) => {
        if (!scrubbing || focused) {
          return;
        }
        if (!scrubbed) {
          setScrubbed(true);
        }
        changeCallback(value + e.movementX, e);
      },
      [scrubbing, scrubbed, focused, changeCallback, value]
    ),
    onMouseUp: mouseUpCallback,
    onMouseDown: (e) => {
      setScrubbing(true);
      setScrubbed(false);
      // Clear this scrubbing event as soon as mouse is released
      // `setTimeout` is currently required to not break functionality.
      e.target.ownerDocument.addEventListener(
        'mouseup',
        () => window.setTimeout(() => mouseUpCallback(e), 0, null),
        { once: true, capture: true }
      );
      e.preventDefault();
    },
  };

  return (
    <Container
      className={`${className}`}
      flexBasis={flexBasis}
      disabled={disabled}
      scrub={scrub}
      {...(scrub && scrubProps)}
    >
      {label}
      {prefix}
      <StyledInput
        ref={ref}
        placeholder={placeholder}
        prefix={prefix}
        suffix={suffix}
        label={label}
        value={
          isMultiple
            ? ''
            : `${value}${dot ? DECIMAL_POINT : ''}${focused ? '' : symbol}`
        }
        aria-label={ariaLabel}
        disabled={disabled}
        {...rest}
        onChange={(e) => changeCallback(e.target.value, e)}
        onBlur={submitCallback}
        onFocus={handleFocus}
        draggable="false"
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
  ariaLabel: PropTypes.string,
  float: PropTypes.bool,
  scrub: PropTypes.bool,
};

Numeric.defaultProps = {
  className: null,
  disabled: false,
  symbol: '',
  flexBasis: 110,
  textCenter: false,
  float: false,
  ariaLabel: __('Standard input', 'web-stories'),
  scrub: true,
};

export default Numeric;
