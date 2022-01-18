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
  localStore,
  LOCAL_STORAGE_PREFIX,
} from '@web-stories-wp/design-system';
import { __ } from '@web-stories-wp/i18n';
import { useState } from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import useStory from '../../app/story/useStory';
import useEyedropper from '../eyedropper';
import { BASIC_COLORS, CONFIRMATION_DIALOG_STORAGE_KEY } from './constants';
import Header from './header';
import BasicColorList from './basicColorList';
import ConfirmationDialog from './confirmationDialog';
import useDeleteColor from './useDeleteColor';

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
  margin: 16px 0 10px;
`;

const DefaultText = styled(Label)`
  margin: 0 0 0 8px;
  color: ${({ theme }) => theme.colors.fg.primary};
`;
const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-basis: 100%;
`;

const StyledText = styled(Text)`
  padding: 5px 10px;
`;

const StyledPlus = styled(Icons.PlusOutline)`
  width: 32px;
  margin: -8px 0;
`;

const EyedropperWrapper = styled.div`
  display: flex;
`;

function BasicColorPicker({
  color,
  handleColorChange,
  allowsOpacity,
  allowsGradient,
  allowsSavedColors,
  showCustomPicker,
  handleClose,
  showDialog,
  setShowDialog,
  changedStyle,
}) {
  const { savedColors, storyColors } = useStory((state) => ({
    savedColors: state.state.story?.globalStoryStyles?.colors || [],
    storyColors: state.state.story?.currentStoryStyles?.colors || [],
  }));

  const [isEditMode, setIsEditMode] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const hasPresets = storyColors.length > 0 || savedColors.length > 0;

  const { initEyedropper } = useEyedropper({
    onChange: (newColor) => handleColorChange({ color: newColor }),
  });

  const { deleteLocalColor, deleteGlobalColor } = useDeleteColor({
    onEmpty: () => setIsEditMode(false),
  });

  const handleClick = (preset, isLocal = false) => {
    // If not in edit mode, apply the color.
    if (!isEditMode) {
      handleColorChange(preset);
      return;
    }
    // If deleting a local color, delete without confirmation.
    if (isLocal) {
      deleteLocalColor(preset);
      return;
    }

    // If the user has dismissed the confirmation dialogue previously.
    const isDialogDismissed = localStore.getItemByKey(
      LOCAL_STORAGE_PREFIX[CONFIRMATION_DIALOG_STORAGE_KEY]
    );
    if (isDialogDismissed) {
      deleteGlobalColor(preset);
      return;
    }

    // Ask confirmation for a global color.
    setShowDialog(true);
    setToDelete(preset);
  };

  return (
    <>
      <Header
        handleClose={handleClose}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        hasPresets={hasPresets}
      >
        <DefaultText>{__('Color', 'web-stories')}</DefaultText>
      </Header>
      <Body>
        <EyedropperWrapper>
          <Button
            variant={BUTTON_VARIANTS.SQUARE}
            type={BUTTON_TYPES.QUATERNARY}
            size={BUTTON_SIZES.SMALL}
            aria-label={__('Pick a color from canvas', 'web-stories')}
            onClick={initEyedropper()}
            onPointerEnter={initEyedropper(false)}
          >
            <Icons.Pipette />
          </Button>
          <StyledText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
            {__('Sample color', 'web-stories')}
          </StyledText>
        </EyedropperWrapper>
        <SavedColors>
          {allowsSavedColors && (
            <>
              <Label id="colorpicker-story-colors-title">
                {__('Current story', 'web-stories')}
              </Label>
              <BasicColorList
                color={color}
                colors={storyColors}
                handleClick={handleClick}
                isLocal
                allowsOpacity={allowsOpacity}
                allowsGradient={allowsGradient}
                aria-labelledby="colorpicker-story-colors-title"
                isEditMode={isEditMode}
                data-testid="saved-story-colors"
                changedStyle={changedStyle}
              />
              <Label id="colorpicker-saved-colors-title">
                {__('Saved colors', 'web-stories')}
              </Label>
              <BasicColorList
                color={color}
                colors={savedColors}
                isGlobal
                handleClick={handleClick}
                allowsOpacity={allowsOpacity}
                allowsGradient={allowsGradient}
                aria-labelledby="colorpicker-saved-colors-title"
                isEditMode={isEditMode}
                changedStyle={changedStyle}
              />
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
            handleClick={(pattern) => {
              handleColorChange(pattern);
              setIsEditMode(false);
            }}
            allowsOpacity={allowsOpacity}
            allowsGradient={allowsGradient}
            aria-labelledby="colorpicker-default-colors-title"
            isEditMode={false}
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
      {showDialog && (
        <ConfirmationDialog
          onClose={() => setShowDialog(false)}
          onPrimary={() => {
            deleteGlobalColor(toDelete);
            setToDelete(null);
            setShowDialog(false);
          }}
        />
      )}
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
  showDialog: PropTypes.bool,
  setShowDialog: PropTypes.func,
  changedStyle: PropTypes.string,
};

export default BasicColorPicker;
