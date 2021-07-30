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
import { ThemeProvider } from 'styled-components';
import { __, sprintf } from '@web-stories-wp/i18n';
import {
  FULLBLEED_RATIO,
  PAGE_RATIO,
  UnitsProvider,
} from '@web-stories-wp/units';
import { useGridViewKeys } from '@web-stories-wp/design-system';
import { useResizeEffect, useDebouncedCallback } from '@web-stories-wp/react';
import { STORY_ANIMATION_STATE } from '@web-stories-wp/animation';

/**
 * Internal dependencies
 */
import { StoryPropType } from '../../types';
import { PreviewPage } from '../../../edit-story/components/previewPage';
import {
  GalleryContainer,
  MiniCardButton,
  Thumbnail,
  AspectRatio,
  Thumbnails,
  DisplayPage,
} from './components';

function sizesFromWidth(width) {
  return {
    width,
    height: width / PAGE_RATIO,
    containerHeight: width / FULLBLEED_RATIO,
  };
}

function getIsThreeRows() {
  return window.innerWidth < 1600;
}

function CardGallery({ story, isRTL, galleryLabel }) {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [activePageId, setActivePageId] = useState();
  const containerRef = useRef();
  const gridRef = useRef();
  const pageRefs = useRef({});

  const displayPageRef = useRef();
  const thumbnailRef = useRef();
  const [displayPageSize, setDisplayPageSize] = useState(null);
  const [thumbnailSize, setThumbnailSize] = useState(null);
  const [isThreeRows, setIsThreeRows] = useState(getIsThreeRows());

  const { pages = [] } = story;

  const isInteractive = pages.length > 1;

  const handleMiniCardClick = useCallback((index, id) => {
    setActivePageIndex(index);
    setActivePageId(id);
  }, []);

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

  const debouncedSetDisplayPageSize = useDebouncedCallback(({ width }) => {
    setDisplayPageSize(sizesFromWidth(width));
  }, 100);
  useResizeEffect(displayPageRef, debouncedSetDisplayPageSize, [
    debouncedSetDisplayPageSize,
  ]);
  const debouncedSetThumbnailSize = useDebouncedCallback(({ width }) => {
    setThumbnailSize(sizesFromWidth(width));
  }, 100);
  useResizeEffect(thumbnailRef, debouncedSetThumbnailSize, [
    debouncedSetThumbnailSize,
    thumbnailRef.current,
  ]);

  const debouncedSetIsThreeRows = useDebouncedCallback(() => {
    setIsThreeRows(getIsThreeRows());
  }, 100);
  useEffect(() => {
    window.addEventListener('resize', debouncedSetIsThreeRows);
    return () => {
      window.removeEventListener('resize', debouncedSetIsThreeRows);
    };
  }, [debouncedSetIsThreeRows]);

  const GalleryItems = useMemo(() => {
    return pages.map((page, index) => {
      const isCurrentPage = activePageId === page.id;
      const isActive = isCurrentPage && isInteractive;
      const refProps = !index ? { ref: thumbnailRef } : {};
      return (
        <Thumbnail
          key={page.id}
          ref={(el) => {
            pageRefs.current[page.id] = el;
          }}
        >
          <AspectRatio {...refProps} aspect={1 / FULLBLEED_RATIO}>
            <MiniCardButton
              isSelected={isCurrentPage}
              tabIndex={isActive ? 0 : -1}
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
              {thumbnailSize && (
                <UnitsProvider
                  pageSize={{
                    height: thumbnailSize.height,
                    width: thumbnailSize.width,
                  }}
                >
                  <PreviewPage page={page} pageSize={thumbnailSize} />
                </UnitsProvider>
              )}
            </MiniCardButton>
          </AspectRatio>
        </Thumbnail>
      );
    });
  }, [activePageId, handleMiniCardClick, isInteractive, pages, thumbnailSize]);

  return (
    <ThemeProvider
      theme={(theme) => ({ ...theme, numRows: isThreeRows ? 3 : 4 })}
    >
      <GalleryContainer ref={containerRef}>
        <Thumbnails
          ref={gridRef}
          aria-label={galleryLabel}
          data-testid="mini-cards-container"
        >
          {GalleryItems}
        </Thumbnails>
        <DisplayPage
          aria-label={sprintf(
            /* translators: %s: active preview page number */
            __('Active Page Preview - Page %s', 'web-stories'),
            activePageIndex + 1
          )}
        >
          <AspectRatio ref={displayPageRef} aspect={1 / FULLBLEED_RATIO}>
            {pages[activePageIndex] && displayPageSize && (
              <UnitsProvider
                pageSize={{
                  height: displayPageSize.height,
                  width: displayPageSize.width,
                }}
              >
                <PreviewPage
                  page={pages[activePageIndex]}
                  pageSize={displayPageSize}
                  animationState={STORY_ANIMATION_STATE.PLAYING}
                />
              </UnitsProvider>
            )}
          </AspectRatio>
        </DisplayPage>
      </GalleryContainer>
    </ThemeProvider>
  );
}

CardGallery.propTypes = {
  story: StoryPropType.isRequired,
  isRTL: PropTypes.bool,
  galleryLabel: PropTypes.string.isRequired,
};

export default CardGallery;
