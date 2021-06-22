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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { useHighlights } from '../../../app/highlights';
import { DESIGN_COPY } from '../../../app/prepublish/newConstants';
import {
  CARD_TYPE,
  ChecklistCard,
  DefaultFooterText,
} from '../../checklistCard';
import { filterStoryPages } from '../utils';
import {
  Thumbnail,
  THUMBNAIL_TYPES,
  THUMBNAIL_DIMENSIONS,
} from '../../thumbnail';
import PagePreview from '../../carousel/pagepreview';

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
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);

  const { footer, title } = DESIGN_COPY.tooManyLinksOnPage;

  return (
    failingPages.length > 0 && (
      <ChecklistCard
        title={title}
        cardType={
          failingPages.length > 1
            ? CARD_TYPE.MULTIPLE_ISSUE
            : CARD_TYPE.SINGLE_ISSUE
        }
        footer={<DefaultFooterText>{footer}</DefaultFooterText>}
        thumbnailCount={failingPages.length}
        thumbnail={
          <>
            {failingPages.map((page) => (
              <Thumbnail
                key={page.id}
                onClick={() => {
                  setHighlights({
                    pageId: page.id,
                  });
                }}
                type={THUMBNAIL_TYPES.PAGE}
                displayBackground={
                  <PagePreview
                    page={page}
                    width={THUMBNAIL_DIMENSIONS.WIDTH}
                    height={THUMBNAIL_DIMENSIONS.HEIGHT}
                    as="div"
                  />
                }
                aria-label={__(
                  'Preview of page with checklist issue',
                  'web-stories'
                )}
              />
            ))}
          </>
        }
      />
    )
  );
};

export default PageTooManyLinks;
