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
import {
  useCallback,
  useRef,
  useMemo,
  useState,
  useEffect,
} from '@googleforcreators/react';
import type { PropsWithChildren } from 'react';

/**
 * Internal dependencies
 */
import type { ElementId, Page } from '@googleforcreators/elements';
import { useStory } from '../../../../app/story';
import {
  requestIdleCallback,
  cancelIdleCallback,
} from '../../../../utils/idleCallback';
import Context from './context';
import useCarouselSizing from './useCarouselSizing';
import useCarouselScroll from './useCarouselScroll';
import useCarouselKeys from './useCarouselKeys';

function CarouselProvider({
  availableSpace,
  children,
}: PropsWithChildren<{ availableSpace: number }>) {
  const { pages, currentPageId, setCurrentPage, arrangePage } = useStory(
    ({
      state: { pages, currentPageId },
      actions: { setCurrentPage, arrangePage },
    }) => ({ pages, currentPageId, setCurrentPage, arrangePage })
  );

  const [listElement, setListElement] = useState<HTMLElement | null>(null);
  const pagesRef = useRef<Record<ElementId, HTMLElement>>({});

  const numPages = pages.length;

  const pageIds = useMemo(() => pages.map(({ id }) => id), [pages]);

  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const id = requestIdleCallback(() => setShowSkeleton(false), {
      timeout: 5000,
    });
    return () => cancelIdleCallback(id);
  }, []);

  const {
    pageThumbWidth,
    pageThumbHeight,
    pageThumbMargin,
    carouselWidth,
    hasOverflow,
    showablePages,
  } = useCarouselSizing({ availableSpace, numPages });

  const { canScrollBack, canScrollForward, scrollBack, scrollForward } =
    useCarouselScroll({
      listElement,
      carouselWidth,
      hasOverflow,
      showablePages,
      pageThumbWidth,
      pageThumbMargin,
    });

  useCarouselKeys({ listElement, pageRefs: pagesRef });

  const setPageRef = useCallback((page: Page, el: HTMLElement) => {
    pagesRef.current[page.id] = el;
  }, []);

  const clickPage = useCallback(
    (page: Page) => setCurrentPage({ pageId: page.id }),
    [setCurrentPage]
  );

  interface Position {
    position: number;
  }

  const rearrangePages = useCallback(
    ({ position: oldPos }: Position, { position: newPos }: Position) => {
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
      carouselWidth,
      hasOverflow,
      pages,
      pageIds,
      numPages,
      currentPageId,
      canScrollBack,
      canScrollForward,
      showSkeleton,
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

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export default CarouselProvider;
