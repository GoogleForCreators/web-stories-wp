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
import styled, { css } from 'styled-components';
import {
  PatternPropType,
  getHexFromSolid,
  hasOpacity,
  hasGradient,
} from '@web-stories-wp/patterns';
import {
  Swatch,
  themeHelpers,
  THEME_CONSTANTS,
  Button,
  Icons,
  Text,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '@web-stories-wp/design-system';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { BASIC_COLORS } from './constants';
import Header from './header';

const focusStyle = css`
  ${({ theme }) =>
    themeHelpers.focusableOutlineCSS(
      theme.colors.border.focus,
      theme.colors.bg.secondary
    )};
`;
const Body = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px 16px 16px;
  gap: 16px;
`;

const SwatchList = styled.div`
  display: flex;
  max-width: 100%;
  flex-wrap: wrap;
  gap: 6px;
`;

const Label = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

const DefaultText = styled(Label)`
  margin-left: 8px;
`;

const StyledSwatch = styled(Swatch)`
  ${focusStyle};

  ${({ isSelected, theme }) =>
    isSelected &&
    css`
      border: 1px solid ${theme.colors.border.defaultActive};
    `}
`;

const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-basis: 100%;
`;

const StyledPlus = styled(Icons.PlusOutline)`
  width: 32px;
  margin: -8px 0;
`;

function BasicColorPicker({
  color,
  handleColorChange,
  allowsOpacity,
  allowsSavedColors,
  showCustomPicker,
  handleClose,
  renderFooter,
}) {
  const hexColor = hasGradient(color) ? null : getHexFromSolid(color);

  return (
    <>
      <Header handleClose={handleClose}>
        <DefaultText>{__('Default', 'web-stories')}</DefaultText>
      </Header>
      <Body>
        <SwatchList>
          {BASIC_COLORS.flat().map(({ hex, pattern }) => (
            <StyledSwatch
              key={hex}
              onClick={() => handleColorChange(pattern)}
              pattern={pattern}
              isSelected={hex === hexColor}
              isDisabled={!allowsOpacity && hasOpacity(pattern)}
            />
          ))}
        </SwatchList>
        {allowsSavedColors && (
          <>
            <Label>{__('Saved colors', 'web-stories')}</Label>
            {renderFooter(color)}
          </>
        )}
        <StyledButton
          onClick={showCustomPicker}
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.SMALL}
          variant={BUTTON_VARIANTS.RECTANGLE}
        >
          {__('Custom', 'web-stories')}
          <StyledPlus />
        </StyledButton>
      </Body>
    </>
  );
}

BasicColorPicker.propTypes = {
  handleColorChange: PropTypes.func.isRequired,
  showCustomPicker: PropTypes.func.isRequired,
  handleClose: PropTypes.func,
  allowsOpacity: PropTypes.bool,
  allowsSavedColors: PropTypes.bool,
  color: PatternPropType,
  renderFooter: PropTypes.func,
};

export default BasicColorPicker;
