/*
 * Copyright 2020 Google LLC
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
import { useCallback } from '@googleforcreators/react';
import {
  elementIs,
  isElementBelowLimit,
  type Element,
} from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { useStory } from '../app/story';
import { useCanvas } from '../app/canvas';

/**
 * Custom hook to aid with detecting links conflicting with page attachments.
 *
 * @return Hook result.
 */
function useElementsWithLinks() {
  const { pageAttachmentContainer } = useCanvas((state) => ({
    pageAttachmentContainer: state.state.pageAttachmentContainer,
  }));
  const {
    hasLinksInAttachmentArea,
    hasInvalidLinkSelected,
    hasPageAttachment,
    hasElementsInAttachmentArea,
  } = useStory(({ state }) => {
    const elementsWithLinks =
      state.currentPage?.elements.filter(elementIs.linkable) || [];

    const hasPageAttachment = Boolean(
      state.currentPage?.pageAttachment?.url?.length
    );

    return {
      hasInvalidLinkSelected: Boolean(
        pageAttachmentContainer &&
          hasPageAttachment &&
          state.selectedElements
            .filter(elementIs.linkable)
            .some((element) => isElementBelowLimit(element))
      ),
      hasLinksInAttachmentArea: Boolean(
        pageAttachmentContainer &&
          elementsWithLinks.some((element) =>
            isElementBelowLimit(element, true)
          )
      ),
      hasElementsInAttachmentArea: Boolean(
        pageAttachmentContainer &&
          hasPageAttachment &&
          state.selectedElements.some((element) =>
            isElementBelowLimit(element, false)
          )
      ),
      hasPageAttachment,
    };
  });

  const isElementInAttachmentArea = useCallback(
    (element: Element) => {
      if (!pageAttachmentContainer) {
        return false;
      }

      if (!hasPageAttachment) {
        return false;
      }

      return isElementBelowLimit(element, false);
    },
    [pageAttachmentContainer, hasPageAttachment]
  );

  return {
    hasLinksInAttachmentArea,
    hasInvalidLinkSelected,
    isElementInAttachmentArea,
    hasElementsInAttachmentArea,
  };
}

export default useElementsWithLinks;
