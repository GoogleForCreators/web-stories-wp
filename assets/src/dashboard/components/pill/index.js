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

// TODO hover, action, disabled styles
const PillLabel = styled.label`
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  margin: auto;
  padding: 6px 16px;
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.blueLight : theme.colors.white};
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.bluePrimary : theme.colors.gray600};
  border: ${({ theme, isSelected }) =>
    isSelected ? '1px solid transparent' : `1px solid ${theme.colors.gray50}`};
  border-radius: ${({ theme }) => theme.border.buttonRadius};
  font-family: ${({ theme }) => theme.fonts.pill.family};
  font-weight: ${({ theme }) => theme.fonts.pill.weight};
  font-size: ${({ theme }) => theme.fonts.pill.size};
  line-height: ${({ theme }) => theme.fonts.pill.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.pill.letterSpacing};
`;
PillLabel.propTypes = {
  isSelected: PropTypes.bool,
};

const FloatingTabLabel = styled(PillLabel)`
  background-color: transparent;
  padding: 10px 24px;
  border: none;
  ${({ isSelected, theme }) =>
    isSelected && {
      boxShadow: theme.floatingTab.shadow,
    }}
`;

const PillInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
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
    <Label isSelected={isSelected}>
      <PillInput
        type={inputType}
        name={name}
        onChange={(e) => onClick(e, value)}
        value={value}
        checked={isSelected}
        {...rest}
      />
      {children}
    </Label>
  );
};

Pill.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  inputType: PropTypes.oneOf(Object.values(PILL_TYPES)),
  isSelected: PropTypes.bool,
  floatingTab: PropTypes.bool,
};

const FloatingTab = (props) => <Pill floatingTab {...props} />;
FloatingTab.propTypes = Pill.propTypes;

export { Pill, FloatingTab };
