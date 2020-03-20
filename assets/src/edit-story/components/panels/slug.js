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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Row, TextInput, HelperText } from '../form';
import { useStory } from '../../app/story';
import { SimplePanel } from './panel';

// @todo Use theme instead of color directly.
const Permalink = styled.a`
  color: #4285f4;
`;

const BoxedTextInput = styled(TextInput)`
  padding: 6px 6px;
  border-radius: 4px;
  flex-grow: 1;
  &:focus {
    background-color: #fff;
  }
`;

function SlugPanel() {
  const {
    state: {
      story: { slug, link },
    },
    actions: { updateStory },
  } = useStory();
  const handleChangeValue = useCallback(
    (prop) => (value) => updateStory({ properties: { [prop]: value } }),
    [updateStory]
  );
  return (
    <SimplePanel name="permalink" title={__('Permalink', 'web-stories')}>
      <Row>
        <BoxedTextInput
          label={__('URL Slug', 'web-stories')}
          value={slug}
          onChange={handleChangeValue('slug')}
          placeholder={__('Enter slug', 'web-stories')}
        />
      </Row>
      <HelperText>
        <Permalink rel="noopener noreferrer" target="_blank" href={link}>
          {link}
        </Permalink>
      </HelperText>
    </SimplePanel>
  );
}

export default SlugPanel;
