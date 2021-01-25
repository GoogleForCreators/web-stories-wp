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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Presets from '../presets';
import { useStory } from '../../../../../app/story';
import useAddPreset from '../useAddPreset';
import EmptyPanel from './emptyPanel';

const Title = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.fg.tertiary};
  margin-bottom: 10px;
`;

const GroupWrapper = styled.div`
  margin-bottom: 10px;
`;

function ColorPresetPanel({ isEditMode, handlePresetClick, itemRenderer }) {
  const presetType = 'color';
  const { storyPresets, stylePresets } = useStory(
    ({
      state: {
        story: { stylePresets, storyPresets },
      },
    }) => {
      return {
        storyPresets,
        stylePresets,
      };
    }
  );

  const { addGlobalPreset, addLocalPreset } = useAddPreset(presetType);

  const { colors: globalPresets } = stylePresets;
  const { colors: localPresets } = storyPresets;
  const hasPresets = globalPresets.length > 0 || localPresets.length > 0;
  const groupProps = {
    isEditMode,
    itemRenderer,
    type: presetType,
  };
  return (
    <>
      {hasPresets && (
        <>
          <GroupWrapper>
            <Title>{__('Current story', 'web-stories')}</Title>
            <Presets
              presets={storyPresets?.colors || []}
              handleOnClick={(preset) => handlePresetClick(preset, true)}
              handleAddPreset={addLocalPreset}
              {...groupProps}
            />
          </GroupWrapper>
          <GroupWrapper>
            <Title>{__('All stories', 'web-stories')}</Title>
            <Presets
              presets={globalPresets}
              handleOnClick={handlePresetClick}
              handleAddPreset={addGlobalPreset}
              {...groupProps}
            />
          </GroupWrapper>
        </>
      )}
      {!hasPresets && (
        <EmptyPanel
          handleAddPreset={addGlobalPreset}
          handleAddLocalPreset={addLocalPreset}
        />
      )}
    </>
  );
}

ColorPresetPanel.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  handlePresetClick: PropTypes.func.isRequired,
  itemRenderer: PropTypes.func.isRequired,
};

export default ColorPresetPanel;
