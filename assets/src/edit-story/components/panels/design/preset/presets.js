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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { PanelContent } from '../../panel';
import PresetGroup from './presetGroup';
import ColorAdd from './colorAdd';

const ButtonWrapper = styled.div`
  width: 100%;
  padding: 0px 30px 10px;
  text-align: center;
  line-height: 20px;
`;

function Presets({
  presets,
  handleOnClick,
  itemRenderer,
  isEditMode,
  type,
  handleAddPreset,
}) {
  const hasPresets = presets.length > 0;

  return (
    <PanelContent isPrimary padding={hasPresets ? null : '0'}>
      {hasPresets && (
        <PresetGroup
          itemRenderer={itemRenderer}
          presets={presets}
          type={type}
          isEditMode={isEditMode}
          handleClick={handleOnClick}
          handleAddPreset={handleAddPreset}
        />
      )}
      {!hasPresets && 'color' === type && (
        <ButtonWrapper>
          <ColorAdd
            handleAddPreset={handleAddPreset}
            helper={__(
              'Click on the + icon to save a color to all stories',
              'web-stories'
            )}
          />
        </ButtonWrapper>
      )}
    </PanelContent>
  );
}

Presets.propTypes = {
  presets: PropTypes.array.isRequired,
  itemRenderer: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  handleOnClick: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  handleAddPreset: PropTypes.func.isRequired,
};

export default Presets;
