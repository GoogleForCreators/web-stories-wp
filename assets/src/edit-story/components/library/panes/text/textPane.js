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
import styled from 'styled-components';
import { useFeatures } from 'flagged';
import { useRef } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Section, MainButton, SearchInput } from '../../common';
import { FontPreview } from '../../text';
import useLibrary from '../../useLibrary';
import { Pane } from '../shared';
import { dataFontEm } from '../../../../units';
import paneId from './paneId';
import { PRESETS, DEFAULT_PRESET } from './textPresets';

const SectionContent = styled.p``;

// The format is:
// { presetToBeAddedName: [list of previous preset names that need to be considered]
// If the previous preset is not in the list of names, no special rules.
// If the preset being added is not in the rules at all -- no special rules.
// @todo Text staggering to be done as part of https://github.com/google/web-stories-wp/issues/1206
const POSITIONING_RULES = {
  'heading-2': ['heading-1'],
  'heading-3': ['heading-1', 'heading-2'],
  paragraph: ['heading-1', 'heading-2', 'heading-3'],
};

const POSITION_MARGIN = dataFontEm(1);

function TextPane(props) {
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));
  const { showTextSets, showTextAndShapesSearchInput } = useFeatures();

  const lastPreset = useRef(null);

  const getTopPosition = (name, element) => {
    const { y } = element;
    // If we don't have any special rules, just add the default.
    if (
      !POSITIONING_RULES[name] ||
      !lastPreset.current ||
      !POSITIONING_RULES[name].includes(lastPreset.current.name)
    ) {
      return y;
    }
    // Use the positioning of the previous preset + add the previous preset's
    // approximate height + lineHeight if more than 1 + position margin.
    const lineHeightDelta = lastPreset.current.lineHeight - 1;
    const addedLineHeight =
      lineHeightDelta > 0 ? dataFontEm(lineHeightDelta) : 0;
    return (
      lastPreset.current.y +
      lastPreset.current.fontSize +
      addedLineHeight +
      POSITION_MARGIN
    );
  };

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
          <MainButton
            onClick={() => {
              lastPreset.current = null;
              insertElement('text', DEFAULT_PRESET);
            }}
          >
            {__('Add new text', 'web-stories')}
          </MainButton>
        }
      >
        {PRESETS.map(({ title, name, element }, i) => (
          <FontPreview
            key={i}
            title={title}
            element={element}
            onClick={() => {
              const y = getTopPosition(name, element);
              const { fontSize, lineHeight } = element;
              lastPreset.current = {
                name,
                y,
                fontSize,
                lineHeight,
              };
              insertElement('text', {
                ...element,
                y,
              });
            }}
          />
        ))}
      </Section>
      {showTextSets && (
        <Section title={__('Text Sets', 'web-stories')}>
          <SectionContent>{__('Coming soon.', 'web-stories')}</SectionContent>
        </Section>
      )}
    </Pane>
  );
}

export default TextPane;
