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
import { Row, TextInput, HelperText } from '../../form';
import { useStory } from '../../../app/story';
import { SimplePanel } from '../../panels/panel';
import cleanForSlug from '../../../utils/cleanForSlug';

const Permalink = styled.a`
  color: ${({ theme }) => theme.colors.link};
`;

const BoxedTextInput = styled(TextInput)`
  padding: 6px 6px;
  border-radius: 4px;
  flex-grow: 1;
  &:focus {
    background-color: ${({ theme }) => theme.colors.fg.v1};
  }
`;

function SlugPanel() {
  const { slug, link, permalinkConfig, updateStory } = useStory(
    ({
      state: {
        story: { slug, link, permalinkConfig },
      },
      actions: { updateStory },
    }) => ({ slug, link, permalinkConfig, updateStory })
  );
  const handleChangeValue = useCallback(
    (value) => {
      updateStory({
        properties: { slug: cleanForSlug(value) },
      });
    },
    [updateStory]
  );

  const displayLink =
    slug && permalinkConfig
      ? permalinkConfig.prefix + slug + permalinkConfig.suffix
      : link;
  return (
    <SimplePanel name="permalink" title={__('Permalink', 'web-stories')}>
      <Row>
        <BoxedTextInput
          label={__('URL Slug', 'web-stories')}
          value={slug}
          onChange={handleChangeValue}
          placeholder={__('Enter slug', 'web-stories')}
          aria-label={__('Edit: URL slug', 'web-stories')}
        />
      </Row>
      <HelperText>
        <Permalink rel="noopener noreferrer" target="_blank" href={link}>
          {displayLink}
        </Permalink>
      </HelperText>
    </SimplePanel>
  );
}

export default SlugPanel;
