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
import {
  useRef,
  useState,
  useResizeEffect,
  useMemo,
  useCallback,
} from '@web-stories-wp/react';
import styled from 'styled-components';
import { useFeatures } from 'flagged';
import { __ } from '@web-stories-wp/i18n';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { Text, THEME_CONSTANTS, Toggle } from '@web-stories-wp/design-system';
import { SearchInput } from '../../common';
import { Container as SectionContainer } from '../../common/section';
import { Pane as SharedPane } from '../shared';
import usePageAsCanvas from '../../../../utils/usePageAsCanvas';
import useLibrary from '../../useLibrary';
import Tooltip from '../../../tooltip';
import FontPreview from './fontPreview';
import paneId from './paneId';
import { PRESETS } from './textPresets';
import useInsertPreset from './useInsertPreset';
import TextSetsPane from './textSets/textSetsPane';

// Relative position needed for Moveable to update its position properly.
const Pane = styled(SharedPane)`
  overflow-y: scroll;
  max-height: 100%;
  position: relative;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const SmartColorToggle = styled.div`
  display: flex;

  label {
    cursor: pointer;
    margin: auto 12px;
    color: ${({ theme }) => theme.colors.fg.secondary};
  }
`;

function TextPane(props) {
  const paneRef = useRef();
  const [, forceUpdate] = useState();

  const { showTextAndShapesSearchInput } = useFeatures();

  const { shouldUseSmartColor, setShouldUseSmartColor } = useLibrary(
    (state) => ({
      shouldUseSmartColor: state.state.shouldUseSmartColor,
      setShouldUseSmartColor: state.actions.setShouldUseSmartColor,
    })
  );

  const { getPosition, insertPreset } = useInsertPreset({
    shouldUseSmartColor,
  });
  const { generateCanvasFromPage } = usePageAsCanvas();

  useResizeEffect(
    paneRef,
    () => {
      forceUpdate(Date.now());
    },
    []
  );

  const handleToggleClick = useCallback(
    () => setShouldUseSmartColor((currentValue) => !currentValue),
    [setShouldUseSmartColor]
  );

  const toggleId = useMemo(() => `toggle_auto_color_${uuidv4()}`, []);
  return (
    <Pane id={paneId} {...props} ref={paneRef}>
      {showTextAndShapesSearchInput && (
        <SearchInput
          initialValue={''}
          placeholder={__('Search', 'web-stories')}
          onSearch={() => {}}
          disabled
        />
      )}
      <SmartColorToggle>
        <Text
          as="label"
          htmlFor={toggleId}
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
        >
          {__('Adaptive text colors', 'web-stories')}
        </Text>
        <Tooltip
          title={__(
            'May impact performance when inserting text',
            'web-stories'
          )}
        >
          <Toggle
            id={toggleId}
            checked={shouldUseSmartColor}
            onChange={handleToggleClick}
          />
        </Tooltip>
      </SmartColorToggle>
      <SectionContainer
        onPointerOver={() => shouldUseSmartColor && generateCanvasFromPage()}
      >
        <GridContainer>
          {PRESETS.map(({ title, element }) => (
            <FontPreview
              key={title}
              title={title}
              element={element}
              insertPreset={insertPreset}
              getPosition={getPosition}
            />
          ))}
        </GridContainer>
      </SectionContainer>
      {paneRef.current && <TextSetsPane paneRef={paneRef} />}
    </Pane>
  );
}

export default TextPane;
