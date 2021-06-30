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
import { useMemo, useCallback } from 'react';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { useHighlights } from '../../../app/highlights';
import { DESIGN_COPY } from '../constants';
import {
  CARD_TYPE,
  ChecklistCard,
  DefaultFooterText,
} from '../../checklistCard';
import { LayerThumbnail, Thumbnail, THUMBNAIL_TYPES } from '../../thumbnail';
import { filterStoryElements, getVisibleThumbnails } from '../utils';
import { useRegisterCheck } from '../checkCountContext';

const MIN_VIDEO_HEIGHT = 480;
const MIN_VIDEO_WIDTH = 852;

export function videoElementResolution(element) {
  const videoResolutionLow =
    element.resource?.sizes?.full?.height <= MIN_VIDEO_HEIGHT &&
    element.resource?.sizes?.full?.width <= MIN_VIDEO_WIDTH;

  return element.type === 'video' && videoResolutionLow;
}

const VideoElementResolution = () => {
  const story = useStory(({ state }) => state);
  const failingElements = useMemo(
    () => filterStoryElements(story, videoElementResolution),
    [story]
  );
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);
  const handleClick = useCallback(
    (elementId) =>
      setHighlights({
        elementId,
      }),
    [setHighlights]
  );
  const { footer, title } = DESIGN_COPY.videoResolutionTooLow;

  const isRendered = failingElements.length > 0;
  useRegisterCheck('VideoElementResolution', isRendered);

  return (
    isRendered && (
      <ChecklistCard
        title={title}
        cardType={
          failingElements.length > 1
            ? CARD_TYPE.MULTIPLE_ISSUE
            : CARD_TYPE.SINGLE_ISSUE
        }
        footer={<DefaultFooterText>{footer}</DefaultFooterText>}
        thumbnailCount={failingElements.length}
        thumbnail={
          <>
            {getVisibleThumbnails(failingElements).map((element) => (
              <Thumbnail
                key={element.id}
                onClick={() => handleClick(element.id)}
                type={THUMBNAIL_TYPES.VIDEO}
                displayBackground={
                  <LayerThumbnail page={element} showVideoPreviewAsBackup />
                }
                aria-label={__('Go to offending video', 'web-stories')}
              />
            ))}
          </>
        }
      />
    )
  );
};

export default VideoElementResolution;
