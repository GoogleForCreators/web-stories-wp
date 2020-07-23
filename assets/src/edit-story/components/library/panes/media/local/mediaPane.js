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
import { useFeature } from 'flagged';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import { useConfig } from '../../../../../app/config';
import { useLocalMedia } from '../../../../../app/media';
import { useMediaPicker } from '../../../../mediaPicker';
import useIntersectionEffect from '../../../../../utils/useIntersectionEffect';
import { MainButton, SearchInput } from '../../../common';
import useLibrary from '../../../useLibrary';
import {
  getResourceFromMediaPicker,
  getTypeFromMime,
} from '../../../../../app/media/utils';
import MediaElement from '../common/mediaElement';
import {
  MediaGalleryLoadingPill,
  MediaGalleryMessage,
  PaneHeader,
  PaneInner,
  SearchInputContainer,
  StyledPane,
} from '../common/styles';
import PaginatedMediaGallery from '../common/paginatedMediaGallery';
import { ProviderType } from '../common/providerType';
import Flags from '../../../../../flags';
import paneId from './paneId';

export const ROOT_MARGIN = 300;

const ColumnContainer = styled.div`
  grid-area: infinitescroll;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 1fr;
  overflow: auto;
  padding: 0 1.5em 0 1.5em;
  margin-top: 1em;
`;

const Column = styled.div`
  position: relative;
`;

const FilterArea = styled.div`
  display: flex;
  margin-top: 30px;
  padding: 0 1.5em 0 1.5em;
`;

const FilterButtons = styled.div`
  flex: 1 1 auto;
`;

const FilterButton = styled.button`
  border: 0;
  cursor: pointer;
  background: none;
  padding: 0;
  margin: 0 18px 0 0;
  color: ${({ theme, active }) =>
    active ? theme.colors.fg.v1 : theme.colors.mg.v1};
  font-family: ${({ theme }) => theme.fonts.label.family};
  font-size: ${({ theme }) => theme.fonts.label.size};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  line-height: ${({ theme }) => theme.fonts.label.lineHeight};
`;

const FILTERS = [
  { filter: '', name: __('All', 'web-stories') },
  { filter: 'image', name: __('Images', 'web-stories') },
  { filter: 'video', name: __('Video', 'web-stories') },
];

const PREVIEW_SIZE = 150;

