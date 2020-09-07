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
import { useCallback } from 'react';
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
import { SearchInput } from '../../../common';
import { Primary } from '../../../../button';
import useLibrary from '../../../useLibrary';
import {
  getResourceFromMediaPicker,
  getTypeFromMime,
} from '../../../../../app/media/utils';
import {
  MediaGalleryMessage,
  PaneHeader,
  PaneInner,
  SearchInputContainer,
  StyledPane,
} from '../common/styles';
import PaginatedMediaGallery from '../common/paginatedMediaGallery';
import Flags from '../../../../../flags';
import resourceList from '../../../../../utils/resourceList';
import { DropDown } from '../../../../form';
import paneId from './paneId';

export const ROOT_MARGIN = 300;

const FilterArea = styled.div`
  display: flex;
  margin-top: 30px;
  padding: 0 1.5em 0 1.5em;
`;

const FILTERS = [
  { value: '', name: __('All', 'web-stories') },
  { value: 'image', name: __('Images', 'web-stories') },
  { value: 'video', name: __('Video', 'web-stories') },
];

function MediaPane(props) {
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
    // WordPress media picker event, sizes.medium.url is the smallest image
    insertMediaElement(resource, mediaPickerEl.sizes.medium.url);
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
    (filter) => {
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
    (resource, thumbnailURL) => {
      resourceList.set(resource.id, {
        url: thumbnailURL,
        type: 'cached',
      });
      insertElement(resource.type, { resource });
    },
    [insertElement]
  );

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

  const onSearch = (v) => setSearchTerm({ searchTerm: v });

  const incrementalSearchDebounceMedia = useFeature(
    Flags.INCREMENTAL_SEARCH_DEBOUNCE_MEDIA
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
            <DropDown
              value={mediaType?.toString() || FILTERS[0].value}
              onChange={onFilter}
              options={FILTERS}
            />
            <Primary onClick={openMediaPicker}>
              {__('Upload', 'web-stories')}
            </Primary>
          </FilterArea>
        </PaneHeader>

        {isMediaLoaded && !media.length ? (
          <MediaGalleryMessage>
            {__('No media found', 'web-stories')}
          </MediaGalleryMessage>
        ) : (
          <PaginatedMediaGallery
            providerType={'local'}
            resources={resources}
            isMediaLoading={isMediaLoading}
            isMediaLoaded={isMediaLoaded}
            hasMore={hasMore}
            onInsert={insertMediaElement}
            setNextPage={setNextPage}
            searchTerm={searchTerm}
          />
        )}
      </PaneInner>
    </StyledPane>
  );
}

export default MediaPane;
