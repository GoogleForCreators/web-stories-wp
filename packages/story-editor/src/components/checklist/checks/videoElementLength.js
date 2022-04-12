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

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { useHighlights } from '../../../app/highlights';
import { DESIGN_COPY, MAX_VIDEO_LENGTH_SECONDS } from '../constants';
import { filterStoryElements } from '../utils';
import { useRegisterCheck } from '../countContext';
import { useIsChecklistMounted } from '../popupMountedContext';
import VideoChecklistCard from './shared/videoChecklistCard';

export function videoElementLength(element) {
  return (
    element.type === 'video' &&
    element.resource?.length > MAX_VIDEO_LENGTH_SECONDS
  );
}

const VideoElementLength = () => {
  const isChecklistMounted = useIsChecklistMounted();
  const pages = useStory(({ state }) => state?.pages);
  const elements = useMemo(
    () => filterStoryElements(pages, videoElementLength),
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

  const { footer, title } = DESIGN_COPY.videoTooLong;

  const isRendered = elements.length > 0;
  useRegisterCheck('VideoElementLength', isRendered);

  return (
    isRendered &&
    isChecklistMounted && (
      <VideoChecklistCard
        title={title}
        elements={elements}
        footer={footer}
        onThumbnailClick={handleClick}
      />
    )
  );
};
export default VideoElementLength;
