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
import { useCallback } from 'react';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { useHighlights } from '../../../app/highlights';
import { ACCESSIBILITY_COPY, MIN_FONT_SIZE } from '../constants';
import {
  CARD_TYPE,
  ChecklistCard,
  DefaultFooterText,
} from '../../checklistCard';
import { LayerThumbnail, Thumbnail, THUMBNAIL_TYPES } from '../../thumbnail';
import { filterStoryElements, getVisibleThumbnails } from '../utils';
import { useRegisterCheck } from '../countContext';

export function textElementFontSizeTooSmall(element) {
  return (
    element.type === 'text' &&
    element.fontSize &&
    element.fontSize < MIN_FONT_SIZE
  );
}

const TextElementFontSizeTooSmall = () => {
  const story = useStory(({ state }) => state);
  const elements = filterStoryElements(story, textElementFontSizeTooSmall);
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);
  const handleClick = useCallback(
    (elementId) =>
      setHighlights({
        elementId,
      }),
    [setHighlights]
  );
  const { footer, title } = ACCESSIBILITY_COPY.fontSizeTooSmall;

  const isRendered = elements.length > 0;
  useRegisterCheck('TextElementFontSizeTooSmall', isRendered);
  return (
    isRendered && (
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
                onClick={() => handleClick(element.id)}
                type={THUMBNAIL_TYPES.TEXT}
                displayBackground={<LayerThumbnail page={element} />}
                aria-label={__('Go to offending text element', 'web-stories')}
              />
            ))}
          </>
        }
      />
    )
  );
};

export default TextElementFontSizeTooSmall;
