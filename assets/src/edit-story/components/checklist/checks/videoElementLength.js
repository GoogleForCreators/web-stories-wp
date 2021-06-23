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

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { useHighlights } from '../../../app/highlights';
import { DESIGN_COPY, MAX_VIDEO_LENGTH_SECONDS } from '../constants';
import {
  CARD_TYPE,
  ChecklistCard,
  DefaultFooterText,
} from '../../checklistCard';
import { LayerThumbnail, Thumbnail, THUMBNAIL_TYPES } from '../../thumbnail';
import { filterStoryElements } from '../utils';

export function videoElementLength(element) {
  return (
    element.type === 'video' &&
    element.resource?.length > MAX_VIDEO_LENGTH_SECONDS
  );
}

const VideoElementLength = () => {
  const story = useStory(({ state }) => state);

  const failingElements = filterStoryElements(story, videoElementLength);
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);

  const { footer, title } = DESIGN_COPY.videoResolutionTooHigh;

  return (
    failingElements.length > 0 && (
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
            {failingElements.map((element) => (
              <Thumbnail
                key={element.id}
                onClick={() => {
                  setHighlights({
                    elementId: element.id,
                  });
                }}
                type={THUMBNAIL_TYPES.VIDEO}
                displayBackground={<LayerThumbnail page={element} />}
                aria-label={__('Go to offending video', 'web-stories')}
              />
            ))}
          </>
        }
      />
    )
  );
};
export default VideoElementLength;
