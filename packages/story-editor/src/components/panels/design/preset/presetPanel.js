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
import { useEffect, useState } from '@web-stories-wp/react';
import PropTypes from 'prop-types';
import {
  localStore,
  LOCAL_STORAGE_PREFIX,
} from '@web-stories-wp/design-system';

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
import { PRESET_TYPES } from './constants';
import useApplyStyle from './stylePreset/useApplyStyle';
import ConfirmationDialog from './confirmationDialog';

function PresetPanel({ presetType, title, pushUpdate }) {
  const isStyle = PRESET_TYPES.STYLE === presetType;
  const isColor = PRESET_TYPES.COLOR === presetType;
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

  const [showDialog, setShowDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [toDelete, setToDelete] = useState(null);

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
    // If not in edit mode, apply the color.
    if (!isEditMode) {
      handleApplyPreset(preset);
      return;
    }
    // If deleting a local color, delete without confirmation.
    if (isLocal) {
      deleteLocalPreset(preset);
      return;
    }

    // If the user has dismissed the confirmation dialogue previously.
    const storageKey =
      PRESET_TYPES.COLOR === presetType
        ? 'DELETE_COLOR_PRESET_DIALOG_DISMISSED'
        : 'DELETE_STYLE_PRESET_DIALOG_DISMISSED';
    const isDialogDismissed = localStore.getItemByKey(
      LOCAL_STORAGE_PREFIX[storageKey]
    );
    if (isDialogDismissed) {
      deleteGlobalPreset(preset);
      return;
    }

    // Ask confirmation for a global preset.
    setShowDialog(true);
    setToDelete(preset);
  };

  const resizable = hasPresets;
  const canCollapse = !isEditMode && (hasPresets || isColor);
  return (
    <Panel
      name={`stylepreset-${presetType}`}
      initialHeight={getPanelInitialHeight(isColor, globalPresets)}
      resizable={resizable}
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
      <PanelContent isPrimary>
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
      {resizable && <Resize position="bottom" />}
      {showDialog && (
        <ConfirmationDialog
          presetType={presetType}
          onClose={() => setShowDialog(false)}
          onPrimary={() => {
            deleteGlobalPreset(toDelete);
            setToDelete(null);
            setShowDialog(false);
          }}
        />
      )}
    </Panel>
  );
}

PresetPanel.propTypes = {
  presetType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default PresetPanel;
