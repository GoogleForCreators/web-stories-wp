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
import PropTypes from 'prop-types';
import { __, TranslateWithMarkup } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */

import { ScrollBarStyles } from '../../../../library/common/scrollbarStyles';
import { Add } from '../../../../../../design-system/icons';
import { useStory } from '../../../../../app/story';
import { PatternPropType } from '../../../../../types';
import { findMatchingColor } from '../utils';
import { AdvancedDropDown } from '../../../../form';
import { SAVED_COLOR_SIZE } from '../../../../../constants';
import ColorGroup from './colorGroup';
import useApplyColor from './useApplyColor';

const LOCAL = 'local';
const GLOBAL = 'global';
const COLOR_GAP = 6;

const ActionsWrapper = styled.div`
  text-align: center;
  border-top: 1px solid ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.v6};
  padding: 12px 12px 20px 12px;
`;

const AddColorPreset = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.secondary};
  cursor: pointer;
  padding: 8px 0px;
  line-height: 20px;
  svg {
    width: 16px;
    height: 16px;
  }
`;

const CtaWrapper = styled.div`
  font-size: 14px;
  line-height: 30px;
  margin-right: 5px;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.tertiary};

  svg {
    color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};
    width: 20px;
    height: 14px;
  }
`;

const ColorsWrapper = styled.div`
  margin-top: 10px;
  max-height: ${SAVED_COLOR_SIZE * 3 + 2 * COLOR_GAP}px;
  overflow-x: hidden;
  overflow-y: auto;

  ${ScrollBarStyles}
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

  const applyStyle = useApplyColor({ pushUpdate });

  // @todo This will change with the missing multi-selection handling.
  const isText =
    selectedElements.length > 0 &&
    selectedElements.every(({ type }) => 'text' === type);

  const handleAddColorPreset = useCallback(
    (toAdd) => {
      if (toAdd) {
        // If match found, don't add.
        const currentStyles = showLocalColors
          ? currentStoryStyles
          : globalStoryStyles;
        if (findMatchingColor(toAdd, currentStyles, isText)) {
          return;
        }
        const newProps = showLocalColors
          ? {
              currentStoryStyles: {
                ...currentStoryStyles,
                colors: [...localColors, toAdd],
              },
            }
          : {
              globalStoryStyles: {
                ...globalStoryStyles,
                colors: [...globalColors, toAdd],
              },
            };
        updateStory({
          properties: newProps,
        });
      }
    },
    [
      currentStoryStyles,
      globalStoryStyles,
      localColors,
      showLocalColors,
      isText,
      globalColors,
      updateStory,
    ]
  );

  const options = [
    {
      id: LOCAL,
      name: __('Current story', 'web-stories'),
    },
    {
      id: GLOBAL,
      name: __('All stories', 'web-stories'),
    },
  ];

  const savedColors = showLocalColors ? localColors : globalColors;
  return (
    <ActionsWrapper>
      <HeaderRow>
        <DropDownWrapper>
          <AdvancedDropDown
            options={options}
            isInline={true}
            hasSearch={false}
            onChange={({ id }) => setShowLocalColors(id === LOCAL)}
            selectedId={showLocalColors ? LOCAL : GLOBAL}
            aria-label={__('Select color type', 'web-stories')}
          />
        </DropDownWrapper>
        <ButtonWrapper>
          <AddColorPreset
            aria-label={__('Add color', 'web-stories')}
            onClick={() => handleAddColorPreset(color)}
          >
            <Add />
          </AddColorPreset>
        </ButtonWrapper>
      </HeaderRow>
      <ColorsWrapper hasColors={savedColors.length > 0}>
        {savedColors.length > 0 && (
          <ColorGroup
            isEditMode={false}
            isLocal={showLocalColors}
            colors={savedColors}
            handleClick={applyStyle}
            displayAdd={false}
            colorGap={COLOR_GAP}
          />
        )}
        {!savedColors.length && (
          <CtaWrapper>
            <TranslateWithMarkup
              mapping={{
                i: <Add />,
              }}
            >
              {__('Click <i></i> to save a color', 'web-stories')}
            </TranslateWithMarkup>
          </CtaWrapper>
        )}
      </ColorsWrapper>
    </ActionsWrapper>
  );
}

ColorPresetActions.propTypes = {
  color: PatternPropType,
  pushUpdate: PropTypes.func,
};

export default ColorPresetActions;
