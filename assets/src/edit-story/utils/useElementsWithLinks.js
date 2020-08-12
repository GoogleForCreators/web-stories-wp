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
import { useStory } from '../app/story';
import { useCanvas } from '../components/canvas';
import { useChecklist } from '../app/checklist';
import isTargetOutOfContainer from './isTargetOutOfContainer';

function useElementsWithLinks() {
  const { currentPage, selectedElements } = useStory((state) => ({
    currentPage: state.state.currentPage,
    selectedElements: state.state.selectedElements,
  }));
  const { nodesById, pageAttachmentContainer } = useCanvas((state) => ({
    nodesById: state.state.nodesById,
    pageSize: state.state.pageSize,
    pageAttachmentContainer: state.state.pageAttachmentContainer,
  }));
  const { checklist, setPageChecklist } = useChecklist((state) => ({
    checklist: state.state.checklist,
    setPageChecklist: state.actions.setPageChecklist,
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
      .filter(({ id }) => {
        const node = nodesById[id];
        return !isTargetOutOfContainer(node, pageAttachmentContainer);
      });
    return linksInActivePageAttachment.length > 0;
  }, [currentPage, nodesById, selectedElements, pageAttachmentContainer]);

  // Checks if a link is in the attachment area, even if there's no active attachment.
  const getLinksInAttachmentArea = useCallback(() => {
    if (!pageAttachmentContainer) {
      return [];
    }
    return elementsWithLinks.filter(({ id }) => {
      const node = nodesById[id];
      return !isTargetOutOfContainer(node, pageAttachmentContainer);
    });
  }, [nodesById, elementsWithLinks, pageAttachmentContainer]);

  const isElementInAttachmentArea = useCallback(
    (node) => {
      if (!pageAttachmentContainer) {
        return false;
      }
      // If there is no Page Attachment present, return.
      if (!currentPage?.pageAttachment?.url.length) {
        return false;
      }
      // If the node is inside the page attachment container.
      return !isTargetOutOfContainer(node, pageAttachmentContainer);
    },
    [pageAttachmentContainer, currentPage]
  );

  const registerInvalidLinks = useCallback(() => {
    // @todo Only change if sth changed.
    const links = getLinksInAttachmentArea();
    setPageChecklist(currentPage.id, links);
  }, [currentPage, getLinksInAttachmentArea, setPageChecklist]);

  return {
    elementsWithLinks,
    getLinksInAttachmentArea,
    hasInvalidLinkSelected: hasInvalidLinkSelected(),
    isElementInAttachmentArea,
    registerInvalidLinks,
  };
}

export default useElementsWithLinks;
