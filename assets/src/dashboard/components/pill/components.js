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
import { BEZIER } from '../../../animation';
import { Checkmark as CheckmarkIcon, Close as CloseIcon } from '../../icons';
import { visuallyHiddenStyles } from '../../utils/visuallyHiddenStyles';
import { TypographyPresets } from '../typography';

export const ACTIVE_CHOICE_ICON_SIZE = 16;
export const ACTIVE_CHOICE_LEFT_MARGIN = 4;

export const PillContainer = styled.label`
  ${TypographyPresets.Small};
  display: inline-flex;
  justify-content: center;
`;

export const PillInput = styled.input`
  ${visuallyHiddenStyles}
`;

export const PillLabel = styled.span(
  ({ theme, isSelected }) => `
    cursor: pointer;
    margin: auto 0;
    width: 100%;
    display: flex;
    padding: 4px;
    padding-right: ${isSelected ? '4px' : '20px'};
    padding-left: ${isSelected ? `${ACTIVE_CHOICE_ICON_SIZE}px` : '20px'};
    align-items: center;
    background-color: ${theme.DEPRECATED_THEME.colors.white};
    color: ${theme.DEPRECATED_THEME.colors.gray700};
    border: ${theme.DEPRECATED_THEME.borders.gray50};
    border-radius: ${theme.DEPRECATED_THEME.button.borderRadius}px;

    ${PillInput}:enabled:hover + & {
      background-color: ${theme.DEPRECATED_THEME.colors.blueLight};
    }

    ${PillInput}:focus + & { 
      border: ${theme.DEPRECATED_THEME.borders.action};
    }

    ${PillInput}:checked + & {
      background-color: ${theme.DEPRECATED_THEME.colors.blueLight};
    }

    ${PillInput}:disabled + & {
      opacity: 0.6;
      cursor: default;
    }
  `
);

PillLabel.propTypes = {
  isSelected: PropTypes.bool,
};

export const FloatingTabLabel = styled(PillLabel)`
  background-color: transparent;
  padding: 4px 16px;
  border-color: transparent;

  ${PillInput}:checked + & {
    box-shadow: ${({ theme }) => theme.DEPRECATED_THEME.floatingTab.shadow};
    background-color: transparent;
  }
`;

export const SwatchLabel = styled(PillLabel)(
  ({ hex }) => `
    padding: 0;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    border-radius: 50%;
    width: 26px;
    height: 26px;
    background-color: ${hex};

    ${PillInput}:checked + &,
    ${PillInput}:enabled:hover + & {
      background-color: ${hex};
      > svg {
        opacity: 1.0;
      }
    }

  `
);
SwatchLabel.propTypes = {
  hex: PropTypes.string,
};

export const ActiveSwatchIcon = styled(CheckmarkIcon).attrs({
  width: ACTIVE_CHOICE_ICON_SIZE,
  height: ACTIVE_CHOICE_ICON_SIZE,
})`
  position: absolute;
  opacity: 0;
  margin: auto;
  padding: 2px;
  color: ${({ theme, hex = '#000' }) =>
    hex.toLowerCase().includes('fff')
      ? theme.DEPRECATED_THEME.colors.black
      : theme.DEPRECATED_THEME.colors.white};
  transition: opacity 0.2s ${BEZIER.outSine};
`;

ActiveSwatchIcon.propTypes = {
  hex: PropTypes.string.isRequired,
};

export const ActiveChoiceIcon = styled(CloseIcon).attrs({
  width: ACTIVE_CHOICE_ICON_SIZE,
  height: ACTIVE_CHOICE_ICON_SIZE,
})`
  background-color: ${({ theme }) => theme.DEPRECATED_THEME.colors.gray700};
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.blueLight};
  border-radius: 50%;
  padding: 3px;
  margin-left: ${ACTIVE_CHOICE_LEFT_MARGIN}px;
`;
