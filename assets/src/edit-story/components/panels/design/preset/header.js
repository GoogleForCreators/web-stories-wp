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
import { Add, EditPencil } from '../../../../icons';
import { PanelTitle } from '../../panel';

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

const AddPresetButton = styled.button`
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
  title,
  handleAddPreset,
  isEditMode,
  setIsEditMode,
  presets,
  canCollapse,
  presetType,
}) {
  const hasPresets = presets.length > 0;

  const addLabel =
    'style' === presetType
      ? __('Add style preset', 'web-stories')
      : __('Add color preset', 'web-stories');
  const editLabel =
    'style' === presetType
      ? __('Edit style presets', 'web-stories')
      : __('Edit color presets', 'web-stories');
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
              isEditMode ? __('Exit edit mode', 'web-stories') : editLabel
            }
            isEditMode={isEditMode}
          >
            {isEditMode ? __('Exit', 'web-stories') : <EditPencil />}
          </EditMode>
        )}
        {!isEditMode && (
          <AddPresetButton onClick={handleAddPreset} aria-label={addLabel}>
            <Add />
          </AddPresetButton>
        )}
      </>
    );
  };

  return (
    <PanelTitle secondaryAction={getActions()} canCollapse={canCollapse}>
      {title}
    </PanelTitle>
  );
}

PresetsHeader.propTypes = {
  presets: PropTypes.array.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  handleAddPreset: PropTypes.func.isRequired,
  setIsEditMode: PropTypes.func.isRequired,
  canCollapse: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  presetType: PropTypes.string.isRequired,
};

export default PresetsHeader;
