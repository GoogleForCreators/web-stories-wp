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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const Input = styled.input`
  display: block;
  appearance: none;
  width: 32px;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.colors.fg.v2} !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  outline: none;
  padding: 0;
  margin-right: ${({ suffix }) => (Boolean(suffix) ? 12 : 0)}px;
  margin-left: ${({ label }) => (label ? 12 : 0)}px;
  color: ${({ theme }) => theme.colors.mg.v3};
  font-family: ${({ theme }) => theme.fonts.body2.family};
  font-size: ${({ theme }) => theme.fonts.body2.size};
  line-height: ${({ theme }) => theme.fonts.body2.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing};

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 0;
  }
`;

const Container = styled.div`
  color: ${({ theme }) => rgba(theme.colors.mg.v4, 0.55)};
  font-family: ${({ theme }) => theme.fonts.body2.family};
  font-size: ${({ theme }) => theme.fonts.body2.size};
  line-height: ${({ theme }) => theme.fonts.body2.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing};
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-left: 5px;
  margin-right: 5px;

  ${({ expand }) => expand && `flex: 1;`}

  & > span {
    margin-left: 12px;
    color: ${({ theme }) => rgba(theme.colors.mg.v3, 0.86)};
  }
`;

function Numeric({
  expand,
  onBlur,
  onChange,
  isMultiple,
  opacity,
  label,
  value,
  ...rest
}) {
  const placeholder = isMultiple ? __('multiple', 'web-stories') : '';

  return (
    <Container expand={expand}>
      {label}
      <Input
        type="color"
        placeholder={placeholder}
        label={label}
        value={value}
        {...rest}
        onChange={(evt) => onChange(evt.target.value, evt)}
        onBlur={(evt) => {
          if (evt.target.form) {
            evt.target.form.dispatchEvent(new window.Event('submit'));
          }
          if (onBlur) {
            onBlur();
          }
        }}
      />
      {value && <span>{value}</span>}
      {opacity && (
        <span>
          {opacity * 100}
          {'%'}
        </span>
      )}
    </Container>
  );
}

Numeric.propTypes = {
  expand: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.any.isRequired,
  isMultiple: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  opacity: PropTypes.bool,
  disabled: PropTypes.bool,
};

Numeric.defaultProps = {
  disabled: false,
  isMultiple: false,
};

export default Numeric;
