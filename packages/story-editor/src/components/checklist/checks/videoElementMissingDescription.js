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

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { states, useHighlights } from '../../../app/highlights';
import { ACCESSIBILITY_COPY } from '../constants';
import { filterStoryElements, getVisibleThumbnails } from '../utils';
import { useRegisterCheck } from '../countContext';
import { useIsChecklistMounted } from '../popupMountedContext';
import { useToggleButton } from '../../checklistCard';
import VideoChecklistCard from './shared/videoChecklistCard';

export function videoElementMissingDescription(element) {
  return (
    element.type === 'video' &&
    !element.alt?.length &&
    !element.resource?.alt?.length
  );
}

const VideoElementMissingDescription = () => {
  const isChecklistMounted = useIsChecklistMounted();
  const pages = useStory(({ state }) => state?.pages);
  const { isExpanded, onExpand } = useToggleButton();
  const elements = useMemo(
    () => filterStoryElements(pages, videoElementMissingDescription),
    [pages]
  );
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);
  const handleClick = useCallback(
    (elementId, pageId) =>
      setHighlights({
        pageId,
        elementId,
        highlight: states.ASSISTIVE_TEXT,
      }),
    [setHighlights]
  );

  const visiblePages = isExpanded ? elements : getVisibleThumbnails(elements);

  const { footer, title } = ACCESSIBILITY_COPY.videoMissingTitle;

  const isRendered = elements.length > 0;
  useRegisterCheck('VideoElementMissingDescription', isRendered);
  return (
    isRendered &&
    isChecklistMounted && (
      <VideoChecklistCard
        title={title}
        elements={visiblePages}
        footer={footer}
        onClick={handleClick}
        onClickOverflowThumbnail={onExpand}
        showOverflowThumbnails={isExpanded}
      />
    )
  );
};
export default VideoElementMissingDescription;
