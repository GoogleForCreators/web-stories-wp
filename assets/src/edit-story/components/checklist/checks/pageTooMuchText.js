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

/**
 * Internal dependencies
 */
import { THEME_CONSTANTS, List } from '../../../../design-system';
import { useHighlights } from '../../../app/highlights';
import { useStory } from '../../../app/story';
import { DESIGN_COPY } from '../../../app/prepublish/newConstants';
import { characterCountForPage, filterStoryPages } from '../utils';
import {
  ChecklistCard,
  FooterText,
  CardListWrapper,
  CARD_TYPE,
  LearnMoreLink,
} from '../../checklistCard';
import {
  Thumbnail,
  THUMBNAIL_TYPES,
  THUMBNAIL_DIMENSIONS,
} from '../../thumbnail';
import PagePreview from '../../carousel/pagepreview';

const MAX_PAGE_CHARACTER_COUNT = 200;

/**
 * @typedef {import('../../../types').Page} Page
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

export function PageTooMuchText() {
  const story = useStory(({ state }) => state);
  const failingPages = useMemo(
    () => filterStoryPages(story, pageTooMuchText),
    [story]
  );
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);
  return failingPages.length > 0 ? (
    <ChecklistCard
      title={DESIGN_COPY.tooMuchPageText.title}
      cardType={
        failingPages.length > 1
          ? CARD_TYPE.MULTIPLE_ISSUE
          : CARD_TYPE.SINGLE_ISSUE
      }
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
              aria-label="my helper text describing this thumbnail image"
            />
          ))}
        </>
      }
      footer={
        <FooterText>
          <CardListWrapper>
            <List size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
              {DESIGN_COPY.tooMuchPageText.footer}
            </List>
            <LearnMoreLink />
          </CardListWrapper>
        </FooterText>
      }
    />
  ) : null;
}
