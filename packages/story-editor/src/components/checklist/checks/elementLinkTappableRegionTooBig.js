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
import { useCallback, useMemo } from '@web-stories-wp/react';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useLayout, useStory } from '../../../app';
import { useHighlights } from '../../../app/highlights';
import { ACCESSIBILITY_COPY } from '../constants';
import {
  CARD_TYPE,
  ChecklistCard,
  DefaultFooterText,
} from '../../checklistCard';
import { LayerThumbnail, Thumbnail, THUMBNAIL_TYPES } from '../../thumbnail';
import { filterStoryElements, getVisibleThumbnails } from '../utils';
import { useRegisterCheck } from '../countContext';
import { useIsChecklistMounted } from '../popupMountedContext';

const MAX_LINK_SCREEN_PERCENT = 80;

export function isElementLinkTappableRegionTooBig(element, pageSize) {
  if (
    !['text', 'image', 'shape', 'gif', 'video'].includes(element.type) ||
    !element.link?.url?.length
  ) {
    return false;
  }

  const elementArea = element.width * element.height;
  const canvasArea = pageSize.width * pageSize.height;
  return (elementArea / canvasArea) * 100 > MAX_LINK_SCREEN_PERCENT;
}

const ElementLinkTappableRegionTooBig = () => {
  const isChecklistMounted = useIsChecklistMounted();
  const pages = useStory(({ state }) => state?.pages);
  const pageSize = useLayout(({ state: { pageWidth, pageHeight } }) => ({
    width: pageWidth,
    height: pageHeight,
  }));

  const elements = useMemo(
    () =>
      pageSize.height > 0 &&
      filterStoryElements(pages, (element) =>
        isElementLinkTappableRegionTooBig(element, pageSize)
      ),
    [pages, pageSize]
  );
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);
  const handleClick = useCallback(
    (elementId, pageId) =>
      setHighlights({
        elementId,
        pageId,
      }),
    [setHighlights]
  );

  const isRendered = elements.length > 0;
  useRegisterCheck('ElementLinkTappableRegionTooBig', isRendered);

  const { title, footer } = ACCESSIBILITY_COPY.linkTappableRegionTooBig;
  return (
    isRendered &&
    isChecklistMounted && (
      <ChecklistCard
        title={title}
        cardType={
          elements.length > 1
            ? CARD_TYPE.MULTIPLE_ISSUE
            : CARD_TYPE.SINGLE_ISSUE
        }
        footer={<DefaultFooterText>{footer}</DefaultFooterText>}
        thumbnailCount={elements.length}
        thumbnail={
          <>
            {getVisibleThumbnails(elements).map((element) => (
              <Thumbnail
                key={element.id}
                onClick={() => handleClick(element.id, element.pageId)}
                type={THUMBNAIL_TYPES.TEXT}
                displayBackground={<LayerThumbnail page={element} />}
                aria-label={__('Go to offending link', 'web-stories')}
              />
            ))}
          </>
        }
      />
    )
  );
};

export default ElementLinkTappableRegionTooBig;
