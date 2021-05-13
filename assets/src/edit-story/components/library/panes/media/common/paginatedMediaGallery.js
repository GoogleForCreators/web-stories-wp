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
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { __ } from '@web-stories-wp/i18n';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { PROVIDERS } from '../../../../../app/media/media3p/providerConfiguration';
import { Text, THEME_CONSTANTS } from '../../../../../../design-system';
import MediaGallery from './mediaGallery';
import {
  MediaGalleryContainer,
  MediaGalleryInnerContainer,
  MediaGalleryLoadingPill,
  MediaGalleryMessage,
} from './styles';

const ROOT_MARGIN = 300;

const SHOW_LOADING_PILL_DELAY_MS = 1000;

const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

function PaginatedMediaGallery({
  providerType,
  resources,
  searchTerm,
  selectedCategoryId,
  isMediaLoading,
  isMediaLoaded,
  hasMore,
  onInsert,
  setNextPage,
}) {
  // State and callback ref necessary to load on scroll.
  const refContainer = useRef();

  const loadNextPageIfNeeded = useCallback(() => {
    const node = refContainer.current;
    if (
      !resources.length ||
      !node ||
      // This condition happens when the component is hidden, and causes the
      // calculation below to load a new page in error.
      node.clientHeight === 0 ||
      !hasMore ||
      !isMediaLoaded ||
      isMediaLoading
    ) {
      return;
    }

    // Load the next page if we are "close" (by a length of ROOT_MARGIN) to the
    // bottom of of the container.
    const bottom =
      node.scrollHeight - node.scrollTop <= node.clientHeight + ROOT_MARGIN;
    if (bottom) {
      setNextPage();
      return;
    }

    // Load the next page if the page isn't full, ie. scrollbar is not visible.
    if (node.clientHeight === node.scrollHeight) {
      setNextPage();
      return;
    }
  }, [resources, hasMore, isMediaLoaded, isMediaLoading, setNextPage]);

  // Scroll to the top when the searchTerm or selected category changes.
  useEffect(() => {
    refContainer.current?.scrollTo(0, 0);
  }, [searchTerm, selectedCategoryId]);

  // After scroll or resize, see if we need the load the next page.
  const [handleScrollOrResize] = useDebouncedCallback(
    loadNextPageIfNeeded,
    500,
    [loadNextPageIfNeeded]
  );

  // After loading a next page, see if we need to load another,
  // ie. when the page of results isn't full.
  useLayoutEffect(() => {
    //eslint-disable-next-line @wordpress/react-no-unsafe-timeout
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    async function loadNextPageIfNeededAfterGalleryRendering() {
      // Wait for <Gallery> to finish its render layout cycles first.
      await sleep(200);

      loadNextPageIfNeeded();
    }
    loadNextPageIfNeededAfterGalleryRendering();
  }, [loadNextPageIfNeeded]);

  useEffect(() => {
    const node = refContainer.current;
    if (!node) {
      return undefined;
    }

    // When the user scrolls or resizes (debounced).
    node.addEventListener('scroll', handleScrollOrResize);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      node.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [handleScrollOrResize]);

  const mediaGallery =
    isMediaLoaded && resources.length === 0 ? (
      <MediaGalleryMessage>
        {__('No media found', 'web-stories')}
      </MediaGalleryMessage>
    ) : (
      <div style={{ marginBottom: 15 }}>
        <MediaGallery
          providerType={providerType}
          resources={resources}
          onInsert={onInsert}
        />
      </div>
    );

  const [showLoadingPill, setShowLoadingPill] = useState(false);

  useEffect(() => {
    if (isMediaLoading && hasMore) {
      const showLoadingTimeout = setTimeout(() => {
        setShowLoadingPill(isMediaLoading);
      }, SHOW_LOADING_PILL_DELAY_MS);
      return () => clearTimeout(showLoadingTimeout);
    }
    setShowLoadingPill(false);
    return undefined;
  }, [isMediaLoading, hasMore]);

  const attribution =
    providerType !== 'local' &&
    PROVIDERS[providerType].attributionComponent &&
    PROVIDERS[providerType].attributionComponent();

  return (
    <>
      <MediaGalleryContainer
        data-testid="media-gallery-container"
        ref={refContainer}
      >
        <MediaGalleryInnerContainer>{mediaGallery}</MediaGalleryInnerContainer>
      </MediaGalleryContainer>
      {showLoadingPill && (
        <MediaGalleryLoadingPill data-testid={'loading-pill'}>
          <StyledText
            forwardedAs="span"
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
          >
            {__('Loading…', 'web-stories')}
          </StyledText>
        </MediaGalleryLoadingPill>
      )}
      {!showLoadingPill && attribution}
    </>
  );
}

PaginatedMediaGallery.propTypes = {
  providerType: PropTypes.string.isRequired,
  resources: PropTypes.arrayOf(PropTypes.object).isRequired,
  isMediaLoading: PropTypes.bool.isRequired,
  isMediaLoaded: PropTypes.bool.isRequired,
  hasMore: PropTypes.bool.isRequired,
  onInsert: PropTypes.func.isRequired,
  setNextPage: PropTypes.func.isRequired,
  searchTerm: PropTypes.string,
  selectedCategoryId: PropTypes.string,
};

export default PaginatedMediaGallery;
