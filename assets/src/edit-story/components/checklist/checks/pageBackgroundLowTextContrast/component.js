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
import { useCallback, useEffect, useState } from 'react';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useLayout, useStory } from '../../../../app';
import { useHighlights } from '../../../../app/highlights';
import PagePreview from '../../../carousel/pagepreview';
import {
  CARD_TYPE,
  ChecklistCard,
  DefaultFooterText,
} from '../../../checklistCard';
import {
  Thumbnail,
  THUMBNAIL_DIMENSIONS,
  THUMBNAIL_TYPES,
} from '../../../thumbnail';
import { getVisibleThumbnails } from '../../utils';
import { ACCESSIBILITY_COPY } from '../../constants';
import { pageBackgroundTextLowContrast } from './check';

const PageBackgroundTextLowContrast = () => {
  const [failingPages, setFailingPages] = useState([]);
  const story = useStory(({ state }) => state);
  const pageSize = useLayout(({ state: { pageWidth, pageHeight } }) => ({
    width: pageWidth,
    height: pageHeight,
  }));

  const getFailingPages = useCallback(async () => {
    const promises = [];
    story?.pages.forEach((page) => {
      const maybeTextContrastResult = pageBackgroundTextLowContrast({
        ...page,
        pageSize,
      });
      if (maybeTextContrastResult instanceof Promise) {
        promises.push(
          maybeTextContrastResult.then((result) => ({ result, page }))
        );
      } else {
        promises.push(maybeTextContrastResult);
      }
    });
    const awaitedResult = await Promise.all(promises);
    return awaitedResult.filter(({ result }) => result).map(({ page }) => page);
  }, [story, pageSize]);

  useEffect(() => {
    getFailingPages().then((failures) => {
      setFailingPages(failures);
    });
  }, [getFailingPages, story]);

  useEffect(() => {}, [story]);
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);
  const handleClick = useCallback(
    (pageId) =>
      setHighlights({
        pageId,
      }),
    [setHighlights]
  );

  const { title, footer } = ACCESSIBILITY_COPY.lowContrast;

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

export default PageBackgroundTextLowContrast;
