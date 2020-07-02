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
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app/story';
import { Panel } from '../panel';
import useRichTextFormatting from '../textStyle/useRichTextFormatting';
import { COLOR_PRESETS_PER_ROW } from '../../../constants';
import { getPagePreset, getShapePresets, getTextPresets } from './utils';
import PresetsHeader from './header';
import Presets from './presets';
import Resize from './resize';

function StylePresetPanel() {
  const {
    currentPage,
    selectedElementIds,
    selectedElements,
    stylePresets,
    updateStory,
    updateElementsById,
    updateCurrentPageProperties,
  } = useStory(
    ({
      state: {
        currentPage,
        selectedElementIds,
        selectedElements,
        story: { stylePresets },
      },
      actions: { updateStory, updateElementsById, updateCurrentPageProperties },
    }) => {
      return {
        currentPage,
        selectedElementIds,
        selectedElements,
        stylePresets,
        updateStory,
        updateElementsById,
        updateCurrentPageProperties,
      };
    }
  );

  const { colors } = stylePresets;
  const [isEditMode, setIsEditMode] = useState(false);

  const areAllType = (elType) => {
    return (
      selectedElements.length > 0 &&
      selectedElements.every(({ type }) => elType === type)
    );
  };

  const isText = areAllType('text');
  const isShape = areAllType('shape');
  const isBackground = selectedElements[0].id === currentPage.elements[0].id;

  const handleDeletePreset = useCallback(
    (toDelete) => {
      updateStory({
        properties: {
          stylePresets: {
            ...stylePresets,
            colors: colors.filter((color) => color !== toDelete),
          },
        },
      });
    },
    [colors, stylePresets, updateStory]
  );

  const handleAddColorPreset = useCallback(
    (evt) => {
      evt.stopPropagation();
      let addedPresets = {
        colors: [],
      };
      if (isText) {
        addedPresets = {
          ...addedPresets,
          ...getTextPresets(selectedElements, stylePresets),
        };
      } else if (isBackground) {
        addedPresets = {
          ...addedPresets,
          ...getPagePreset(currentPage, stylePresets),
        };
      } else {
        addedPresets = {
          ...addedPresets,
          ...getShapePresets(selectedElements, stylePresets),
        };
      }
      if (addedPresets.colors?.length > 0) {
        updateStory({
          properties: {
            stylePresets: {
              ...stylePresets,
              colors: [...colors, ...addedPresets.colors],
            },
          },
        });
      }
    },
    [
      currentPage,
      isBackground,
      colors,
      isText,
      selectedElements,
      updateStory,
      stylePresets,
    ]
  );

  const extraPropsToAdd = useRef(null);
  const miniPushUpdate = useCallback(
    (updater) => {
      updateElementsById({
        elementIds: selectedElementIds,
        properties: (oldProps) => ({
          ...updater(oldProps),
          ...extraPropsToAdd.current,
        }),
      });
      extraPropsToAdd.current = null;
    },
    [selectedElementIds, updateElementsById]
  );

  const {
    handlers: { handleSetColor },
  } = useRichTextFormatting(selectedElements, miniPushUpdate);

  const handleApplyPreset = useCallback(
    (preset) => {
      if (isText) {
        handleSetColor(preset);
      } else if (isBackground) {
        updateCurrentPageProperties({
          properties: { backgroundColor: preset },
        });
      } else {
        updateElementsById({
          elementIds: selectedElementIds,
          properties: { backgroundColor: preset },
        });
      }
    },
    [
      isBackground,
      updateCurrentPageProperties,
      isText,
      handleSetColor,
      selectedElementIds,
      updateElementsById,
    ]
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

  return (
    <Panel
      name="stylepreset"
      initialHeight={Math.min(initialHeight, window.innerHeight / 3)}
      resizeable={resizeable}
      canCollapse={canCollapse}
    >
      <PresetsHeader
        handleAddColorPreset={handleAddColorPreset}
        stylePresets={stylePresets}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        canCollapse={canCollapse}
      />
      <Presets
        isEditMode={isEditMode}
        stylePresets={stylePresets}
        handleOnClick={handlePresetClick}
        isBackground={isBackground}
        isText={isText}
      />
      {resizeable && <Resize position="bottom" />}
    </Panel>
  );
}

export default StylePresetPanel;
