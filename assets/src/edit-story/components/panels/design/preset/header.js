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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Icons } from '../../../../../design-system';
import { PanelTitle } from '../../panel';
import { PRESET_TYPES } from './constants';

const buttonCSS = css`
  border: none;
  background: transparent;
  width: 32px;
  height: 32px;
  color: ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.fg.white, 0.84)};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 32px;
    height: 32px;
  }
`;

const AddPresetButton = styled.button`
  ${buttonCSS}
`;

const EditMode = styled.button`
  ${buttonCSS}

  ${({ isEditMode }) =>
    isEditMode &&
    css`
      color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};
      font-size: 12px;
      line-height: 14px;
      padding: 7px;
      height: initial;
    `}
`;

function PresetsHeader({
  title,
  handleAddPreset,
  isEditMode,
  setIsEditMode,
  hasPresets,
  canCollapse,
  presetType,
}) {
  const isColor = PRESET_TYPES.COLOR === presetType;
  const editLabel = isColor
    ? __('Edit colors', 'web-stories')
    : __('Edit styles', 'web-stories');
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
            {isEditMode ? __('Done', 'web-stories') : <Icons.Pencil />}
          </EditMode>
        )}
        {!isEditMode && !isColor && (
          <AddPresetButton
            onClick={handleAddPreset}
            aria-label={__('Add style', 'web-stories')}
          >
            <Icons.Plus />
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
  hasPresets: PropTypes.bool.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  handleAddPreset: PropTypes.func.isRequired,
  setIsEditMode: PropTypes.func.isRequired,
  canCollapse: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  presetType: PropTypes.string.isRequired,
};

export default PresetsHeader;
