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
import { __ } from '@web-stories-wp/i18n';
import styled from 'styled-components';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { PanelTitle } from '../../panel';
import { focusStyle } from '../../shared';
import { PRESET_TYPES } from '../../../../constants';

const StyledButton = styled(Button)`
  ${focusStyle};
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
    const buttonProps = {
      type: BUTTON_TYPES.TERTIARY,
      size: BUTTON_SIZES.SMALL,
      variant: BUTTON_VARIANTS.SQUARE,
      onClick: (evt) => {
        evt.stopPropagation();
        setIsEditMode(!isEditMode);
      },
      isEditMode,
    };
    return (
      <>
        {hasPresets && isEditMode && (
          <StyledButton
            {...buttonProps}
            aria-label={__('Exit edit mode', 'web-stories')}
          >
            {__('Done', 'web-stories')}
          </StyledButton>
        )}
        {hasPresets && !isEditMode && (
          <StyledButton {...buttonProps} aria-label={editLabel}>
            <Icons.Pencil />
          </StyledButton>
        )}
        {!isEditMode && !isColor && (
          <StyledButton
            type={BUTTON_TYPES.TERTIARY}
            size={BUTTON_SIZES.SMALL}
            variant={BUTTON_VARIANTS.SQUARE}
            onClick={handleAddPreset}
            aria-label={__('Add style', 'web-stories')}
          >
            <Icons.Plus />
          </StyledButton>
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
