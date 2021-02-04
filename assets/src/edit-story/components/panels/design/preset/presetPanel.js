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
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import { Panel, PanelContent } from '../../panel';
import { areAllType, getPanelInitialHeight } from './utils';
import PresetsHeader from './header';
import Resize from './resize';
import useAddPreset from './useAddPreset';
import ColorPresetPanel from './colorPreset/colorPresetPanel';
import useDeletePreset from './useDeletePreset';
import StyleGroup from './stylePreset/styleGroup';
import useApplyColor from './colorPreset/useApplyColor';
import useApplyStyle from './stylePreset/useApplyStyle';

function PresetPanel({ presetType, title, pushUpdate }) {
  const isStyle = 'style' === presetType;
  const isColor = 'color' === presetType;
  const { currentStoryStyles, selectedElements, globalStoryStyles } = useStory(
    ({
      state: {
        selectedElements,
        story: { globalStoryStyles, currentStoryStyles },
      },
    }) => {
      return {
        currentStoryStyles,
        selectedElements,
        globalStoryStyles,
      };
    }
  );

  const { colors, textStyles } = globalStoryStyles;
  const globalPresets = isColor ? colors : textStyles;
  const { colors: localColors } = currentStoryStyles;
  const hasLocalPresets = localColors.length > 0;
  // If there are any global presets or local colors in case of color.
  const hasPresets = globalPresets.length > 0 || (isColor && hasLocalPresets);

  const [isEditMode, setIsEditMode] = useState(false);

  const handleApplyColor = useApplyColor({ pushUpdate });
  const handleApplyStyle = useApplyStyle({ pushUpdate });
  const handleApplyPreset = isColor ? handleApplyColor : handleApplyStyle;
  const { addGlobalPreset } = useAddPreset({ presetType });
  const { deleteLocalPreset, deleteGlobalPreset } = useDeletePreset({
    presetType,
    setIsEditMode,
  });

  useEffect(() => {
    // If there are no colors left, exit edit mode.
    if (isEditMode && !hasPresets) {
      setIsEditMode(false);
    }
  }, [hasPresets, isEditMode]);

  if (!isStyle && !isColor) {
    return null;
  }

  const isText = areAllType('text', selectedElements);
  const isShape = areAllType('shape', selectedElements);
  // Text and shape presets are not compatible.
  if (!isText && !isShape && selectedElements.length > 1) {
    return null;
  }

  const handlePresetClick = (preset, isLocal = false) => {
    if (isEditMode) {
      if (isLocal) {
        deleteLocalPreset(preset);
      } else {
        deleteGlobalPreset(preset);
      }
    } else {
      handleApplyPreset(preset);
    }
  };

  const resizeable = hasPresets;
  const canCollapse = !isEditMode && (hasPresets || isColor);
  return (
    <Panel
      name={`stylepreset-${presetType}`}
      initialHeight={getPanelInitialHeight(isColor, globalPresets)}
      resizeable={resizeable}
      canCollapse={canCollapse}
    >
      <PresetsHeader
        handleAddPreset={addGlobalPreset}
        hasPresets={hasPresets}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        canCollapse={canCollapse}
        title={title}
        presetType={presetType}
      />
      <PanelContent isPrimary padding={!hasPresets && '0'}>
        {isColor && (
          <ColorPresetPanel
            isEditMode={isEditMode}
            handlePresetClick={handlePresetClick}
          />
        )}
        {isStyle && (
          <StyleGroup
            styles={globalPresets}
            isEditMode={isEditMode}
            handleClick={handlePresetClick}
          />
        )}
      </PanelContent>
      {resizeable && <Resize position="bottom" />}
    </Panel>
  );
}

PresetPanel.propTypes = {
  presetType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default PresetPanel;
