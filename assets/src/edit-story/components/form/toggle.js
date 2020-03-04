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
	padding: 3;
	cursor: pointer;
	user-select: none;

  ${({ boxed }) =>
    boxed &&
    `
        border: 1px solid ${({ theme }) => theme.colors.fg.v3};
        border-radius: 4px;
    `}
  ${({ expand = false }) => expand && `flex: 1;`}

	${({ disabled }) =>
    disabled &&
    `
		pointer-events: none;
		opacity: .2;
	`}

  svg {
    color: ${({ theme }) => theme.colors.mg.v2};
    width: 16px;
    height: 16px;
  }
`;

function Toggle({
  value,
  disabled = false,
  icon,
  uncheckedIcon,
  onChange,
  boxed,
  expand,
  ...rest
}) {
  return (
    <ContainerLabel expand={expand} boxed={boxed} disabled={disabled}>
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

Toggle.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  icon: PropTypes.node,
  uncheckedIcon: PropTypes.node,
  disabled: PropTypes.bool,
  boxed: PropTypes.bool,
  expand: PropTypes.bool,
};

Toggle.defaultProps = {
  icon: null,
  uncheckedIcon: null,
  disabled: false,
  boxed: false,
  expand: false,
};

export default Toggle;
