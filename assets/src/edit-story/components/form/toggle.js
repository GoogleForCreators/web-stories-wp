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
import { Fragment, useRef, forwardRef, useImperativeHandle } from 'react';

/**
 * Internal dependencies
 */
import { KEYBOARD_USER_SELECTOR } from '../../utils/keyboardOnlyOutline';
import { useKeyDownEffect } from '../../../design-system';
import WithTooltip from '../tooltip';

// Class should contain "mousetrap" to enable keyboard shortcuts on inputs.
const CheckBoxInput = styled.input.attrs({
  type: 'checkbox',
  className: 'mousetrap',
})`
  position: absolute;
  opacity: 0;
  height: 0 !important;
  width: 0 !important;
  margin: 0 !important;
  border: 0 !important;
`;

const MarkSpan = styled.span`
  display: flex;
  align-items: center;
  width: 28px;
  height: 28px;

  svg {
    color: ${({ theme }) => theme.DEPRECATED_THEME.colors.mg.v2};
    width: 16px;
    height: 16px;
    margin: 6px;
  }
`;

const ContainerLabel = styled.label`
  display: flex;
  position: relative;
  cursor: pointer;
  user-select: none;

  ${({ boxed }) =>
    boxed &&
    `
        border: 1px solid ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.v3};
        border-radius: 4px;
    `}
  ${({ expand = false }) => expand && `flex: 1;`}

  ${({ disabled }) =>
    disabled &&
    `
    pointer-events: none;
    opacity: .2;
  `}

  border-radius: 4px;
  border: 1px solid transparent;
  ${KEYBOARD_USER_SELECTOR} &:focus-within {
    border-color: ${({ theme }) => theme.DEPRECATED_THEME.colors.whiteout};
  }
`;

function Toggle(
  {
    value,
    disabled = false,
    icon,
    uncheckedIcon,
    onChange,
    boxed,
    expand,
    title = null,
    className = null,
    ...rest
  },
  ref
) {
  const Wrapper = title ? WithTooltip : Fragment;
  const inputRef = useRef();
  useImperativeHandle(ref, () => inputRef.current);
  const toggle = () => onChange(!value);
  // <enter> doesn't normally toggle checkboxes, but we'd like it to
  useKeyDownEffect(inputRef, 'enter', toggle, [toggle]);

  return (
    <Wrapper>
      <ContainerLabel
        className={className}
        expand={expand}
        boxed={boxed}
        disabled={disabled}
      >
        <CheckBoxInput
          ref={inputRef}
          checked={value}
          onChange={toggle}
          disabled={disabled}
          title={title}
          {...rest}
        />
        <MarkSpan>{value ? icon : uncheckedIcon || icon}</MarkSpan>
      </ContainerLabel>
    </Wrapper>
  );
}

const ToggleWithRef = forwardRef(Toggle);

Toggle.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  icon: PropTypes.node,
  uncheckedIcon: PropTypes.node,
  disabled: PropTypes.bool,
  boxed: PropTypes.bool,
  expand: PropTypes.bool,
  title: PropTypes.string,
  className: PropTypes.string,
};

Toggle.defaultProps = {
  icon: null,
  uncheckedIcon: null,
  disabled: false,
  boxed: false,
  expand: false,
};

export default ToggleWithRef;
