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
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import cleanForSlug from '../../../../utils/cleanForSlug';
import inRange from '../../../../utils/inRange';
import { Row } from '../../../form';
import { SimplePanel } from '../../panel';
import { Input, Link, THEME_CONSTANTS } from '../../../../../design-system';

export const MIN_MAX = {
  PERMALINK: {
    MIN: 1,
    MAX: 200,
  },
};

const StyledRow = styled(Row)`
  margin-bottom: 12px;
`;

const LinkContainer = styled.div`
  margin-bottom: 16px;
`;

function SlugPanel() {
  const { slug: savedSlug, link, permalinkConfig, updateStory } = useStory(
    ({
      state: {
        story: { slug = '', link, permalinkConfig },
      },
      actions: { updateStory },
    }) => ({ slug, link, permalinkConfig, updateStory })
  );
  const [slug, setSlug] = useState(savedSlug);

  useEffect(() => {
    setSlug(slug);
  }, [slug]);

  const updateSlug = useCallback(
    (value, isEditing) => {
      const newSlug = value.slice(0, MIN_MAX.PERMALINK.MAX);

      updateStory({
        properties: { slug: cleanForSlug(newSlug, isEditing) },
      });
    },
    [updateStory]
  );

  const handleChange = useCallback((evt) => setSlug(evt.target.value), []);

  const handleBlur = useCallback((evt) => updateSlug(evt.target.value, false), [
    updateSlug,
  ]);

  const displayLink =
    slug && permalinkConfig && inRange(slug.length, MIN_MAX.PERMALINK)
      ? permalinkConfig.prefix + slug + permalinkConfig.suffix
      : link;

  return (
    <SimplePanel
      name="permalink"
      title={__('Permalink', 'web-stories')}
      collapsedByDefault={false}
    >
      <StyledRow>
        <Input
          value={savedSlug}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={__('Enter slug', 'web-stories')}
          aria-label={__('URL slug', 'web-stories')}
          minLength={MIN_MAX.PERMALINK.MIN}
          maxLength={MIN_MAX.PERMALINK.MAX}
        />
      </StyledRow>
      <LinkContainer>
        <Link
          rel="noopener noreferrer"
          target="_blank"
          href={link}
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
        >
          {displayLink}
        </Link>
      </LinkContainer>
    </SimplePanel>
  );
}

export default SlugPanel;
