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
import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app/story';
import { Panel } from '../panel';
import { COLOR_PRESETS_PER_ROW } from '../../../constants';
import { areAllType } from './utils';
import PresetsHeader from './header';
import Presets from './presets';
import Resize from './resize';
import useApplyPreset from './useApplyPreset';
import useAddPreset from './useAddPreset';

function PresetPanel({
  presetType = 'color',
  title,
  itemRenderer,
  pushUpdate,
}) {
  const isStyle = 'style' === presetType;
  const isColor = 'color' === presetType;
  const { selectedElements, stylePresets, updateStory } = useStory(
    ({
      state: {
        selectedElements,
        story: { stylePresets },
      },
      actions: { updateStory },
    }) => {
      return {
        selectedElements,
        stylePresets,
        updateStory,
      };
    }
  );

  const { colors, textStyles } = stylePresets;
  const [isEditMode, setIsEditMode] = useState(false);

  const isText = areAllType('text', selectedElements);
  const isShape = areAllType('shape', selectedElements);

  const handleApplyPreset = useApplyPreset(isColor, pushUpdate);
  const handleAddPreset = useAddPreset(presetType);

  const handleDeletePreset = useCallback(
    (toDelete) => {
      updateStory({
        properties: {
          stylePresets: {
            textStyles: textStyles.filter((style) => style !== toDelete),
            colors: colors.filter((color) => color !== toDelete),
          },
        },
      });
    },
    [colors, textStyles, updateStory]
  );

  const hasPresets = colors.length > 0;

  useEffect(() => {
    // If there are no colors left, exit edit mode.
    if (isEditMode && !hasPresets) {
      setIsEditMode(false);
    }
  }, [hasPresets, isEditMode]);

  // Text and shape presets are not compatible.
  if (!isText && !isShape && selectedElements.length > 1) {
    return null;
  }

  const handlePresetClick = (preset) => {
    if (isEditMode) {
      handleDeletePreset(preset);
    } else {
      handleApplyPreset(preset);
    }
  };

  const rowHeight = 35;

  // Assume at least 2 lines if there are presets to leave some room.
  const colorRows =
    colors.length > 0 ? Math.max(2, colors.length / COLOR_PRESETS_PER_ROW) : 0;
  const initialHeight = colorRows * rowHeight;

  const resizeable = hasPresets;
  const canCollapse = !isEditMode && hasPresets;

  if (!isStyle && !isColor) {
    return null;
  }

  return (
    <Panel
      name="stylepreset"
      initialHeight={Math.min(initialHeight, window.innerHeight / 3)}
      resizeable={resizeable}
      canCollapse={canCollapse}
    >
      <PresetsHeader
        handleAddPreset={handleAddPreset}
        presets={isColor ? colors : textStyles}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        canCollapse={canCollapse}
        title={title}
        presetType={presetType}
      />
      <Presets
        isEditMode={isEditMode}
        presets={isColor ? colors : textStyles}
        handleOnClick={handlePresetClick}
        itemRenderer={itemRenderer}
        type={presetType}
      />
      {resizeable && <Resize position="bottom" />}
    </Panel>
  );
}

PresetPanel.propTypes = {
  presetType: PropTypes.string,
  itemRenderer: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default PresetPanel;
