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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { STORY_ANIMATION_STATE } from '../../../animation';
import { UnitsProvider } from '../../../edit-story/units';
import { StoryPropType } from '../../types';
import { getPagePreviewHeights } from '../../utils';
import PreviewPage from '../previewPage';
import {
  ActiveCard,
  GalleryContainer,
  MiniCard,
  MiniCardsContainer,
  MiniCardWrapper,
} from './components';
import useGridViewKeys from '../../utils/useGridViewKeys';
import { useConfig } from '../../../edit-story/app';
import GalleryItem from './galleryItem';

const MAX_WIDTH = 680;
const ACTIVE_CARD_WIDTH = 330;
const MINI_CARD_WIDTH = 75;
const CARD_GAP = 15;
const CARD_WRAPPER_BUFFER = 12;

function CardGallery({ story }) {
  const [dimensionMultiplier, setDimensionMultiplier] = useState(null);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [activePageId, setActivePageId] = useState();
  const [pages, setPages] = useState([]);
  const containerRef = useRef();
  const gridRef = useRef();
  const pageRefs = useRef({});

  const { isRTL } = useConfig(); // is this right?

  useEffect(() => {
    setPages(story.pages || []);
  }, [story]);

  const metrics = useMemo(() => {
    if (!dimensionMultiplier) {
      return {};
    }
    const activeCardWidth = ACTIVE_CARD_WIDTH * dimensionMultiplier;
    const miniCardWidth = MINI_CARD_WIDTH * dimensionMultiplier;
    const activeHeightOptions = getPagePreviewHeights(activeCardWidth);
    const miniCardHeightOptions = getPagePreviewHeights(miniCardWidth);

    return {
      activeCardSize: {
        width: activeCardWidth,
        height: activeHeightOptions.storyHeight,
        containerHeight: activeHeightOptions.fullBleedHeight,
      },
      miniCardSize: {
        width: miniCardWidth,
        height: miniCardHeightOptions.storyHeight,
        containerHeight: miniCardHeightOptions.fullBleedHeight,
      },
      miniWrapperSize: {
        width: miniCardWidth + CARD_WRAPPER_BUFFER,
        height: miniCardHeightOptions.fullBleedHeight + CARD_WRAPPER_BUFFER,
      },
      gap: CARD_GAP * dimensionMultiplier,
    };
  }, [dimensionMultiplier]);

  const handleMiniCardClick = useCallback((index, id) => {
    console.log('CLICK!!!! index?? ', index, ' ID: ', id);
    setActivePageIndex(index);
    setActivePageId(id);
  }, []);

  const updateContainerSize = useCallback(() => {
    const ratio = containerRef.current.offsetWidth / MAX_WIDTH;

    if (ratio > 0.92) {
      setDimensionMultiplier(1);
    } else if (ratio > 0.75) {
      setDimensionMultiplier(0.8);
    } else if (ratio > 0.6) {
      setDimensionMultiplier(0.6);
    } else {
      setDimensionMultiplier(0.5);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateContainerSize);
    updateContainerSize();
    return () => {
      window.removeEventListener('resize', updateContainerSize);
    };
  }, [updateContainerSize]);

  useEffect(() => {
    setActivePageIndex(0);
  }, [story]);

  useEffect(() => {
    console.log('SET ACTIVE PAGE: ', story);

    setActivePageId(story.pages[0].id);
  }, [story]);

  console.log('active page id: ', activePageId);
  useGridViewKeys({
    ref: containerRef,
    gridRef,
    itemRefs: pageRefs,
    isRTL,
    currentItemId: activePageId,
    items: pages,
  });

  const isInteractive = pages.length > 1;

  return (
    <GalleryContainer ref={containerRef} maxWidth={MAX_WIDTH}>
      {metrics.miniCardSize && (
        <UnitsProvider
          pageSize={{
            width: metrics.miniCardSize.width,
            height: metrics.miniCardSize.height,
          }}
        >
          <MiniCardsContainer
            rowHeight={metrics.miniWrapperSize.height}
            gap={metrics.gap}
            ref={gridRef}
            aria-label={__('Gallery Items', 'web-stories')} // todo
          >
            {pages.map((page, index) => {
              const isCurrentPage = activePageId === page.id;
              console.log(activePageId, page.id);
              console.log('is interactive? ', isInteractive);
              return (
                <GalleryItem
                  key={`page-${index}`}
                  ref={(el) => {
                    pageRefs.current[page.id] = el;
                  }}
                  gridRef={gridRef}
                  isSelected={isCurrentPage}
                  isActive={isCurrentPage && isInteractive}
                  isInteractive={isInteractive}
                  index={index}
                  {...metrics.miniWrapperSize}
                  onClick={() => handleMiniCardClick(index, page.id)} // to remove need for index
                  aria-label={
                    isCurrentPage
                      ? sprintf(
                          /* translators: %s: page number. */
                          __('Page %s (current page)', 'web-stories'),
                          index + 1
                        )
                      : sprintf(
                          /* translators: %s: page number. */
                          __('Page %s', 'web-stories'),
                          index + 1
                        )
                  }
                >
                  <MiniCard {...metrics.miniCardSize}>
                    <PreviewPage page={page} pageSize={metrics.miniCardSize} />
                  </MiniCard>
                </GalleryItem>
              );
            })}
          </MiniCardsContainer>
        </UnitsProvider>
      )}
      {metrics.activeCardSize && pages[activePageIndex] && (
        <UnitsProvider
          pageSize={{
            width: metrics.activeCardSize.width,
            height: metrics.activeCardSize.height,
          }}
        >
          <ActiveCard
            aria-label={sprintf(
              /* translators: %s: active preview page number */
              __('Active Page Preview - Page %s', 'web-stories'),
              activePageIndex + 1
            )}
            {...metrics.activeCardSize}
          >
            <PreviewPage
              page={pages[activePageIndex]}
              pageSize={metrics.activeCardSize}
              animationState={STORY_ANIMATION_STATE.PLAYING}
            />
          </ActiveCard>
        </UnitsProvider>
      )}
    </GalleryContainer>
  );
}

CardGallery.propTypes = {
  story: StoryPropType.isRequired,
};

export default CardGallery;
