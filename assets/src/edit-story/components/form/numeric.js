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
  width: 100%;
  border: none;
  box-shadow: none;
  outline: none;
  padding-right: ${({ suffix }) => (Boolean(suffix) ? 6 : 0)}px;
  padding-left: ${({ prefix, label }) => (prefix || label ? 6 : 0)}px;
  color: ${({ theme }) => theme.colors.mg.v3};
  font-family: ${({ theme }) => theme.fonts.body2.family};
  font-size: ${({ theme }) => theme.fonts.body2.size};
  line-height: ${({ theme }) => theme.fonts.body2.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing};
`;

const Container = styled.div`
  color: ${({ theme }) => rgba(theme.colors.mg.v4, 0.55)};
  font-family: ${({ theme }) => theme.fonts.body2.family};
  font-size: ${({ theme }) => theme.fonts.body2.size};
  line-height: ${({ theme }) => theme.fonts.body2.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  margin-right: 5px;

  ${({ boxed, theme }) =>
    boxed &&
    `
      padding: 6px 6px;
      border:1px solid ${theme.colors.fg.v3};
      border-radius: 4px;
    `}
  ${({ expand }) => expand && `flex: 1;`}
`;

function Numeric({
  boxed,
  expand,
  onBlur,
  onChange,
  prefix,
  suffix,
  isMultiple,
  label,
  ...rest
}) {
  const placeholder = isMultiple ? __('multiple', 'web-stories') : '';

  return (
    <Container boxed={boxed} expand={expand}>
      {label}
      {prefix}
      <Input
        placeholder={placeholder}
        prefix={prefix}
        suffix={suffix}
        label={label}
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
      {suffix}
    </Container>
  );
}

Numeric.propTypes = {
  boxed: PropTypes.bool,
  expand: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.any.isRequired,
  isMultiple: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  disabled: PropTypes.bool,
};

Numeric.defaultProps = {
  disabled: false,
  isMultiple: false,
};

export default Numeric;
