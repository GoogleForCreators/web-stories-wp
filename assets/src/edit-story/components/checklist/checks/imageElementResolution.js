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
import { useCallback, useMemo } from 'react';
import { __ } from '@web-stories-wp/i18n';
import { List, THEME_CONSTANTS } from '@web-stories-wp/design-system';

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
import { filterStoryElements, getVisibleThumbnails } from '../utils';
import { useRegisterCheck } from '../countContext';

export function mediaElementResolution(element) {
  switch (element.type) {
    case 'image':
      return imageElementResolution(element);
    case 'gif':
      return gifElementResolution(element);
    default:
      return false;
  }
}

function imageElementResolution(element) {
  const heightResTooLow =
    element.resource?.sizes?.full?.height < 2 * element.height;
  const widthResTooLow =
    element.resource?.sizes?.full?.width < 2 * element.width;

  return heightResTooLow || widthResTooLow;
}

function gifElementResolution(element) {
  // gif/output uses the MP4 video provided by the 3P Media API for displaying gifs
  const heightResTooLow =
    element.resource?.output?.sizes?.mp4?.full?.height < 2 * element.height;
  const widthResTooLow =
    element.resource?.output?.sizes?.mp4?.full?.width < 2 * element.width;

  return heightResTooLow || widthResTooLow;
}

const ImageElementResolution = () => {
  const pages = useStory(({ state }) => state?.pages);
  const failingElements = useMemo(
    () => filterStoryElements(pages, mediaElementResolution),
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

  const { footer, title } = DESIGN_COPY.lowImageResolution;
  const isRendered = failingElements.length > 0;
  useRegisterCheck('ImageElementResolution', isRendered);

  return (
    isRendered && (
      <ChecklistCard
        title={title}
        cardType={
          failingElements.length > 1
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
        thumbnailCount={failingElements.length}
        thumbnail={
          <>
            {getVisibleThumbnails(failingElements).map((element) => (
              <Thumbnail
                key={element.id}
                onClick={() => handleClick(element.id, element.pageId)}
                type={THUMBNAIL_TYPES.IMAGE}
                displayBackground={<LayerThumbnail page={element} />}
                aria-label={__('Go to offending image', 'web-stories')}
              />
            ))}
          </>
        }
      />
    )
  );
};

export default ImageElementResolution;
