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
import { PatternPropType } from '@web-stories-wp/patterns';
import {
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
import useStory from '../../app/story/useStory';
import { BASIC_COLORS } from './constants';
import Header from './header';
import BasicColorList from './basicColorList';

const Body = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px 16px 16px;
`;

const SavedColors = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
  padding-bottom: 24px;
`;

const DefaultColors = styled.div`
  padding-bottom: 24px;
`;

const Label = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
  margin: 10px 0;
`;

const DefaultText = styled(Label)`
  margin-left: 8px;
  color: ${({ theme }) => theme.colors.fg.primary};
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
  allowsGradient,
  allowsSavedColors,
  showCustomPicker,
  handleClose,
}) {
  const { savedColors, storyColors } = useStory((state) => ({
    savedColors: state.state.story?.globalStoryStyles?.colors || [],
    storyColors: state.state.story?.currentStoryStyles?.colors || [],
  }));

  return (
    <>
      <Header handleClose={handleClose}>
        <DefaultText>{__('Color', 'web-stories')}</DefaultText>
      </Header>
      <Body>
        <SavedColors>
          {allowsSavedColors && (
            <>
              <Label id="colorpicker-story-colors-title">
                {__('Current story', 'web-stories')}
              </Label>
              {storyColors.length > 0 && (
                <BasicColorList
                  color={color}
                  colors={storyColors}
                  handleColorChange={handleColorChange}
                  allowsOpacity={allowsOpacity}
                  allowsGradient={allowsGradient}
                  aria-labelledby="colorpicker-story-colors-title"
                />
              )}
            </>
          )}
          {allowsSavedColors && (
            <>
              <Label id="colorpicker-saved-colors-title">
                {__('Saved colors', 'web-stories')}
              </Label>
              {savedColors.length > 0 && (
                <BasicColorList
                  color={color}
                  colors={savedColors}
                  handleColorChange={handleColorChange}
                  allowsOpacity={allowsOpacity}
                  allowsGradient={allowsGradient}
                  aria-labelledby="colorpicker-saved-colors-title"
                />
              )}
            </>
          )}
        </SavedColors>
        <DefaultColors>
          <Label id="colorpicker-default-colors-title">
            {__('Default', 'web-stories')}
          </Label>
          <BasicColorList
            color={color}
            colors={BASIC_COLORS}
            handleColorChange={handleColorChange}
            allowsOpacity={allowsOpacity}
            allowsGradient={allowsGradient}
            aria-labelledby="colorpicker-default-colors-title"
          />
        </DefaultColors>
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
  allowsGradient: PropTypes.bool,
  allowsSavedColors: PropTypes.bool,
  color: PatternPropType,
};

export default BasicColorPicker;
