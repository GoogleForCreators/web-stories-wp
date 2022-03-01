/*
 * Copyright 2022 Google LLC
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
import { useSnackbar } from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import { useCallback, useRef } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import { PRESET_TYPES } from '../../../constants';
import useDeleteColor from '../../../components/colorPicker/useDeleteColor';
import useDeleteStyle from '../../../components/styleManager/useDeleteStyle';
import useAddPreset from '../../../utils/useAddPreset';
import { noop } from '../../../utils/noop';
import { useHistory, useStory } from '../..';
import { UNDO_HELP_TEXT } from './constants';

/**
 * Creates the right click menu preset actions.
 *
 * @return {Object} Right click menu preset actions
 */
const usePresetActions = () => {
  const { addGlobalPreset: addGlobalTextPreset } = useAddPreset({
    presetType: PRESET_TYPES.STYLE,
  });
  const { addGlobalPreset: addGlobalColorPreset } = useAddPreset({
    presetType: PRESET_TYPES.COLOR,
  });
  const deleteGlobalTextPreset = useDeleteStyle({
    onEmpty: noop,
  });
  const { deleteGlobalColor: deleteGlobalColorPreset } = useDeleteColor({
    onEmpty: noop,
  });
  const selectedElement = useStory(({ state }) => state.selectedElements?.[0]);

  const showSnackbar = useSnackbar((value) => value.showSnackbar);

  const undo = useHistory(({ actions }) => actions.undo);

  // Needed to not pass stale refs of `undo` to snackbar
  const undoRef = useRef(undo);
  undoRef.current = undo;

  /**
   * Add text styles to global presets.
   *
   * @param {Event} evt The triggering event
   */
  const handleAddTextPreset = useCallback(
    (evt) => {
      const preset = addGlobalTextPreset(evt);

      showSnackbar({
        actionLabel: __('Undo', 'web-stories'),
        dismissible: false,
        message: __('Saved style to "Saved Styles".', 'web-stories'),
        onAction: () => {
          deleteGlobalTextPreset(preset);

          trackEvent('context_menu_action', {
            name: 'remove_text_preset',
            element: selectedElement?.type,
          });
        },
        actionHelpText: UNDO_HELP_TEXT,
      });

      trackEvent('context_menu_action', {
        name: 'add_text_preset',
        element: selectedElement?.type,
      });
    },
    [
      addGlobalTextPreset,
      deleteGlobalTextPreset,
      selectedElement?.type,
      showSnackbar,
    ]
  );

  /**
   * Add color to global presets.
   *
   * @param {Event} evt The triggering event
   */
  const handleAddColorPreset = useCallback(
    (evt) => {
      const preset = addGlobalColorPreset(evt);

      showSnackbar({
        actionLabel: __('Undo', 'web-stories'),
        dismissible: false,
        message: __('Added color to "Saved Colors".', 'web-stories'),
        onAction: () => {
          deleteGlobalColorPreset(preset);

          trackEvent('context_menu_action', {
            name: 'remove_color_preset',
            element: selectedElement?.type,
          });
        },
        actionHelpText: UNDO_HELP_TEXT,
      });

      trackEvent('context_menu_action', {
        name: 'add_color_preset',
        element: selectedElement?.type,
      });
    },
    [
      addGlobalColorPreset,
      deleteGlobalColorPreset,
      selectedElement?.type,
      showSnackbar,
    ]
  );

  return {
    handleAddTextPreset,
    handleAddColorPreset,
  };
};

export default usePresetActions;
