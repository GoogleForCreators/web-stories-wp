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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../../app/story';
import useAddPreset from '../useAddPreset';
import { PRESET_TYPES } from '../constants';
import EmptyPanel from './emptyPanel';
import ColorGroup from './colorGroup';

const Title = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.fg.tertiary};
  margin-bottom: 10px;
`;

const GroupWrapper = styled.div`
  margin-bottom: 10px;
`;

function ColorPresetPanel({ isEditMode, handlePresetClick }) {
  const presetType = PRESET_TYPES.COLOR;
  const { currentStoryStyles, globalStoryStyles } = useStory(
    ({
      state: {
        story: { globalStoryStyles, currentStoryStyles },
      },
    }) => {
      return {
        currentStoryStyles,
        globalStoryStyles,
      };
    }
  );

  const { addGlobalPreset, addLocalPreset } = useAddPreset({ presetType });

  const { colors: globalStyles } = globalStoryStyles;
  const { colors: localStyles } = currentStoryStyles;
  const hasPresets = globalStyles.length > 0 || localStyles.length > 0;
  const groupProps = {
    type: presetType,
    isEditMode,
    displayAdd: !isEditMode,
  };
  return (
    <>
      {hasPresets && (
        <>
          <GroupWrapper>
            <Title>{__('Current story', 'web-stories')}</Title>
            <ColorGroup
              colors={localStyles}
              handleAddPreset={addLocalPreset}
              isLocal
              handleClick={(preset) =>
                handlePresetClick(preset, true /* isLocal */)
              }
              {...groupProps}
            />
          </GroupWrapper>
          <GroupWrapper>
            <Title>{__('All stories', 'web-stories')}</Title>
            <ColorGroup
              colors={globalStyles}
              handleClick={handlePresetClick}
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
};

export default ColorPresetPanel;
