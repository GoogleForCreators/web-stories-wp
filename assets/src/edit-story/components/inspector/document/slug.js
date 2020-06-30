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
import Link from '../../link';
import { Row, TextInput, HelperText } from '../../form';
import { useStory } from '../../../app/story';
import { SimplePanel } from '../../panels/panel';
import cleanForSlug from '../../../utils/cleanForSlug';
import inRange from '../../../utils/inRange';

export const MIN_MAX = {
  PERMALINK: {
    MIN: 1,
    MAX: 200,
  },
};

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
      const newSlug = value.slice(0, MIN_MAX.PERMALINK.MAX);

      updateStory({
        properties: { slug: cleanForSlug(newSlug) },
      });
    },
    [updateStory]
  );

  const displayLink =
    slug && permalinkConfig && inRange(slug.length, MIN_MAX.PERMALINK)
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
          minLength={MIN_MAX.PERMALINK.MIN}
          maxLength={MIN_MAX.PERMALINK.MAX}
        />
      </Row>
      <HelperText>
        <Link rel="noopener noreferrer" target="_blank" href={link}>
          {displayLink}
        </Link>
      </HelperText>
    </SimplePanel>
  );
}

export default SlugPanel;
