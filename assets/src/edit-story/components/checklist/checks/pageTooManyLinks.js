/*
 * Copyright 2021 Google LLC
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
import { useMemo } from 'react';
import { __, sprintf } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { ChecklistCard } from '../../checklistCard';
import { filterStoryPages } from '../utils';
import { Text, THEME_CONSTANTS } from '../../../../design-system';

const MAX_LINKS_PER_PAGE = 3;

export function pageTooManyLinks(page) {
  const elementsWithLinks = page.elements.filter((element) => {
    return Boolean(element.link?.url?.length);
  });

  return elementsWithLinks.length > MAX_LINKS_PER_PAGE;
}

const PageTooManyLinks = () => {
  const story = useStory(({ state }) => state);
  const failingPages = useMemo(
    () => filterStoryPages(story, pageTooManyLinks),
    [story]
  );
  return (
    failingPages.length > 0 && (
      <ChecklistCard
        title={sprintf(
          /* translators: %s: maximum number of links per page. */
          __('Avoid including more than %s links per page', 'web-stories'),
          MAX_LINKS_PER_PAGE
        )}
        footer={
          <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
            {sprintf(
              /* translators: %s: maximum number of links per page. */
              __('Avoid having more than %s links on one page', 'web-stories'),
              MAX_LINKS_PER_PAGE
            )}
            {
              //       <Link
              //         href={'#' /* figure out what this links to */}
              //         size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
              //       >
              //         {'Learn more'}
              //       </Link>
            }
          </Text>
        }
        /*
         todo thumbnails for pages
         thumbnailCount={failingPages.length}
         thumbnail={<>
             {failingPages.map(() => <Thumbnail onClick={ perform highlight here }  />)}
           </>}
       */
      />
    )
  );
};

export default PageTooManyLinks;
