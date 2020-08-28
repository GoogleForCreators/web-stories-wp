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
import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useFeatures } from 'flagged';
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { UnitsProvider } from '../../../../units';
import { PAGE_HEIGHT, PAGE_WIDTH } from '../../../../constants';
import DisplayElement from '../../../canvas/displayElement';
import { Section, MainButton, SearchInput } from '../../common';
import { FontPreview } from '../../text';
import useLibrary from '../../useLibrary';
import { Pane } from '../shared';
import paneId from './paneId';
import { PRESETS, DEFAULT_PRESET } from './textPresets';
import useInsertPreset from './useInsertPreset';
import loadTextSets from './textSets';

const ITEM_SIZE = 150;

// TODO: max-height should be dynamically calculated
// based on height of window.
const TextSetContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 12px;
  overflow: auto;
  max-height: 280px;
`;

const TextSetItem = styled.div`
  position: relative;
  width: ${ITEM_SIZE}px;
  height: ${ITEM_SIZE}px;
  background-color: ${({ theme }) => rgba(theme.colors.bg.white, 0.07)};
  border-radius: 4px;
  cursor: pointer;
`;

const TYPE = 'text';

function TextPane(props) {
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  const { showTextSets, showTextAndShapesSearchInput } = useFeatures();
  const [textSets, setTextSets] = useState([]);

  useEffect(() => {
    if (showTextSets) {
      loadTextSets().then((sets) => setTextSets(sets));
    }
  }, [showTextSets]);

  const insertElements = useCallback(
    (elements) => {
      elements.forEach((e) => insertElement(e.type, e));
    },
    [insertElement]
  );

  const insertPreset = useInsertPreset();

  return (
    <Pane id={paneId} {...props}>
      {showTextAndShapesSearchInput && (
        <SearchInput
          initialValue={''}
          placeholder={__('Search', 'web-stories')}
          onSearch={() => {}}
          disabled
        />
      )}

      <Section
        title={__('Presets', 'web-stories')}
        titleTools={
          <MainButton onClick={() => insertElement(TYPE, DEFAULT_PRESET)}>
            {__('Add new text', 'web-stories')}
          </MainButton>
        }
      >
        {PRESETS.map(({ title, element }, i) => (
          <FontPreview
            key={i}
            title={title}
            element={element}
            onClick={() => insertPreset(element)}
          />
        ))}
      </Section>
      {showTextSets && (
        <Section title={__('Text Sets', 'web-stories')}>
          <TextSetContainer>
            <UnitsProvider
              pageSize={{
                width: ITEM_SIZE,
                height: ITEM_SIZE,
              }}
            >
              {textSets.map((elements, index) => (
                <TextSetItem
                  key={index}
                  style={{ justifySelf: index % 2 === 0 ? 'start' : 'end' }}
                  onClick={() => insertElements(elements)}
                >
                  {elements.map(
                    ({
                      id,
                      content,
                      x,
                      y,
                      textSetWidth,
                      textSetHeight,
                      ...rest
                    }) => (
                      <DisplayElement
                        previewMode
                        key={id}
                        element={{
                          id,
                          content: `<span style="color: #fff">${content}<span>`,
                          x: x + (PAGE_WIDTH - textSetWidth) / 2,
                          y: y + (PAGE_HEIGHT - textSetHeight) / 2,
                          ...rest,
                        }}
                      />
                    )
                  )}
                </TextSetItem>
              ))}
            </UnitsProvider>
          </TextSetContainer>
        </Section>
      )}
    </Pane>
  );
}

export default TextPane;
