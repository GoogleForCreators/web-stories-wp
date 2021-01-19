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
import PropTypes from 'prop-types';
import { useCallback, useRef, useMemo, useState } from 'react';

/**
 * Internal dependencies
 */
import { useStory } from '../../app';
import CarouselContext from './carouselContext';
import useCarouselSizing from './useCarouselSizing';
import useCarouselScroll from './useCarouselScroll';
import useCarouselKeys from './useCarouselKeys';

function CarouselProvider({ availableSpace, children }) {
  const {
    pages,
    currentPageId,
    setCurrentPage,
    arrangePage,
  } = useStory(
    ({
      state: { pages, currentPageId },
      actions: { setCurrentPage, arrangePage },
    }) => ({ pages, currentPageId, setCurrentPage, arrangePage })
  );

  const [listElement, setListElement] = useState(null);
  const pageRefs = useRef([]);

  const numPages = pages.length;

  const pageIds = useMemo(() => pages.map(({ id }) => id), [pages]);

  const {
    pageThumbWidth,
    pageThumbHeight,
    pageThumbMargin,
    carouselWidth,
    hasOverflow,
    showablePages,
  } = useCarouselSizing({ availableSpace, numPages });

  const {
    canScrollBack,
    canScrollForward,
    scrollBack,
    scrollForward,
  } = useCarouselScroll({
    listElement,
    carouselWidth,
    hasOverflow,
    showablePages,
    pageThumbWidth,
    pageThumbMargin,
  });

  useCarouselKeys({ listElement, pageRefs });

  const setPageRef = useCallback((page, el) => {
    pageRefs.current[page.id] = el;
  }, []);

  const clickPage = useCallback((page) => setCurrentPage({ pageId: page.id }), [
    setCurrentPage,
  ]);

  const rearrangePages = useCallback(
    (oldPos, newPos) => {
      const pageId = pageIds[oldPos];
      arrangePage({ pageId, position: newPos });
      setCurrentPage({ pageId });
    },
    [pageIds, arrangePage, setCurrentPage]
  );

  const value = {
    state: {
      pageThumbWidth,
      pageThumbHeight,
      pageThumbMargin,
      availableSpace,
      carouselWidth,
      hasOverflow,
      pages,
      pageIds,
      numPages,
      currentPageId,
      canScrollBack,
      canScrollForward,
    },
    actions: {
      scrollBack,
      scrollForward,
      clickPage,
      rearrangePages,
      setListRef: setListElement,
      setPageRef,
    },
  };

  return (
    <CarouselContext.Provider value={value}>
      {children}
    </CarouselContext.Provider>
  );
}

CarouselProvider.propTypes = {
  availableSpace: PropTypes.number,
  children: PropTypes.node,
};

export default CarouselProvider;
