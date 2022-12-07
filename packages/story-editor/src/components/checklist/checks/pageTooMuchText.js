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
import { List, THEME_CONSTANTS } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import { useStory } from '../../../app/story';
import { useHighlights } from '../../../app/highlights';
import { DESIGN_COPY, MAX_PAGE_CHARACTER_COUNT } from '../constants';
import { Thumbnail, THUMBNAIL_TYPES } from '../../thumbnail';
import {
  ChecklistCard,
  CARD_TYPE,
  ChecklistCardStyles,
} from '../../checklistCard';
import {
  characterCountForPage,
  filterStoryPages,
  ThumbnailPagePreview,
} from '../utils';
import { useRegisterCheck } from '../countContext';
import { useIsChecklistMounted } from '../popupMountedContext';

/**
 * @typedef {import('@googleforcreators/elements').Page} Page
 */

/**
 * Check page for too much text
 *
 * @param {Page} page The page being checked for guidelines
 * @return {boolean} returns true if page has more text than MAX_PAGE_CHARACTER_COUNT
 */
export function pageTooMuchText(page) {
  return characterCountForPage(page) > MAX_PAGE_CHARACTER_COUNT;
}

const PageTooMuchText = () => {
  const isChecklistMounted = useIsChecklistMounted();
  const pages = useStory(({ state }) => state?.pages);
  const failingPages = useMemo(
    () => filterStoryPages(pages, pageTooMuchText),
    [pages]
  );
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);
  const handleClick = useCallback(
    ({ pageId, elements }) =>
      setHighlights({
        pageId,
        elements,
      }),
    [setHighlights]
  );

  const { footer, title } = DESIGN_COPY.tooMuchPageText;

  const isRendered = failingPages.length > 0;
  useRegisterCheck('PageTooMuchText', isRendered);

  const thumbnails = failingPages.map((page) => (
    <Thumbnail
      key={page.id}
      onClick={() =>
        handleClick({
          pageId: page.id,
          elements: page.elements.filter(({ type }) => type === 'text'),
        })
      }
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
        footer={
          <ChecklistCardStyles.CardListWrapper>
            <List size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
              {footer}
            </List>
          </ChecklistCardStyles.CardListWrapper>
        }
        thumbnails={thumbnails}
      />
    )
  );
};

export default PageTooMuchText;
