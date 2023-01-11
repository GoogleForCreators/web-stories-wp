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
import { List, TextSize } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { useHighlights } from '../../../app/highlights';
import { DESIGN_COPY } from '../constants';
import {
  CARD_TYPE,
  ChecklistCard,
  ChecklistCardStyles,
} from '../../checklistCard';
import { LayerThumbnail, Thumbnail, THUMBNAIL_TYPES } from '../../thumbnail';
import { filterStoryElements } from '../utils';
import { useRegisterCheck } from '../countContext';
import { useIsChecklistMounted } from '../popupMountedContext';

export function imageElementResolution(element) {
  if (!['image', 'gif'].includes(element.type)) {
    return false;
  }

  const scale = (element.scale || 100) / 100;
  const imageResolutionLow =
    element.resource?.height < 2 * (element.height * scale) ||
    element.resource?.width < 2 * (element.width * scale);

  return imageResolutionLow;
}

const ImageElementResolution = () => {
  const isChecklistMounted = useIsChecklistMounted();
  const pages = useStory(({ state }) => state?.pages);
  const failingElements = useMemo(
    () => filterStoryElements(pages, imageElementResolution),
    [pages]
  );
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);
  const handleClick = useCallback(
    (elementId, pageId) =>
      setHighlights({
        pageId,
        elementId,
      }),
    [setHighlights]
  );

  const { footer, title } = DESIGN_COPY.imageResolutionTooLow;
  const isRendered = failingElements.length > 0;
  useRegisterCheck('ImageElementResolution', isRendered);

  const thumbnails = failingElements.map((element) => (
    <Thumbnail
      key={element.id}
      onClick={() => handleClick(element.id, element.pageId)}
      type={THUMBNAIL_TYPES.IMAGE}
      displayBackground={<LayerThumbnail page={element} />}
      aria-label={__('Go to offending image', 'web-stories')}
    />
  ));

  return (
    isRendered &&
    isChecklistMounted && (
      <ChecklistCard
        title={title}
        cardType={
          failingElements.length > 1
            ? CARD_TYPE.MULTIPLE_ISSUE
            : CARD_TYPE.SINGLE_ISSUE
        }
        footer={
          <ChecklistCardStyles.CardListWrapper>
            <List size={TextSize.XSmall}>{footer}</List>
          </ChecklistCardStyles.CardListWrapper>
        }
        thumbnails={thumbnails}
      />
    )
  );
};

export default ImageElementResolution;
