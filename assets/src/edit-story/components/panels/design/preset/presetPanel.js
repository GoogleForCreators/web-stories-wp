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
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import { Panel } from '../../panel';
import { TranslateWithMarkup } from '../../../../../i18n';
import { Add } from '../../../../../design-system/icons';
import { areAllType, getPanelInitialHeight } from './utils';
import PresetsHeader from './header';
import Presets from './presets';
import Resize from './resize';
import useApplyPreset from './useApplyPreset';
import useAddPreset from './useAddPreset';
import ColorAdd from './colorAdd';

const ButtonWrapper = styled.div`
  width: 100%;
  padding: 0px 30px 10px;
  text-align: center;
  line-height: 20px;
`;

function PresetPanel({
  presetType = 'color',
  title,
  itemRenderer,
  pushUpdate,
}) {
  const isStyle = 'style' === presetType;
  const isColor = 'color' === presetType;
  const {
    localColorPresets,
    selectedElements,
    stylePresets,
    updateStory,
  } = useStory(
    ({
      state: {
        selectedElements,
        story: { stylePresets, localColorPresets },
      },
      actions: { updateStory },
    }) => {
      return {
        localColorPresets,
        selectedElements,
        stylePresets,
        updateStory,
      };
    }
  );

  const { colors, textStyles } = stylePresets;
  const globalPresets = isColor ? colors : textStyles;
  const { colors: localColors } = localColorPresets;
  const hasLocalPresets = localColors.length > 0;
  const hasPresets = isColor
    ? globalPresets.length > 0 || hasLocalPresets
    : globalPresets.length > 0;

  const [isEditMode, setIsEditMode] = useState(false);

  const isText = areAllType('text', selectedElements);
  const isShape = areAllType('shape', selectedElements);

  const handleApplyPreset = useApplyPreset(isColor, pushUpdate);
  const handleAddPreset = useAddPreset(presetType);
  const handleAddLocalPreset = useAddPreset(presetType, true);

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

  const handleDeleteLocalPreset = useCallback(
    (toDelete) => {
      const updatedColors = localColors.filter((color) => color !== toDelete);
      updateStory({
        properties: {
          localColorPresets: { colors: updatedColors },
        },
      });
      // If no colors are left, exit edit mode.
      if (updatedColors.length === 0 && !globalPresets.length > 0) {
        setIsEditMode(false);
      }
    },
    [globalPresets.length, localColors, updateStory]
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

  const handlePresetClick = (preset, isLocal = false) => {
    if (isEditMode) {
      if (isLocal) {
        handleDeleteLocalPreset(preset);
      } else {
        handleDeletePreset(preset);
      }
    } else {
      handleApplyPreset(preset);
    }
  };

  const resizeable = hasPresets;
  const canCollapse = !isEditMode && (hasPresets || isColor);

  if (!isStyle && !isColor) {
    return null;
  }

  return (
    <Panel
      name={`stylepreset-${presetType}`}
      initialHeight={getPanelInitialHeight(isColor, globalPresets)}
      resizeable={resizeable}
      canCollapse={canCollapse}
    >
      <PresetsHeader
        handleAddPreset={handleAddPreset}
        hasPresets={hasPresets}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        canCollapse={canCollapse}
        title={title}
        presetType={presetType}
      />
      <Presets
        isEditMode={isEditMode}
        presets={globalPresets}
        handleOnClick={handlePresetClick}
        handleAddPreset={handleAddPreset}
        itemRenderer={itemRenderer}
        type={presetType}
      />
      {isColor && (
        <>
          <Presets
            isEditMode={isEditMode}
            presets={localColorPresets?.colors || []}
            handleOnClick={(preset) => handlePresetClick(preset, true)}
            handleAddPreset={handleAddLocalPreset}
            itemRenderer={itemRenderer}
            type={presetType}
          />
          {!hasPresets && (
            <ButtonWrapper>
              <ColorAdd
                handleAddPreset={handleAddPreset}
                helper={
                  <TranslateWithMarkup
                    mapping={{
                      i: <Add width={18} height={13} />,
                    }}
                  >
                    {__(
                      'Click on the <i></i> icon to save a color to all stories.',
                      'web-stories'
                    )}
                  </TranslateWithMarkup>
                }
              />
            </ButtonWrapper>
          )}
        </>
      )}
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
