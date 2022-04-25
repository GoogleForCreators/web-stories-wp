/*
 * Copyright 2022 Google LLC
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
import { renderHook } from '@testing-library/react-hooks';
import { DANGER_ZONE_HEIGHT, FULLBLEED_HEIGHT } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import StoryContext from '../../app/story/context';
import CanvasContext from '../../app/canvas/context';
import useElementsWithLinks from '../useElementsWithLinks';

const ELEMENT_WITH_LINK = {
  id: 'elementWithLink',
  type: 'unknown',
  link: {
    url: 'https://example.com',
  },
  content: 'Example Link',
  width: 40,
  height: 40,
  rotationAngle: 0,
  x: 10,
  y: 10,
};

const ELEMENT_WITH_LINK_BELOW_LIMIT = {
  id: 'elementWithLinkBelowLimit',
  type: 'unknown',
  link: {
    url: 'https://example.com',
  },
  content: 'Example Link',
  width: 40,
  height: 40,
  rotationAngle: 0,
  x: 10,
  y: FULLBLEED_HEIGHT * 0.8 + DANGER_ZONE_HEIGHT + 10,
};

const ELEMENT = {
  id: 'element',
  type: 'unknown',
  content: 'Example Link',
  width: 40,
  height: 40,
  rotationAngle: 0,
  x: 10,
  y: 10,
};

const ELEMENT_BELOW_LIMIT = {
  id: 'elementBelowLimit',
  type: 'unknown',
  content: 'Example Link',
  width: 40,
  height: 40,
  rotationAngle: 0,
  x: 10,
  y: FULLBLEED_HEIGHT * 0.8 + DANGER_ZONE_HEIGHT + 10,
};

function render({
  pageAttachmentContainer = null,
  pageAttachment = '',
  elements = [],
  selectedElements = [],
}) {
  const storyContextValue = {
    state: {
      currentPage: {
        elements,
        pageAttachment: {
          url: pageAttachment,
        },
      },
      selectedElements,
    },
  };

  const canvasContext = {
    state: {
      pageAttachmentContainer,
    },
    actions: {},
  };

  const Wrapper = ({ children }) => (
    <StoryContext.Provider value={storyContextValue}>
      <CanvasContext.Provider value={canvasContext}>
        {children}
      </CanvasContext.Provider>
    </StoryContext.Provider>
  );

  return renderHook(() => useElementsWithLinks(), {
    wrapper: Wrapper,
    initialProps: true,
  });
}

describe('useElementsWithLinks', () => {
  describe('hasLinksInAttachmentArea', () => {
    it('returns true if there are links in the page attachment area', () => {
      const { result } = render({
        pageAttachmentContainer: document.body,
        pageAttachment: 'https://example.com',
        elements: [ELEMENT_WITH_LINK_BELOW_LIMIT],
      });
      expect(result.current.hasLinksInAttachmentArea).toBeTrue();
    });

    it('returns true even if there is no page attachment', () => {
      const { result } = render({
        pageAttachmentContainer: document.body,
        pageAttachment: '',
        elements: [ELEMENT_WITH_LINK_BELOW_LIMIT],
      });
      expect(result.current.hasLinksInAttachmentArea).toBeTrue();
    });

    it('returns false if links are not in the page attachment area', () => {
      const { result } = render({
        pageAttachmentContainer: document.body,
        pageAttachment: 'https://example.com',
        elements: [ELEMENT_WITH_LINK],
      });
      expect(result.current.hasLinksInAttachmentArea).toBeFalse();
    });

    it('returns false if there is no page attachment container', () => {
      const { result } = render({
        pageAttachment: 'https://example.com',
        elements: [ELEMENT_WITH_LINK_BELOW_LIMIT],
      });
      expect(result.current.hasLinksInAttachmentArea).toBeFalse();
    });
  });

  describe('hasElementsInAttachmentArea', () => {
    it('returns true if the selected elements are in the page attachment area', () => {
      const { result } = render({
        pageAttachmentContainer: document.body,
        pageAttachment: 'https://example.com',
        selectedElements: [ELEMENT_WITH_LINK_BELOW_LIMIT],
      });
      expect(result.current.hasElementsInAttachmentArea).toBeTrue();
    });

    it('returns false if there is no page attachment', () => {
      const { result } = render({
        pageAttachmentContainer: document.body,
        pageAttachment: '',
        selectedElements: [ELEMENT_WITH_LINK_BELOW_LIMIT],
      });
      expect(result.current.hasElementsInAttachmentArea).toBeFalse();
    });

    it('returns false if the selected elements are not in the page attachment area', () => {
      const { result } = render({
        pageAttachmentContainer: document.body,
        pageAttachment: 'https://example.com',
        selectedElements: [ELEMENT_WITH_LINK],
      });
      expect(result.current.hasElementsInAttachmentArea).toBeFalse();
    });

    it('returns false if there is no page attachment container', () => {
      const { result } = render({
        pageAttachment: 'https://example.com',
        selectedElements: [ELEMENT_WITH_LINK_BELOW_LIMIT],
      });
      expect(result.current.hasElementsInAttachmentArea).toBeFalse();
    });
  });

  describe('hasInvalidLinkSelected', () => {
    it('returns true if the selected elements are in the page attachment area', () => {
      const { result } = render({
        pageAttachmentContainer: document.body,
        pageAttachment: 'https://example.com',
        selectedElements: [ELEMENT_WITH_LINK_BELOW_LIMIT],
      });
      expect(result.current.hasInvalidLinkSelected).toBeTrue();
    });

    it('returns false if there is no page attachment', () => {
      const { result } = render({
        pageAttachmentContainer: document.body,
        pageAttachment: '',
        selectedElements: [ELEMENT_WITH_LINK_BELOW_LIMIT],
      });
      expect(result.current.hasInvalidLinkSelected).toBeFalse();
    });

    it('returns false if the selected elements are not in the page attachment area', () => {
      const { result } = render({
        pageAttachmentContainer: document.body,
        pageAttachment: 'https://example.com',
        selectedElements: [ELEMENT_WITH_LINK],
      });
      expect(result.current.hasInvalidLinkSelected).toBeFalse();
    });

    it('returns false if there is no page attachment container', () => {
      const { result } = render({
        pageAttachment: 'https://example.com',
        selectedElements: [ELEMENT_WITH_LINK_BELOW_LIMIT],
      });
      expect(result.current.hasInvalidLinkSelected).toBeFalse();
    });
  });

  describe('isElementInAttachmentArea', () => {
    it('returns true if the given element is in the page attachment area', () => {
      const { result } = render({
        pageAttachmentContainer: document.body,
        pageAttachment: 'https://example.com',
      });
      expect(
        result.current.isElementInAttachmentArea(ELEMENT_BELOW_LIMIT)
      ).toBeTrue();
    });

    it('returns false if there is no page attachment', () => {
      const { result } = render({
        pageAttachmentContainer: document.body,
        pageAttachment: '',
      });
      expect(
        result.current.isElementInAttachmentArea(ELEMENT_BELOW_LIMIT)
      ).toBeFalse();
    });

    it('returns false if the given element is not in the page attachment area', () => {
      const { result } = render({
        pageAttachmentContainer: document.body,
        pageAttachment: 'https://example.com',
      });
      expect(result.current.isElementInAttachmentArea(ELEMENT)).toBeFalse();
    });

    it('returns false if there is no page attachment container', () => {
      const { result } = render({
        pageAttachment: 'https://example.com',
      });
      expect(
        result.current.isElementInAttachmentArea(ELEMENT_BELOW_LIMIT)
      ).toBeFalse();
    });
  });
});
