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
import { ACCESSIBILITY_COPY } from '../constants';
import {
  CARD_TYPE,
  ChecklistCard,
  DefaultFooterText,
} from '../../checklistCard';
import { LayerThumbnail, Thumbnail, THUMBNAIL_TYPES } from '../../thumbnail';
import { filterStoryElements } from '../utils';
import { useRegisterCheck } from '../countContext';
import { useIsChecklistMounted } from '../popupMountedContext';

const LINK_TAPPABLE_REGION_MIN_WIDTH = 48;
const LINK_TAPPABLE_REGION_MIN_HEIGHT = 48;

export function elementLinkTappableRegionTooSmall(element) {
  if (
    !['text', 'image', 'shape', 'gif', 'video'].includes(element.type) ||
    !element.link?.url?.length
  ) {
    return false;
  }

  return (
    element.width < LINK_TAPPABLE_REGION_MIN_WIDTH ||
    element.height < LINK_TAPPABLE_REGION_MIN_HEIGHT
  );
}

const ElementLinkTappableRegionTooSmall = () => {
  const isChecklistMounted = useIsChecklistMounted();
  const pages = useStory(({ state }) => state?.pages);
  const elements = useMemo(
    () => filterStoryElements(pages, elementLinkTappableRegionTooSmall),
    [pages]
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

  const thumbnails = elements.map((element) => (
    <Thumbnail
      key={element.id}
      onClick={() => handleClick(element.id, element.pageId)}
      type={THUMBNAIL_TYPES.TEXT}
      displayBackground={<LayerThumbnail page={element} />}
      aria-label={__('Go to offending link', 'web-stories')}
    />
  ));

  const isRendered = elements.length > 0;
  useRegisterCheck('ElementLinkTappableRegionTooSmall', isRendered);

  const { title, footer } = ACCESSIBILITY_COPY.linkTappableRegionTooSmall;
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
        thumbnails={thumbnails}
      />
    )
  );
};

export default ElementLinkTappableRegionTooSmall;
