/*
 * Copyright 2021 Google LLC
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
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import Presets from '../presets';
import { useStory } from '../../../../../app/story';
import useAddPreset from '../useAddPreset';
import EmptyPanel from './emptyPanel';

const Wrapper = styled.div``;

function ColorPresetPanel({ isEditMode, handlePresetClick, itemRenderer }) {
  const presetType = 'color';
  const { localColorPresets, stylePresets } = useStory(
    ({
      state: {
        story: { stylePresets, localColorPresets },
      },
    }) => {
      return {
        localColorPresets,
        stylePresets,
      };
    }
  );
  const handleAddPreset = useAddPreset(presetType);
  const handleAddLocalPreset = useAddPreset(presetType, true);

  const { colors: globalPresets } = stylePresets;
  const { colors: localPresets } = localColorPresets;
  const hasPresets = globalPresets.length > 0 || localPresets.length > 0;
  return (
    <Wrapper>
      <Presets
        isEditMode={isEditMode}
        presets={globalPresets}
        handleOnClick={handlePresetClick}
        handleAddPreset={handleAddPreset}
        itemRenderer={itemRenderer}
        type={presetType}
      />
      <Presets
        isEditMode={isEditMode}
        presets={localColorPresets?.colors || []}
        handleOnClick={(preset) => handlePresetClick(preset, true)}
        handleAddPreset={handleAddLocalPreset}
        itemRenderer={itemRenderer}
        type={presetType}
      />
      {!hasPresets && (
        <EmptyPanel
          handleAddPreset={handleAddPreset}
          handleAddLocalPreset={handleAddLocalPreset}
        />
      )}
    </Wrapper>
  );
}

ColorPresetPanel.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  handlePresetClick: PropTypes.func.isRequired,
  itemRenderer: PropTypes.func.isRequired,
};

export default ColorPresetPanel;
