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
import { useCallback, useMemo } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { useHighlights } from '../../../app/highlights';
import { DESIGN_COPY, MAX_LINKS_PER_PAGE } from '../constants';
import {
  CARD_TYPE,
  ChecklistCard,
  DefaultFooterText,
} from '../../checklistCard';
import { Thumbnail, THUMBNAIL_TYPES } from '../../thumbnail';
import { filterStoryPages, ThumbnailPagePreview } from '../utils';
import { useRegisterCheck } from '../countContext';
import { useIsChecklistMounted } from '../popupMountedContext';

export function pageTooManyLinks(page) {
  const elementsWithLinks = page.elements.filter((element) => {
    return Boolean(element.link?.url?.length);
  });

  return elementsWithLinks.length > MAX_LINKS_PER_PAGE;
}

const PageTooManyLinks = () => {
  const isChecklistMounted = useIsChecklistMounted();
  const pages = useStory(({ state }) => state?.pages);
  const failingPages = useMemo(
    () => filterStoryPages(pages, pageTooManyLinks),
    [pages]
  );
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);
  const handleClick = useCallback(
    (pageId) =>
      setHighlights({
        pageId,
      }),
    [setHighlights]
  );

  const { footer, title } = DESIGN_COPY.tooManyLinksOnPage;

  const isRendered = failingPages.length > 0;
  useRegisterCheck('PageTooManyLinks', isRendered);

  const thumbnails = failingPages.map((page) => (
    <Thumbnail
      key={page.id}
      onClick={() => handleClick(page.id)}
      type={THUMBNAIL_TYPES.PAGE}
      displayBackground={<ThumbnailPagePreview page={page} />}
      aria-label={__('Go to offending page', 'web-stories')}
    />
  ));

  return (
    isRendered &&
    isChecklistMounted && (
      <ChecklistCard
        title={title}
        cardType={
          failingPages.length > 1
            ? CARD_TYPE.MULTIPLE_ISSUE
            : CARD_TYPE.SINGLE_ISSUE
        }
        footer={<DefaultFooterText>{footer}</DefaultFooterText>}
        thumbnails={thumbnails}
      />
    )
  );
};

export default PageTooManyLinks;
