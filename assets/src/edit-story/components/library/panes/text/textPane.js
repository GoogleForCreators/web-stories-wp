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
import { PAGE_WIDTH } from '../../../../constants';
import createSolid from '../../../../utils/createSolid';
import { dataFontEm } from '../../../../units';
import { Section, MainButton, Title, SearchInput, Header } from '../../common';
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
    fontSize: dataFontEm(3),
    fontWeight: 800,
    fontFamily: 'Ubuntu',
  },
  {
    id: 'subheading',
    title: __('Subheading', 'web-stories'),
    fontSize: dataFontEm(2),
    fontWeight: 500,
    fontFamily: 'Ubuntu',
  },
  {
    id: 'body-text',
    title: __('Body text', 'web-stories'),
    fontSize: dataFontEm(1),
    fontWeight: 'normal',
    fontFamily: 'Ubuntu',
  },
];

function TextPane(props) {
  const {
    actions: { insertElement },
  } = useLibrary();
  return (
    <Pane id={paneId} {...props}>
      <Header>
        <Title>{__('Text', 'web-stories')}</Title>
        <MainButton
          onClick={() =>
            insertElement('text', {
              content: __('Text', 'web-stories'),
              color: createSolid(0, 0, 0),
              width: DEFAULT_ELEMENT_WIDTH,
            })
          }
        >
          {__('Add Text', 'web-stories')}
        </MainButton>
      </Header>
      <SearchInput
        value={''}
        placeholder={__('Search text...', 'web-stories')}
        onChange={() => {}}
      />
      <Section title={__('Presets', 'web-stories')}>
        {PRESETS.map((preset) => (
          <FontPreview
            key={`preset-${preset.id}`}
            {...preset}
            onClick={() =>
              insertElement('text', {
                content: __('Text', 'web-stories'),
                color: createSolid(0, 0, 0),
                width: DEFAULT_ELEMENT_WIDTH,
                ...preset,
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
