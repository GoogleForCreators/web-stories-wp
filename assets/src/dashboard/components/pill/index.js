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
import PropTypes from 'prop-types'; // import styled from 'styled-components';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import getRandomNumber from '../../utils/getRandomNumber';

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
  font-family: ${({ theme }) => theme.fonts.googleSans};
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.01em;
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
  value,
  ...rest
}) => {
  const id = `${name}_${getRandomNumber()}`;
  return (
    <PillLabel htmlFor={id} isSelected={isSelected}>
      <PillInput
        type={inputType}
        id={id}
        name={name}
        onClick={(e) => onClick(e, value)}
        value={value}
        checked={isSelected}
        {...rest}
      />
      {children}
    </PillLabel>
  );
};

Pill.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  inputType: PropTypes.oneOf(Object.values(PILL_TYPES)),
  isSelected: PropTypes.bool,
};

export default Pill;
