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
import { useCallback, useEffect, useState } from '@googleforcreators/react';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import {
  Input,
  Link,
  ThemeGlobals,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import cleanForSlug from '../../../../utils/cleanForSlug';
import inRange from '../../../../utils/inRange';
import { Row } from '../../../form';
import { SimplePanel } from '../../panel';
import { inputContainerStyleOverride } from '../../shared';

export const MIN_MAX = {
  PERMALINK: {
    MIN: 1,
    MAX: 200,
  },
};

const PermalinkRow = styled(Row)`
  margin-bottom: 12px;

  input {
    color: ${({ theme }) => theme.colors.fg.tertiary};

    :active,
    :focus,
    .${ThemeGlobals.FOCUS_VISIBLE_SELECTOR} {
      color: ${({ theme }) => theme.colors.fg.primary};
    }
  }
`;

const LinkContainer = styled.div`
  margin-bottom: 16px;
`;

function SlugPanel({ nameOverride }) {
  const {
    slug: savedSlug,
    link,
    permalinkConfig,
    updateStory,
  } = useStory(
    ({
      state: {
        story: { slug = '', link, permalinkConfig },
      },
      actions: { updateStory },
    }) => ({ slug, link, permalinkConfig, updateStory })
  );
  const [slug, setSlug] = useState(savedSlug);

  useEffect(() => {
    /* Update shown slug when slug updates externally */
    setSlug(savedSlug);
  }, [savedSlug]);

  const updateSlug = useCallback(
    (value) => {
      const newSlug = value.slice(0, MIN_MAX.PERMALINK.MAX);

      updateStory({
        properties: { slug: cleanForSlug(newSlug) },
      });
    },
    [updateStory]
  );

  const handleChange = useCallback(
    (evt) => setSlug(cleanForSlug(evt.target.value, true)),
    []
  );

  const handleBlur = useCallback(
    (evt) => updateSlug(evt.target.value),
    [updateSlug]
  );

  const displayLink =
    slug && permalinkConfig && inRange(slug.length, MIN_MAX.PERMALINK)
      ? permalinkConfig.prefix + slug + permalinkConfig.suffix
      : link;

  // In case of non-pretty permalinks, we're not showing the input.
  return (
    <SimplePanel
      name={nameOverride || 'permalink'}
      title={__('Permalink', 'web-stories')}
      collapsedByDefault={false}
    >
      {permalinkConfig && (
        <PermalinkRow>
          <Input
            value={String(slug)}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={__('Enter slug', 'web-stories')}
            aria-label={__('URL slug', 'web-stories')}
            minLength={MIN_MAX.PERMALINK.MIN}
            maxLength={MIN_MAX.PERMALINK.MAX}
            containerStyleOverride={inputContainerStyleOverride}
          />
        </PermalinkRow>
      )}
      <LinkContainer>
        <Link
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

SlugPanel.propTypes = {
  nameOverride: PropTypes.string,
};
