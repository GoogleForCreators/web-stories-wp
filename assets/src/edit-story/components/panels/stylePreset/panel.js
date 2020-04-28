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

/**
 * Internal dependencies
 */
import { useStory } from '../../../app/story';
import stripHTML from '../../../utils/stripHTML';
import { Panel } from './../panel';
import { getShapePresets, getTextPresets } from './utils';
import PresetsHeader from './header';
import Presets from './presets';
import Resize from './resize';

function StylePresetPanel() {
  const {
    state: {
      selectedElementIds,
      selectedElements,
      story: { stylePresets },
    },
    actions: { updateStory, updateElementsById },
  } = useStory();

  const { fillColors, textColors, textStyles } = stylePresets;
  const [isEditMode, setIsEditMode] = useState(false);

  const areAllType = (elType) => {
    return (
      selectedElements.length > 0 &&
      selectedElements.every(({ type }) => elType === type)
    );
  };

  const isText = areAllType('text');
  const isShape = areAllType('shape');

  const handleDeletePreset = useCallback(
    (toDelete) => {
      updateStory({
        properties: {
          stylePresets: {
            textStyles: textStyles.filter((style) => style !== toDelete),
            fillColors: isText
              ? fillColors
              : fillColors.filter((color) => color !== toDelete),
            textColors: !isText
              ? textColors
              : textColors.filter((color) => color !== toDelete),
          },
        },
      });
    },
    [textStyles, fillColors, isText, textColors, updateStory]
  );

  const handleAddColorPreset = useCallback(
    (evt) => {
      evt.stopPropagation();
      let addedPresets = {
        fillColors: [],
        textColors: [],
        textStyles: [],
      };
      if (isText) {
        addedPresets = {
          ...addedPresets,
          ...getTextPresets(selectedElements, stylePresets),
        };
      } else {
        // Currently, shape only supports fillColors.
        addedPresets = {
          ...addedPresets,
          ...getShapePresets(selectedElements, stylePresets),
        };
      }
      if (
        addedPresets.fillColors?.length > 0 ||
        addedPresets.textColors?.length > 0 ||
        addedPresets.textStyles?.length > 0
      ) {
        updateStory({
          properties: {
            stylePresets: {
              textStyles: [...textStyles, ...addedPresets.textStyles],
              fillColors: [...fillColors, ...addedPresets.fillColors],
              textColors: [...textColors, ...addedPresets.textColors],
            },
          },
        });
      }
    },
    [
      fillColors,
      textStyles,
      textColors,
      isText,
      selectedElements,
      updateStory,
      stylePresets,
    ]
  );

  const handleApplyPreset = useCallback(
    (preset) => {
      if (isText) {
        // @todo Determine this in a better way.
        // Only style presets have background text mode set.
        const isStylePreset = preset.backgroundTextMode !== undefined;
        updateElementsById({
          elementIds: selectedElementIds,
          properties: isStylePreset ? { ...preset } : { color: preset },
        });
      } else {
        updateElementsById({
          elementIds: selectedElementIds,
          properties: { backgroundColor: preset },
        });
      }
    },
    [isText, selectedElementIds, updateElementsById]
  );

  const colorPresets = isText ? textColors : fillColors;
  const hasColorPresets = colorPresets.length > 0;
  const hasPresets = hasColorPresets || textStyles.length > 0;

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

  // @Todo confirm initial height.
  return (
    <Panel
      name="stylepreset"
      initialHeight={Math.min(200, window.innerHeight / 3)}
      resizeable
    >
      <PresetsHeader
        handleAddColorPreset={handleAddColorPreset}
        stylePresets={stylePresets}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
      />
      <Presets
        isEditMode={isEditMode}
        stylePresets={stylePresets}
        handleOnClick={handlePresetClick}
        isText={isText}
        textContent={isText ? stripHTML(selectedElements[0].content) : ''}
      />
      <Resize />
    </Panel>
  );
}

export default StylePresetPanel;
