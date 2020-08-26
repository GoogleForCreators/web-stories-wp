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
import styled, { css } from 'styled-components';
import { rgba } from 'polished';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Add, EditPencil } from '../../../icons';
import { StylePresetPropType } from '../../../types';
import { PanelTitle } from '../panel';

const buttonCSS = css`
  border: none;
  background: transparent;
  width: 30px;
  height: 28px;
  color: ${({ theme }) => rgba(theme.colors.fg.white, 0.84)};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AddColorPresetButton = styled.button`
  ${buttonCSS}
  svg {
    width: 26px;
    height: 28px;
  }
`;

const EditMode = styled.button`
  ${buttonCSS}

  ${({ isEditMode }) =>
    isEditMode
      ? css`
          color: ${({ theme }) => theme.colors.fg.white};
          font-size: 12px;
          line-height: 14px;
          padding: 7px;
          height: initial;
        `
      : css`
          svg {
            width: 16px;
            height: 20px;
          }
        `}
`;

function PresetsHeader({
  handleAddColorPreset,
  isEditMode,
  setIsEditMode,
  stylePresets,
  canCollapse,
}) {
  const { colors } = stylePresets;
  const hasPresets = colors.length > 0;

  const getActions = () => {
    return (
      <>
        {hasPresets && (
          <EditMode
            onClick={(evt) => {
              evt.stopPropagation();
              setIsEditMode(!isEditMode);
            }}
            aria-label={
              isEditMode
                ? __('Exit edit mode', 'web-stories')
                : __('Edit presets', 'web-stories')
            }
            isEditMode={isEditMode}
          >
            {isEditMode ? __('Exit', 'web-stories') : <EditPencil />}
          </EditMode>
        )}
        {!isEditMode && (
          <AddColorPresetButton
            onClick={handleAddColorPreset}
            aria-label={__('Add preset', 'web-stories')}
          >
            <Add />
          </AddColorPresetButton>
        )}
      </>
    );
  };

  // Todo: Rename label to 'Presets' post-beta.
  return (
    <PanelTitle secondaryAction={getActions()} canCollapse={canCollapse}>
      {__('Saved Colors', 'web-stories')}
    </PanelTitle>
  );
}

PresetsHeader.propTypes = {
  stylePresets: StylePresetPropType.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  handleAddColorPreset: PropTypes.func.isRequired,
  setIsEditMode: PropTypes.func.isRequired,
  canCollapse: PropTypes.bool.isRequired,
};

export default PresetsHeader;
