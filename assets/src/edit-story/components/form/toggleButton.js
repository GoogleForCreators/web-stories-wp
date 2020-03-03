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

const CheckBoxInput = styled.input.attrs({ type: 'checkbox' })`
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

  ${({ value, theme }) =>
    value && `background-color: ${rgba(theme.colors.fg.v1, 0.1)};`}

  ${({ disabled }) =>
    disabled &&
    `
		pointer-events: none;
		opacity: .2;
	`}

  svg {
    color: ${({ theme }) => theme.colors.mg.v2};
    width: ${({ IconWidth }) => IconWidth}px;
    height: ${({ IconHeight }) => IconHeight}px;
  }
`;

function ToggleButton({
  value,
  disabled = false,
  icon,
  uncheckedIcon,
  onChange,
  boxed,
  expand,
  IconWidth,
  IconHeight,
  ...rest
}) {
  return (
    <ContainerLabel
      expand={expand}
      boxed={boxed}
      disabled={disabled}
      value={value}
      IconWidth={IconWidth}
      IconHeight={IconHeight}
    >
      <CheckBoxInput
        checked={value}
        onChange={() => onChange(!value)}
        disabled={disabled}
        {...rest}
      />
      <MarkSpan>{value ? icon : uncheckedIcon || icon}</MarkSpan>
    </ContainerLabel>
  );
}

ToggleButton.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  icon: PropTypes.node,
  uncheckedIcon: PropTypes.node,
  disabled: PropTypes.bool,
  boxed: PropTypes.bool,
  expand: PropTypes.bool,
  IconHeight: PropTypes.number,
  IconWidth: PropTypes.number,
};

ToggleButton.defaultProps = {
  icon: null,
  uncheckedIcon: null,
  disabled: false,
  boxed: false,
  expand: false,
  IconWidth: 14,
  IconHeight: 9,
};

export default ToggleButton;
