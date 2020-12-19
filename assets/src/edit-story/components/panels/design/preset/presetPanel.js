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
import { useStory } from '../../../../app/story';
import {
  COLOR_PRESETS_PER_ROW,
  STYLE_PRESETS_PER_ROW,
} from '../../../../constants';
import { Panel } from '../../panel';
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
  const presets = isColor ? colors : textStyles;
  const hasPresets = presets.length > 0;

  const [isEditMode, setIsEditMode] = useState(false);

  const isText = areAllType('text', selectedElements);
  const isShape = areAllType('shape', selectedElements);

  const handleApplyPreset = useApplyPreset(isColor, pushUpdate);
  const handleAddPreset = useAddPreset(presetType);

  const handleDeletePreset = useCallback(
    (toDelete) => {
      const updatedStyles = isColor
        ? colors.filter((color) => color !== toDelete)
        : textStyles.filter((style) => style !== toDelete);
      updateStory({
        properties: {
          stylePresets: {
            textStyles: isColor ? textStyles : updatedStyles,
            colors: isColor ? updatedStyles : colors,
          },
        },
      });
      // If no styles left, exit edit mode.
      if (updatedStyles.length === 0) {
        setIsEditMode(false);
      }
    },
    [colors, isColor, textStyles, updateStory]
  );

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

  const rowHeight = isColor ? 35 : 48;
  const presetsCount = isColor ? colors.length : textStyles.length;
  let initialHeight = 0;
  if (presetsCount > 0) {
    const presetsPerRow = isColor
      ? COLOR_PRESETS_PER_ROW
      : STYLE_PRESETS_PER_ROW;
    initialHeight = Math.max(1.5, colors.length / presetsPerRow) * rowHeight;
  }

  const resizeable = hasPresets;
  const canCollapse = !isEditMode && hasPresets;

  if (!isStyle && !isColor) {
    return null;
  }

  return (
    <Panel
      name={`stylepreset-${presetType}`}
      initialHeight={Math.min(initialHeight, window.innerHeight / 3)}
      resizeable={resizeable}
      canCollapse={canCollapse}
    >
      <PresetsHeader
        handleAddPreset={handleAddPreset}
        presets={presets}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        canCollapse={canCollapse}
        title={title}
        presetType={presetType}
      />
      <Presets
        isEditMode={isEditMode}
        presets={presets}
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
