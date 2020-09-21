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
import PropTypes from 'prop-types';
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
import { getPagePreviewHeights, useGridViewKeys } from '../../utils';
import PreviewPage from '../previewPage';
import {
  ActiveCard,
  GalleryContainer,
  MiniCard,
  MiniCardsContainer,
  ItemContainer,
  MiniCardButton,
} from './components';

const MAX_WIDTH = 680;
const ACTIVE_CARD_WIDTH = 330;
const MINI_CARD_WIDTH = 75;
const CARD_GAP = 15;
const CARD_WRAPPER_BUFFER = 12;

function CardGallery({ story, isRTL, galleryLabel }) {
  const [dimensionMultiplier, setDimensionMultiplier] = useState(null);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [activePageId, setActivePageId] = useState();
  const containerRef = useRef();
  const gridRef = useRef();
  const pageRefs = useRef({});
  const { pages = [] } = story;

  const isInteractive = pages.length > 1;

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
    // Reset state when the story changes
    setActivePageIndex(0);
    setActivePageId(pages[0].id);
  }, [pages]);

  useGridViewKeys({
    containerRef,
    gridRef,
    itemRefs: pageRefs,
    isRTL,
    currentItemId: activePageId,
    items: pages,
  });

  const GalleryItems = useMemo(() => {
    if (!metrics.miniCardSize) {
      return null;
    }

    const { miniCardSize, gap, miniWrapperSize } = metrics;
    return (
      <UnitsProvider
        pageSize={{
          width: miniCardSize.width,
          height: miniCardSize.height,
        }}
      >
        <MiniCardsContainer
          rowHeight={miniWrapperSize.height}
          gap={gap}
          ref={gridRef}
          aria-label={galleryLabel}
          data-testid="mini-cards-container"
        >
          {pages.map((page, index) => {
            const isCurrentPage = activePageId === page.id;
            const isActive = isCurrentPage && isInteractive;
            return (
              <ItemContainer
                key={`page-${index}`}
                ref={(el) => {
                  pageRefs.current[page.id] = el;
                }}
                width={miniWrapperSize.width}
              >
                <MiniCardButton
                  isSelected={isCurrentPage}
                  tabIndex={isActive ? 0 : -1}
                  {...miniWrapperSize}
                  onClick={() => handleMiniCardClick(index, page.id)}
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
                  <MiniCard {...miniCardSize}>
                    <PreviewPage page={page} pageSize={miniCardSize} />
                  </MiniCard>
                </MiniCardButton>
              </ItemContainer>
            );
          })}
        </MiniCardsContainer>
      </UnitsProvider>
    );
  }, [
    activePageId,
    galleryLabel,
    handleMiniCardClick,
    isInteractive,
    metrics,
    pages,
  ]);

  return (
    <GalleryContainer ref={containerRef} maxWidth={MAX_WIDTH}>
      {GalleryItems}
      {metrics.activeCardSize && pages[activePageIndex] && (
        <UnitsProvider
          pageSize={{
            width: metrics.activeCardSize.width,
            height: metrics.activeCardSize.height,
          }}
        >
          <ActiveCard
            {...metrics.activeCardSize}
            aria-label={sprintf(
              /* translators: %s: active preview page number */
              __('Active Page Preview - Page %s', 'web-stories'),
              activePageIndex + 1
            )}
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
  isRTL: PropTypes.bool,
  galleryLabel: PropTypes.string.isRequired,
};

export default CardGallery;
