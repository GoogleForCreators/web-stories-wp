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
import React, { memo, useLayoutEffect, useRef, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import MediaGallery from '../common/mediaGallery';
import useIntersectionEffect from '../../../../../utils/useIntersectionEffect';
import {
  MediaGalleryContainer,
  MediaGalleryInnerContainer,
  MediaGalleryLoadingPill,
  MediaGalleryMessage,
} from '../common/styles';

const ROOT_MARGIN = 300;

function PaginatedMediaGallery({
  providerType,
  resources,
  isMediaLoading,
  isMediaLoaded,
  hasMore,
  onInsert,
  setNextPage,
}) {
  // TODO(#1698): Ensure scrollbars auto-disappear in MacOS.
  // State and callback ref necessary to recalculate the padding of the list
  // given the scrollbar width.
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const refContainer = useRef();
  const refCallbackContainer = (element) => {
    refContainer.current = element;
    if (!element) {
      return;
    }
    setScrollbarWidth(element.offsetWidth - element.clientWidth);
  };

  // Recalculates padding so that it stays centered.
  // As of May 2020 this cannot be achieved without js (as the scrollbar-gutter
  // prop is not yet ready).
  useLayoutEffect(() => {
    if (!scrollbarWidth) {
      return;
    }
    const currentPaddingLeft = parseFloat(
      window
        .getComputedStyle(refContainer.current, null)
        .getPropertyValue('padding-left')
    );
    refContainer.current.style['padding-right'] =
      currentPaddingLeft - scrollbarWidth + 'px';
  }, [scrollbarWidth, refContainer]);

  const refContainerFooter = useRef();
  useIntersectionEffect(
    refContainerFooter,
    {
      root: refContainer,
      // This rootMargin is added so that we load an extra page when the
      // "loading" footer is "close" to the bottom of the container, even if
      // it's not yet visible.
      rootMargin: `0px 0px ${ROOT_MARGIN}px 0px`,
    },
    (entry) => {
      if (
        !isMediaLoaded ||
        isMediaLoading ||
        !hasMore ||
        !entry.isIntersecting
      ) {
        return;
      }
      setNextPage();
    },
    [hasMore, isMediaLoading, isMediaLoaded, setNextPage]
  );

  const mediaGallery =
    isMediaLoaded && resources.length === 0 ? (
      <MediaGalleryMessage>
        {__('No media found', 'web-stories')}
      </MediaGalleryMessage>
    ) : (
      <>
        <div style={{ marginBottom: 15 }}>
          <MediaGallery
            providerType={providerType}
            resources={resources}
            onInsert={onInsert}
          />
        </div>
        {hasMore && (
          <MediaGalleryLoadingPill ref={refContainerFooter}>
            {__('Loading…', 'web-stories')}
          </MediaGalleryLoadingPill>
        )}
      </>
    );

  return (
    <MediaGalleryContainer
      data-testid="media-gallery-container"
      ref={refCallbackContainer}
    >
      <MediaGalleryInnerContainer>{mediaGallery}</MediaGalleryInnerContainer>
    </MediaGalleryContainer>
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
};

export default memo(PaginatedMediaGallery);
