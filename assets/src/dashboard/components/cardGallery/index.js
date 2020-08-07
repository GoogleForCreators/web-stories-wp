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
import { UnitsProvider } from '../../../edit-story/units';
import { STORY_PAGE_STATE } from '../../constants';
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

const MAX_WIDTH = 680;
const ACTIVE_CARD_WIDTH = 330;
const MINI_CARD_WIDTH = 75;
const CARD_GAP = 15;
const CARD_WRAPPER_BUFFER = 12;

function CardGallery({ story }) {
  const [dimensionMultiplier, setDimensionMultiplier] = useState(null);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [pages, setPages] = useState([]);
  const containerRef = useRef();

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

  const handleMiniCardClick = useCallback((index) => {
    setActivePageIndex(index);
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
          >
            {pages.map((page, index) => (
              <MiniCardWrapper
                key={index}
                isSelected={index === activePageIndex}
                {...metrics.miniWrapperSize}
                onClick={() => handleMiniCardClick(index)}
                aria-label={sprintf(
                  /* translators: %s: page number. */
                  __('Page Preview - Page %s', 'web-stories'),
                  index + 1
                )}
              >
                <MiniCard {...metrics.miniCardSize}>
                  <PreviewPage page={page} pageSize={metrics.miniCardSize} />
                </MiniCard>
              </MiniCardWrapper>
            ))}
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
              animationState={STORY_PAGE_STATE.PLAYING}
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
