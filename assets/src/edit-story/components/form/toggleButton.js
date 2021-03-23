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
import { useRef } from 'react';

/**
 * Internal dependencies
 */
import { KEYBOARD_USER_SELECTOR } from '../../utils/keyboardOnlyOutline';
import { useKeyDownEffect } from '../../../design-system';
import { MULTIPLE_VALUE } from '../../constants';

// Class should contain "mousetrap" to enable keyboard shortcuts on inputs.
const CheckBoxInput = styled.input.attrs({
  type: 'checkbox',
  className: 'mousetrap',
})`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
  margin: 0;
`;

const MarkSpan = styled.span`
  display: flex;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  user-select: none;
  justify-content: center;
  align-items: center;
`;

const Label = styled.span`
  color: ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.fg.white, 0.54)};
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.family};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.size};
  line-height: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.lineHeight};
  letter-spacing: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.body2.letterSpacing};
  margin-top: 8px;
`;

const ContainerLabel = styled.label`
  display: flex;
  position: relative;
  width: 32px;
  height: 32px;
  cursor: pointer;
  user-select: none;
  justify-content: center;
  align-items: center;

  border-radius: 4px;
  border: 1px solid transparent;
  ${KEYBOARD_USER_SELECTOR} &:focus-within {
    border-color: ${({ theme }) => theme.DEPRECATED_THEME.colors.whiteout};
  }

  ${({ value, theme }) =>
    value &&
    `background-color: ${rgba(theme.DEPRECATED_THEME.colors.fg.white, 0.1)};`}

  ${({ disabled }) =>
    disabled &&
    `
    pointer-events: none;
    opacity: .2;
  `}

  svg {
    color: ${({ theme }) => theme.DEPRECATED_THEME.colors.mg.v2};
    width: ${({ iconWidth }) => iconWidth}px;
    height: ${({ iconHeight }) => iconHeight}px;
  }
`;

function ToggleButton({
  value,
  disabled = false,
  icon,
  uncheckedIcon,
  onChange,
  iconWidth,
  iconHeight,
  label,
  className,
  children,
  ...rest
}) {
  const toggle = () => onChange(!value);
  const inputRef = useRef();
  // <enter> doesn't normally toggle checkboxes, but we'd like it to
  useKeyDownEffect(inputRef, 'enter', toggle, [toggle]);

  value = value === MULTIPLE_VALUE ? '' : value;
  return (
    <Container className={className}>
      <ContainerLabel
        disabled={disabled}
        value={value}
        iconWidth={iconWidth}
        iconHeight={iconHeight}
      >
        <CheckBoxInput
          ref={inputRef}
          checked={value}
          onChange={toggle}
          disabled={disabled}
          {...rest}
        />
        <MarkSpan>{value ? icon : uncheckedIcon || icon}</MarkSpan>
        {children}
      </ContainerLabel>
      {Boolean(label) && <Label>{label}</Label>}
    </Container>
  );
}

ToggleButton.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  icon: PropTypes.node,
  uncheckedIcon: PropTypes.node,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  iconHeight: PropTypes.number,
  iconWidth: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node,
};

ToggleButton.defaultProps = {
  icon: null,
  uncheckedIcon: null,
  label: null,
  disabled: false,
  boxed: false,
  expand: false,
  iconWidth: 14,
  iconHeight: 9,
};

export default ToggleButton;
