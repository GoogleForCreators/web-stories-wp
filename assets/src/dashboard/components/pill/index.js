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
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PILL_TYPES = {
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
};

const PillInput = styled.input`
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

const PillContainer = styled.label`
  display: inline-flex;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.pill.family};
  font-weight: ${({ theme }) => theme.fonts.pill.weight};
  font-size: ${({ theme }) => theme.fonts.pill.size};
  line-height: ${({ theme }) => theme.fonts.pill.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.pill.letterSpacing};
`;
const PillLabel = styled.span`
  cursor: pointer;
  margin: auto;
  width: 100%;
  display: block;
  padding: 6px 16px;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray600};
  border: ${({ theme }) => `1px solid ${theme.colors.gray50}`};
  border-radius: ${({ theme }) => theme.border.buttonRadius};

  ${PillInput}:checked + &,
  ${PillInput}:enabled:hover + & {
    background-color: ${({ theme }) => theme.colors.blueLight};
    border-color: ${({ theme }) => theme.colors.action};
    color: ${({ theme }) => theme.colors.bluePrimary};
    border: 1px solid transparent;
  }

  ${PillInput}:focus + & {
    border-color: ${({ theme }) => theme.colors.action};
  }

  ${PillInput}:disabled + & {
    opacity: 0.6;
    cursor: default;
  }
`;

const FloatingTabLabel = styled(PillLabel)`
  background-color: transparent;
  padding: 10px 24px;
  border-color: transparent;

  ${PillInput}:checked + & {
    box-shadow: ${({ theme }) => theme.floatingTab.shadow};
  }
`;

const Pill = ({
  children,
  inputType = PILL_TYPES.CHECKBOX,
  isSelected,
  name,
  onClick,
  floatingTab,
  value,
  ...rest
}) => {
  const Label = floatingTab ? FloatingTabLabel : PillLabel;

  return (
    <PillContainer>
      <PillInput
        type={inputType}
        name={name}
        onChange={(e) => onClick(e, value)}
        value={value}
        checked={isSelected}
        {...rest}
      />
      <Label>{children}</Label>
    </PillContainer>
  );
};

Pill.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  inputType: PropTypes.oneOf(Object.values(PILL_TYPES)),
  isSelected: PropTypes.bool,
  floatingTab: PropTypes.bool,
};

const FloatingTab = (props) => <Pill floatingTab {...props} />;
FloatingTab.propTypes = Pill.propTypes;

export { Pill, FloatingTab };
