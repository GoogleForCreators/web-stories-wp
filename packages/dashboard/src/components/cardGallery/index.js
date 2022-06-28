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
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from '@googleforcreators/react';
import { __, sprintf } from '@googleforcreators/i18n';
import { useGridViewKeys, Image } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import {
  DEFAULT_GRID_IMG_HEIGHT,
  DEFAULT_GRID_IMG_WIDTH,
} from '../../constants';
import {
  GalleryContainer,
  ThumbnailButton,
  Thumbnails,
  DisplayPage,
} from './components';

function getPosterAltCopy(pageNumber) {
  return sprintf(
    /* translators: %s: page number. */
    __('Poster of template page %s', 'web-stories'),
    pageNumber
  );
}

function CardGallery({ galleryPosters, isRTL, galleryLabel }) {
  const [selectedGridItemIndex, setSelectedGridItemIndex] = useState(0);
  const [focusedGridItemIndex, setFocusedGridItemIndex] = useState();
  const containerRef = useRef();
  const gridRef = useRef();
  const posterRefs = useRef({});

  const handleMiniCardClick = useCallback((index) => {
    setSelectedGridItemIndex(index);
    setFocusedGridItemIndex(index);
  }, []);

  const handleGalleryItemFocus = useCallback((index) => {
    setFocusedGridItemIndex(index);
  }, []);

  useEffect(() => {
    // Reset state when posters update
    if (galleryPosters) {
      setSelectedGridItemIndex(0);
      setFocusedGridItemIndex();
    }
  }, [galleryPosters]);

  useGridViewKeys({
    containerRef,
    gridRef,
    itemRefs: posterRefs,
    isRTL,
    currentItemId: focusedGridItemIndex,
    items: galleryPosters,
  });

  const GalleryItems = useMemo(() => {
    return galleryPosters.map((poster, index) => {
      const key = `gallery_item_${index}`;
      const pageNumber = index + 1;
      // If there's not a focused index we want to fall back to the selected grid item
      const isFocusIndex = focusedGridItemIndex
        ? focusedGridItemIndex === index
        : selectedGridItemIndex === index;

      return (
        <div
          key={key}
          ref={(el) => {
            posterRefs.current[index] = el;
          }}
          onFocus={() => handleGalleryItemFocus(index)}
        >
          <ThumbnailButton
            $isSelected={selectedGridItemIndex === index}
            tabIndex={isFocusIndex ? 0 : -1}
            onClick={() => handleMiniCardClick(index)}
            aria-label={
              selectedGridItemIndex === index
                ? sprintf(
                    /* translators: %s: page number. */
                    __('Page %s (current page)', 'web-stories'),
                    pageNumber
                  )
                : sprintf(
                    /* translators: %s: page number. */
                    __('Page %s', 'web-stories'),
                    pageNumber
                  )
            }
          >
            <picture>
              <source srcSet={poster.webp} type="image/webp" />
              <source srcSet={poster.png} type="image/png" />
              <Image
                src={poster.png}
                alt={getPosterAltCopy(pageNumber)}
                width={DEFAULT_GRID_IMG_WIDTH}
                height={DEFAULT_GRID_IMG_HEIGHT}
              />
            </picture>
          </ThumbnailButton>
        </div>
      );
    });
  }, [
    galleryPosters,
    selectedGridItemIndex,
    focusedGridItemIndex,
    handleGalleryItemFocus,
    handleMiniCardClick,
  ]);

  return (
    <GalleryContainer ref={containerRef}>
      <Thumbnails
        ref={gridRef}
        role="group"
        aria-label={galleryLabel}
        data-testid="mini-cards-container"
      >
        {GalleryItems}
      </Thumbnails>
      <DisplayPage>
        {galleryPosters[selectedGridItemIndex] && (
          <picture>
            <source
              srcSet={galleryPosters[selectedGridItemIndex].webp}
              type="image/webp"
            />
            <source
              srcSet={galleryPosters[selectedGridItemIndex].png}
              type="image/png"
            />
            <Image
              src={galleryPosters[selectedGridItemIndex].png}
              alt={sprintf(
                /* translators: %s: active preview page number */
                __('Active Page Preview - Page %s', 'web-stories'),
                selectedGridItemIndex + 1
              )}
              width={DEFAULT_GRID_IMG_WIDTH}
              height={DEFAULT_GRID_IMG_HEIGHT}
            />
          </picture>
        )}
      </DisplayPage>
    </GalleryContainer>
  );
}

CardGallery.propTypes = {
  galleryPosters: PropTypes.arrayOf(
    PropTypes.shape({
      png: PropTypes.string,
      webp: PropTypes.string,
      id: PropTypes.number,
    })
  ).isRequired,
  isRTL: PropTypes.bool,
  galleryLabel: PropTypes.string.isRequired,
};

export default CardGallery;
