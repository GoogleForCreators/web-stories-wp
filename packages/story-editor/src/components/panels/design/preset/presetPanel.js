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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import { Panel, PanelContent } from '../../panel';
import {
  areAllType,
  getPanelInitialHeight,
} from '../../../../utils/presetUtils';
import { PRESET_TYPES } from '../../../../constants';
import useAddPreset from '../../../../utils/useAddPreset';
import PresetsHeader from './header';
import Resize from './resize';
import useDeletePreset from './useDeletePreset';
import StyleGroup from './stylePreset/styleGroup';
import useApplyStyle from './stylePreset/useApplyStyle';
import ConfirmationDialog from './confirmationDialog';

function PresetPanel({ pushUpdate }) {
  const { selectedElements, globalStoryStyles } = useStory(
    ({
      state: {
        selectedElements,
        story: { globalStoryStyles },
      },
    }) => {
      return {
        selectedElements,
        globalStoryStyles,
      };
    }
  );

  const { textStyles: globalPresets } = globalStoryStyles;
  const hasPresets = globalPresets.length > 0;

  const [showDialog, setShowDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const handleApplyStyle = useApplyStyle({ pushUpdate });
  const { addGlobalPreset } = useAddPreset({ presetType: PRESET_TYPES.STYLE });
  const { deleteLocalPreset, deleteGlobalPreset } = useDeletePreset({
    presetType: PRESET_TYPES.STYLE,
    setIsEditMode,
  });

  useEffect(() => {
    // If there are no colors left, exit edit mode.
    if (isEditMode && !hasPresets) {
      setIsEditMode(false);
    }
  }, [hasPresets, isEditMode]);

  const isText = areAllType('text', selectedElements);
  if (!isText) {
    return null;
  }

  const handlePresetClick = (preset, isLocal = false) => {
    // If not in edit mode, apply the color.
    if (!isEditMode) {
      handleApplyStyle(preset);
      return;
    }
    // If deleting a local color, delete without confirmation.
    if (isLocal) {
      deleteLocalPreset(preset);
      return;
    }

    // If the user has dismissed the confirmation dialogue previously.
    const storageKey = 'DELETE_STYLE_PRESET_DIALOG_DISMISSED';
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
  const canCollapse = !isEditMode && hasPresets;
  return (
    <Panel
      name={`stylepreset-${PRESET_TYPES.STYLE}`}
      initialHeight={getPanelInitialHeight(globalPresets)}
      resizable={resizable}
      canCollapse={canCollapse}
    >
      <PresetsHeader
        handleAddPreset={addGlobalPreset}
        hasPresets={hasPresets}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        canCollapse={canCollapse}
        title={__('Saved Styles', 'web-stories')}
        presetType={PRESET_TYPES.STYLE}
      />
      <PanelContent isPrimary>
        <StyleGroup
          styles={globalPresets}
          isEditMode={isEditMode}
          handleClick={handlePresetClick}
        />
      </PanelContent>
      {resizable && <Resize position="bottom" />}
      {showDialog && (
        <ConfirmationDialog
          presetType={PRESET_TYPES.STYLE}
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
  pushUpdate: PropTypes.func.isRequired,
};

export default PresetPanel;
