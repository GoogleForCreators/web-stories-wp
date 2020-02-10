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

const ToggleContainer = styled.div`
  appearance: none;
  position: relative;
  color: ${({ theme }) => theme.colors.mg.v3};
  font-family: ${({ theme }) => theme.fonts.body2.family};
  font-size: ${({ theme }) => theme.fonts.body2.size};
  line-height: ${({ theme }) => theme.fonts.body2.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing};
  padding: 3px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: none;
  ${({ boxed }) =>
    boxed &&
    `
        border: 1px solid ${({ theme }) => theme.colors.fg.v3};
        border-radius: 4px;  
    `}
  ${({ expand = false }) => expand && `flex: 1;`}

  & > svg {
    fill: ${({ theme }) => theme.colors.bg.v0};
    opacity: ${({ disabled }) => (disabled ? 0.2 : 0.54)};
    width: 16px;
    height: 16px;
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  /*
	Hide checkbox visually but remain accessible to screen readers.
	Source: https://polished.js.org/docs/#hidevisually
	*/
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

function Toggle({
  value,
  disabled = false,
  icon,
  uncheckedIcon,
  onChange,
  boxed,
  expand,
}) {
  return (
    <ToggleContainer
      boxed={boxed}
      expand={expand}
      disabled={disabled}
      onClick={(evt) => {
        if (!disabled) {
          onChange(!value);
        }
        evt.stopPropagation();
      }}
    >
      <Checkbox value={'on'} checked={value} disabled={disabled} />
      {value ? icon : uncheckedIcon || icon}
    </ToggleContainer>
  );
}

Toggle.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  icon: PropTypes.node,
  uncheckedIcon: PropTypes.node,
  disabled: PropTypes.bool,
  boxed: PropTypes.bool,
  expand: PropTypes.bool,
};

export default Toggle;
