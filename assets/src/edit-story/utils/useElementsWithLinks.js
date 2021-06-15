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
import { useCallback, useMemo } from 'react';

/**
 * Internal dependencies
 */
import { useStory, useCanvas } from '../app';
import isElementBelowLimit from './isElementBelowLimit';

function useElementsWithLinks() {
  const { currentPage, selectedElements } = useStory((state) => ({
    currentPage: state.state.currentPage,
    selectedElements: state.state.selectedElements,
  }));
  const { pageAttachmentContainer } = useCanvas((state) => ({
    pageAttachmentContainer: state.state.pageAttachmentContainer,
  }));

  const { elements } = currentPage;
  const elementsWithLinks = useMemo(
    () => elements.filter(({ link }) => link?.url?.length),
    [elements]
  );

  // Checks if there is a link with invalid position among the selection.
  const hasInvalidLinkSelected = useCallback(() => {
    if (!pageAttachmentContainer) {
      return false;
    }
    if (!currentPage?.pageAttachment?.url?.length) {
      return false;
    }
    const linksInActivePageAttachment = selectedElements
      .filter(({ link }) => link?.url?.length)
      .filter((element) => {
        return isElementBelowLimit(element);
      });
    return linksInActivePageAttachment.length > 0;
  }, [currentPage, selectedElements, pageAttachmentContainer]);

  /**
   * Returns the elements that were found in the attachment area.
   */
  const getElementsInAttachmentArea = useCallback(
    (els, verifyLink = false) => {
      if (!pageAttachmentContainer) {
        return [];
      }
      return els.filter((element) => {
        return isElementBelowLimit(element, verifyLink);
      });
    },
    [pageAttachmentContainer]
  );

  // Checks if a link is in the attachment area, even if there's no active attachment.
  const getLinksInAttachmentArea = useCallback(() => {
    return getElementsInAttachmentArea(elementsWithLinks, true);
  }, [elementsWithLinks, getElementsInAttachmentArea]);

  const isElementInAttachmentArea = useCallback(
    (element) => {
      if (!pageAttachmentContainer) {
        return false;
      }
      // If there is no Page Attachment present, return.
      if (!currentPage?.pageAttachment?.url.length) {
        return false;
      }
      // If the node is inside the page attachment container.
      return isElementBelowLimit(element, false);
    },
    [pageAttachmentContainer, currentPage]
  );

  return {
    getLinksInAttachmentArea,
    hasInvalidLinkSelected: hasInvalidLinkSelected(),
    isElementInAttachmentArea,
    getElementsInAttachmentArea,
  };
}

export default useElementsWithLinks;
