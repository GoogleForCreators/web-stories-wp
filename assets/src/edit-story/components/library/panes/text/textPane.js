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
import { DEFAULT_EDITOR_PAGE_HEIGHT } from '../../../../constants';
import { editorToDataY } from '../../../../units/dimensions';
import { Section, MainButton, Title, SearchInput, Header } from '../../common';
import { FontPreview } from '../../text';
import useLibrary from '../../useLibrary';
import { Pane } from '../shared';
import paneId from './paneId';

const PRESETS = [
  {
    id: 'heading',
    title: __('Heading', 'web-stories'),
    fontSize: 48,
    fontWeight: 800,
    fontFamily: 'Ubuntu',
  },
  {
    id: 'subheading',
    title: __('Subheading', 'web-stories'),
    fontSize: 32,
    fontWeight: 500,
    fontFamily: 'Ubuntu',
  },
  {
    id: 'body-text',
    title: __('Body text', 'web-stories'),
    fontSize: 16,
    fontWeight: 'normal',
    fontFamily: 'Ubuntu',
  },
];

const DEFAULT_TEXT_TRANSFORM = {
  width: 50,
  height: 20,
  x: 5,
  y: 5,
  rotationAngle: 0,
};

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
              color: { color: { r: 0, g: 0, b: 0 } },
              ...DEFAULT_TEXT_TRANSFORM,
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
                color: { color: { r: 0, g: 0, b: 0 } },
                ...DEFAULT_TEXT_TRANSFORM,
                ...preset,
                fontSize: editorToDataY(
                  preset.fontSize,
                  DEFAULT_EDITOR_PAGE_HEIGHT
                ),
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
