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
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Add } from '../../../../../../design-system/icons';
import { useStory } from '../../../../../app/story';
import { PatternPropType } from '../../../../../types';
import { findMatchingColor } from '../utils';
import useApplyPreset from '../useApplyPreset';
import { AdvancedDropDown } from '../../../../form';
import ColorGroup from './colorGroup';

const ActionsWrapper = styled.div`
  text-align: center;
  border-top: 1px solid ${({ theme }) => theme.colors.fg.v6};
  padding: 4px 8px;
`;

const AddColorPreset = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.fg.secondary};
  cursor: pointer;
  padding: 8px 0px;
  line-height: 18px;
  svg {
    width: 16px;
    height: 16px;
  }
`;

const DropDownWrapper = styled.div`
  width: 135px;
`;

const HeaderRow = styled.div`
  display: flex;
`;

const ButtonWrapper = styled.div`
  text-align: end;
  flex-grow: 1;
`;

const LOCAL = 'local';
const GLOBAL = 'global';

function ColorPresetActions({ color, pushUpdate }) {
  const [showLocalColors, setShowLocalColors] = useState(true);
  const {
    selectedElements,
    currentStoryStyles,
    globalStoryStyles,
    updateStory,
  } = useStory(
    ({
      state: {
        selectedElements,
        story: { globalStoryStyles, currentStoryStyles },
      },
      actions: { updateStory },
    }) => ({
      selectedElements,
      globalStoryStyles,
      currentStoryStyles,
      updateStory,
    })
  );

  const { colors: globalColors } = globalStoryStyles;
  const { colors: localColors } = currentStoryStyles;

  const applyStyle = useApplyPreset({ isColor: true, pushUpdate });

  // @todo This will change with the missing multi-selection handling.
  const isText =
    selectedElements.length > 0 &&
    selectedElements.every(({ type }) => 'text' === type);

  const handleAddColorPreset = useCallback(
    (toAdd) => {
      if (toAdd) {
        // If match found, don't add.
        // @todo UX improvement: notify the user/mark the existing color?
        if (findMatchingColor(toAdd, globalStoryStyles, isText)) {
          return;
        }

        updateStory({
          properties: {
            globalStoryStyles: {
              ...globalStoryStyles,
              colors: [...globalColors, toAdd],
            },
          },
        });
      }
    },
    [globalStoryStyles, isText, globalColors, updateStory]
  );

  const options = [
    {
      id: LOCAL,
      name: __('Current colors', 'web-stories'),
    },
    {
      id: GLOBAL,
      name: __('Global colors', 'web-stories'),
    },
  ];

  return (
    <ActionsWrapper>
      <HeaderRow>
        <DropDownWrapper>
          <AdvancedDropDown
            options={options}
            displayInContent={true}
            hasSearch={false}
            onChange={({ id }) => setShowLocalColors(id === LOCAL)}
            selectedId={showLocalColors ? LOCAL : GLOBAL}
          />
        </DropDownWrapper>
        <ButtonWrapper>
          <AddColorPreset onClick={() => handleAddColorPreset(color)}>
            <Add />
          </AddColorPreset>
        </ButtonWrapper>
      </HeaderRow>
      <div>
        <ColorGroup
          isEditMode={false}
          isLocal={showLocalColors}
          colors={showLocalColors ? localColors : globalColors}
          handleClick={applyStyle}
          displayAdd={false}
        />
      </div>
    </ActionsWrapper>
  );
}

ColorPresetActions.propTypes = {
  color: PatternPropType,
  pushUpdate: PropTypes.func,
};

export default ColorPresetActions;