function MediaPane(props) {
  const isRowBasedGallery = useFeature('rowBasedGallery');
  const {
    hasMore,
    media,
    isMediaLoading,
    isMediaLoaded,
    mediaType,
    searchTerm,
    setNextPage,
    resetWithFetch,
    setMediaType,
    setSearchTerm,
  } = useLocalMedia(
    ({
      state: {
        hasMore,
        media,
        isMediaLoading,
        isMediaLoaded,
        mediaType,
        searchTerm,
      },
      actions: { setNextPage, resetWithFetch, setMediaType, setSearchTerm },
    }) => {
      return {
        hasMore,
        media,
        isMediaLoading,
        isMediaLoaded,
        mediaType,
        searchTerm,
        setNextPage,
        resetWithFetch,
        setMediaType,
        setSearchTerm,
      };
    }
  );

  const {
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      video: allowedVideoMimeTypes,
    },
  } = useConfig();

  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  const onClose = resetWithFetch;

  /**
   * Callback of select in media picker to insert media element.
   *
   * @param {Object} mediaPickerEl Object coming from backbone media picker.
   */
  const onSelect = (mediaPickerEl) => {
    const resource = getResourceFromMediaPicker(mediaPickerEl);
    insertMediaElement(resource);
  };

  const openMediaPicker = useMediaPicker({
    onSelect,
    onClose,
  });

  /**
   * Filter REST API calls and re-request API.
   *
   * @param {string} value that is passed to rest api to filter.
   */
  const onFilter = useCallback(
    (filter) => () => {
      setMediaType({ mediaType: filter });
    },
    [setMediaType]
  );

  /**
   * Insert element such image, video and audio into the editor.
   *
   * @param {Object} resource Resource object
   * @return {null|*} Return onInsert or null.
   */
  const insertMediaElement = useCallback(
    (resource) => insertElement(resource.type, { resource }),
    [insertElement]
  );

  /**
   * Check if number is odd or even.
   *
   * @param {number} n Number
   * @return {boolean} Is even.
   */
  const isEven = (n) => {
    return n % 2 === 0;
  };

  const filterResource = useCallback(
    ({ mimeType, width, height }) => {
      const allowedMimeTypes = [
        ...allowedImageMimeTypes,
        ...allowedVideoMimeTypes,
      ];
      const filterByMimeTypeAllowed = allowedMimeTypes.includes(mimeType);
      const filterByMediaType = mediaType
        ? mediaType === getTypeFromMime(mimeType)
        : true;
      const filterByValidMedia = width && height;

      return filterByMimeTypeAllowed && filterByMediaType && filterByValidMedia;
    },
    [allowedImageMimeTypes, allowedVideoMimeTypes, mediaType]
  );

  const resources = media.filter(filterResource);

  // TODO(#1698): Ensure scrollbars auto-disappear in MacOS.

  // State and callback ref necessary to recalculate the padding of the list
  //  given the scrollbar width.
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const refContainer = useRef();
  const refCallbackContainer = (element) => {
    refContainer.current = element;
    if (!element) {
      return;
    }
    setScrollbarWidth(element.offsetWidth - element.clientWidth);
  };

  // Recalculates padding of Media Pane so it stays centered.
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

  // NOTE: This infinite scrolling logic is used by the Column-based gallery.
  // The row-based PaginatedMediaGallery has its own pagination logic and
  // doesn't get affected by this code (it doesn't have `refContainerFooter`).
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
      if (!isMediaLoaded || isMediaLoading) {
        return;
      }
      if (!hasMore) {
        return;
      }
      if (!entry.isIntersecting) {
        return;
      }
      setNextPage();
    },
    [hasMore, isMediaLoading, isMediaLoaded, setNextPage]
  );

  const onSearch = (v) => setSearchTerm({ searchTerm: v });

  const incrementalSearchDebounceMedia = useFeature(
    Flags.INCREMENTAL_SEARCH_DEBOUNCE_MEDIA
  );

  const mediaLibrary = isRowBasedGallery ? (
    // Arranges elements in rows.
    <PaginatedMediaGallery
      providerType={ProviderType.LOCAL}
      resources={resources}
      isMediaLoading={isMediaLoading}
      isMediaLoaded={isMediaLoaded}
      hasMore={hasMore}
      onInsert={insertMediaElement}
      setNextPage={setNextPage}
    />
  ) : (
    // Arranges elements in columns.
    <ColumnContainer data-testid="mediaLibrary" ref={refCallbackContainer}>
      <Column>
        {resources
          .filter((_, index) => isEven(index))
          .map((resource, i) => (
            <MediaElement
              index={i}
              resource={resource}
              key={i}
              width={PREVIEW_SIZE}
              onInsert={insertMediaElement}
            />
          ))}
      </Column>
      <Column>
        {resources
          .filter((_, index) => !isEven(index))
          .map((resource, i) => (
            <MediaElement
              index={i}
              resource={resource}
              key={i}
              width={PREVIEW_SIZE}
              onInsert={insertMediaElement}
            />
          ))}
      </Column>
      {hasMore && (
        <MediaGalleryLoadingPill ref={refContainerFooter}>
          {__('Loading…', 'web-stories')}
        </MediaGalleryLoadingPill>
      )}
    </ColumnContainer>
  );

  return (
    <StyledPane id={paneId} {...props}>
      <PaneInner>
        <PaneHeader>
          <SearchInputContainer>
            <SearchInput
              initialValue={searchTerm}
              placeholder={__('Search', 'web-stories')}
              onSearch={onSearch}
              incrementala={incrementalSearchDebounceMedia}
            />
          </SearchInputContainer>
          <FilterArea>
            <FilterButtons>
              {FILTERS.map(({ filter, name }, index) => (
                <FilterButton
                  key={index}
                  active={filter === mediaType}
                  onClick={onFilter(filter)}
                >
                  {name}
                </FilterButton>
              ))}
            </FilterButtons>
            <MainButton onClick={openMediaPicker}>
              {__('Upload', 'web-stories')}
            </MainButton>
          </FilterArea>
        </PaneHeader>

        {isMediaLoaded && !media.length ? (
          <MediaGalleryMessage>
            {__('No media found', 'web-stories')}
          </MediaGalleryMessage>
        ) : (
          mediaLibrary
        )}
      </PaneInner>
    </StyledPane>
  );
}

export default MediaPane;
