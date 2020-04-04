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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { PAGE_WIDTH, BACKGROUND_TEXT_MODE } from '../../../../constants';
import createSolid from '../../../../utils/createSolid';
import { dataFontEm } from '../../../../units';
import { Section, MainButton, SearchInput } from '../../common';
import { FontPreview } from '../../text';
import useLibrary from '../../useLibrary';
import { Pane } from '../shared';
import paneId from './paneId';

// By default, the element should be 50% of the page.
const DEFAULT_ELEMENT_WIDTH = PAGE_WIDTH / 2;

const PRESETS = [
  {
    id: 'heading',
    title: __('Heading', 'web-stories'),
    content: __('Heading', 'web-stories'),
    fontSize: dataFontEm(2),
    fontWeight: 700,
    fontFamily: 'Open Sans',
  },
  {
    id: 'subheading',
    title: __('Subheading', 'web-stories'),
    content: __('Subheading', 'web-stories'),
    fontSize: dataFontEm(1.5),
    fontWeight: 600,
    fontFamily: 'Open Sans',
  },
  {
    id: 'body-text',
    title: __('Body text', 'web-stories'),
    content: __(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'web-stories'
    ),
    fontSize: dataFontEm(1.1),
    fontWeight: 400,
    fontFamily: 'Roboto',
  },
];

function getPresetById(id) {
  for (let i = 0; i < PRESETS.length; i++) {
    if (PRESETS[i].id === id) {
      return PRESETS[i];
    }
  }
  return null;
}

function TextPane(props) {
  const {
    actions: { insertElement },
  } = useLibrary();
  return (
    <Pane id={paneId} {...props}>
      <SearchInput
        value={''}
        placeholder={__('Search', 'web-stories')}
        onChange={() => {}}
      />

      <Section
        title={__('Presets', 'web-stories')}
        titleTools={
          <MainButton
            onClick={() =>
              insertElement('text', {
                ...getPresetById('subheading'),
                content: __('Fill in some text', 'web-stories'),
                color: createSolid(0, 0, 0),
                backgroundColor: createSolid(196, 196, 196),
                backgroundTextMode: BACKGROUND_TEXT_MODE.NONE,
                width: DEFAULT_ELEMENT_WIDTH,
              })
            }
          >
            {__('Add new text', 'web-stories')}
          </MainButton>
        }
      >
        {PRESETS.map((preset) => (
          <FontPreview
            key={`preset-${preset.id}`}
            {...preset}
            onClick={() =>
              insertElement('text', {
                ...preset,
                color: createSolid(0, 0, 0),
                backgroundColor: createSolid(196, 196, 196),
                backgroundTextMode: BACKGROUND_TEXT_MODE.NONE,
                width: DEFAULT_ELEMENT_WIDTH,
              })
            }
          />
        ))}
      </Section>
      <Section title={__('Text Sets', 'web-stories')} />
    </Pane>
  );
}

export default TextPane;
