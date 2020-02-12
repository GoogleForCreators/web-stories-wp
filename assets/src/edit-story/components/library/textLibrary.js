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
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { fontSizeFromData } from '../../units/dimensions';
import { Section, MainButton, Title, SearchInput, Header } from './common';
import { FontPreview } from './text';

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

function TextLibrary({ onInsert }) {
  return (
    <>
      <Header>
        <Title>{__('Text', 'web-stories')}</Title>
        <MainButton
          onClick={() =>
            onInsert('text', {
              content: 'Text',
              color: 'black',
              width: 50,
              height: 20,
              x: 5,
              y: 5,
              rotationAngle: 0,
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
              onInsert('text', {
                content: __('Text', 'web-stories'),
                color: 'black',
                width: 50,
                height: 20,
                x: 5,
                y: 5,
                rotationAngle: 0,
                ...preset,
                fontSize: fontSizeFromData(preset.fontSize),
              })
            }
          />
        ))}
      </Section>
      <Section title={__('Text Sets', 'web-stories')} />
    </>
  );
}

TextLibrary.propTypes = {
  onInsert: PropTypes.func.isRequired,
};

export default TextLibrary;
