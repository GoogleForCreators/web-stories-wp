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
import { useCallback } from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../../app/story';
import { PatternPropType } from '../../../../../types';
import { findMatchingColor } from '../utils';

const ActionsWrapper = styled.div`
  text-align: center;
  border-top: 1px solid ${({ theme }) => theme.colors.fg.v6};
`;

const AddColorPreset = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => rgba(theme.colors.accent.primary, 0.84)};
  cursor: pointer;
  padding: 12px 0px;
  line-height: 18px;
  font-size: 13px;
`;

function ColorPresetActions({ color }) {
  const { selectedElements, stylePresets, updateStory } = useStory(
    ({
      state: {
        selectedElements,
        story: { stylePresets },
      },
      actions: { updateStory },
    }) => ({ selectedElements, stylePresets, updateStory })
  );

  const { colors } = stylePresets;

  // @todo This will change with the missing multi-selection handling.
  const isText =
    selectedElements.length > 0 &&
    selectedElements.every(({ type }) => 'text' === type);

  const handleAddColorPreset = useCallback(
    (toAdd) => {
      if (toAdd) {
        // If match found, don't add.
        // @todo UX improvement: notify the user/mark the existing color?
        if (findMatchingColor(toAdd, stylePresets, isText)) {
          return;
        }

        updateStory({
          properties: {
            stylePresets: {
              ...stylePresets,
              colors: [...colors, toAdd],
            },
          },
        });
      }
    },
    [stylePresets, isText, colors, updateStory]
  );

  return (
    <ActionsWrapper>
      <AddColorPreset onClick={() => handleAddColorPreset(color)}>
        {__('+ Add to Color Preset', 'web-stories')}
      </AddColorPreset>
    </ActionsWrapper>
  );
}

ColorPresetActions.propTypes = {
  color: PatternPropType,
};

export default ColorPresetActions;
