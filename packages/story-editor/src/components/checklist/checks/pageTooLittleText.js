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
import { __ } from '@web-stories-wp/i18n';
import { useCallback, useMemo } from 'react';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app/story';
import { useHighlights } from '../../../app/highlights';
import { DESIGN_COPY, MIN_STORY_CHARACTER_COUNT } from '../constants';
import {
  Thumbnail,
  THUMBNAIL_TYPES,
  THUMBNAIL_DIMENSIONS,
} from '../../thumbnail';
import PagePreview from '../../carousel/pagepreview';
import {
  ChecklistCard,
  CARD_TYPE,
  DefaultFooterText,
} from '../../checklistCard';
import {
  characterCountForPage,
  filterStoryPages,
  getVisibleThumbnails,
} from '../utils';
import { useRegisterCheck } from '../countContext';

export function pageTooLittleText(page) {
  return characterCountForPage(page) < MIN_STORY_CHARACTER_COUNT;
}

const PageTooLittleText = () => {
  const pages = useStory(({ state }) => state?.pages);
  const failingPages = useMemo(
    () => filterStoryPages(pages, pageTooLittleText),
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
  const { footer, title } = DESIGN_COPY.tooLittlePageText;
  const isRendered = failingPages.length > 0;
  useRegisterCheck('PageTooLittleText', isRendered);

  return (
    isRendered && (
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
            {getVisibleThumbnails(failingPages).map((page) => (
              <Thumbnail
                key={page.id}
                onClick={() => handleClick(page.id)}
                type={THUMBNAIL_TYPES.PAGE}
                displayBackground={
                  <PagePreview
                    page={page}
                    width={THUMBNAIL_DIMENSIONS.WIDTH}
                    height={THUMBNAIL_DIMENSIONS.HEIGHT}
                    as="div"
                  />
                }
                aria-label={__('Go to offending page', 'web-stories')}
              />
            ))}
          </>
        }
      />
    )
  );
};

export default PageTooLittleText;
