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

/**
 * Internal dependencies
 */
import { ReactComponent as CloseIcon } from '../../icons/close.svg';

const PILL_TYPES = {
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
};
const ACTIVE_CHOICE_ICON_SIZE = 16;
const ACTIVE_CHOICE_LEFT_MARGIN = 4;

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
  ${({ theme }) => `
    display: inline-flex;
    justify-content: center;
    font-family: ${theme.fonts.pill.family};
    font-weight: ${theme.fonts.pill.weight};
    font-size: ${theme.fonts.pill.size}px;
    line-height: ${theme.fonts.pill.lineHeight}px;
    letter-spacing: ${theme.fonts.pill.letterSpacing}em;
  `}
`;

const PillLabel = styled.span`
  ${({ theme, isSelected }) => `
    cursor: pointer;
    margin: auto 0;
    width: 100%;
    display: flex;
    padding: 3px;
    padding-right: ${
      isSelected
        ? `${20 - ACTIVE_CHOICE_LEFT_MARGIN / 2 - ACTIVE_CHOICE_ICON_SIZE}px`
        : '20px'
    };
    padding-left: ${
      isSelected
        ? `${ACTIVE_CHOICE_ICON_SIZE + ACTIVE_CHOICE_LEFT_MARGIN / 2}px`
        : '20px'
    };
    align-items: center;
    background-color: ${theme.colors.white};
    color: ${theme.colors.gray700};
    border: ${theme.borders.gray50};
    border-radius: ${theme.button.borderRadius}px;

    ${PillInput}:hover + & {
      background-color: ${theme.colors.blueLight};
    }
    ${PillInput}:focus + &  {
      border: ${theme.borders.action};
    }

    ${PillInput}:checked + & {
      background-color: ${theme.colors.blueLight};
    }

    ${PillInput}:disabled + & {
      opacity: 0.6;
      cursor: default;
    }
  `}
`;
PillLabel.propTypes = {
  isSelected: PropTypes.bool,
};

const FloatingTabLabel = styled(PillLabel)`
  background-color: transparent;
  padding: 4px 16px;
  border-color: transparent;

  ${PillInput}:checked + & {
    box-shadow: ${({ theme }) => theme.floatingTab.shadow};
    background-color: transparent;
  }
`;

const ActiveChoiceIcon = styled(CloseIcon)`
  background-color: ${({ theme }) => theme.colors.gray700};
  color: ${({ theme }) => theme.colors.blueLight};
  border-radius: 50%;
  padding: 3px;
  margin-left: ${ACTIVE_CHOICE_LEFT_MARGIN}px;
`;

const Pill = ({
  children,
  inputType = PILL_TYPES.CHECKBOX,
  isSelected = false,
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
      <Label isSelected={isSelected}>
        {children}
        {isSelected && !floatingTab && (
          <ActiveChoiceIcon
            width={ACTIVE_CHOICE_ICON_SIZE}
            height={ACTIVE_CHOICE_ICON_SIZE}
          />
        )}
      </Label>
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
