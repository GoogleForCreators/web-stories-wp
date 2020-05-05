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
import { useCallback, useRef, useEffect, useState, useMemo, memo } from 'react';
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../../app/config';
import { useMedia } from '../../../../app/media';
import { useMediaPicker } from '../../../mediaPicker';
import useIntersectionEffect from '../../../../utils/useIntersectionEffect';
import { MainButton, SearchInput } from '../../common';
import useLibrary from '../../useLibrary';
import { Pane } from '../shared';
import { DEFAULT_DPR, PAGE_WIDTH } from '../../../../constants';
import {
  getTypeFromMime,
  getResourceFromMediaPicker,
} from '../../../../app/media/utils';
import paneId from './paneId';
import VirtualList from './virtualList';

const FilterArea = styled.div`
  display: flex;
  margin-top: 30px;
`;

const FilterButtons = styled.div`
  flex: 1 1 auto;
`;

const FilterButton = styled.button`
  border: 0;
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

const Padding = styled.div`
  grid-area: header;
  padding: 1.5em 1.5em 0 1.5em;
`;

const StyledPane = styled(Pane)`
  height: 100%;
  padding: 0;
  overflow: hidden;
`;

const Inner = styled.div`
  height: 100%;
  display: grid;
  grid:
    'header   ' auto
    'infinitescroll' 1fr
    / 1fr;
`;

const FILTERS = [
  { filter: '', name: __('All', 'web-stories') },
  { filter: 'image', name: __('Images', 'web-stories') },
  { filter: 'video', name: __('Video', 'web-stories') },
];

// By default, the element should be 50% of the page.
const DEFAULT_ELEMENT_WIDTH = PAGE_WIDTH / 2;

function MediaPane(props) {
  const {
    state: {
      hasMore,
      media,
      isMediaLoading,
      isMediaLoaded,
      mediaType,
      searchTerm,
    },
    actions: { setNextPage, resetWithFetch, setMediaType, setSearchTerm },
  } = useMedia();

  const {
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      video: allowedVideoMimeTypes,
    },
  } = useConfig();

  const {
    actions: { insertElement },
  } = useLibrary();

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
   * Handle search term changes.
   *
   * @param {Object} evt Doc Event
   */
  const onSearch = (evt) => {
    setSearchTerm({ searchTerm: evt.target.value });
  };

  /**
   * Filter REST API calls and re-request API.
   *
   * @param {string} filter Value that is passed to rest api to filter.
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
  const insertMediaElement = (resource) => {
    const width = Math.min(resource.width * DEFAULT_DPR, DEFAULT_ELEMENT_WIDTH);
    return insertElement(resource.type, { resource, width });
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

  const resources = useMemo(() => media.filter(filterResource), [
    media,
    filterResource,
  ]);

  const loadNextPage = () => {
    if (!isMediaLoaded || isMediaLoading) {
      return;
    }
    if (!hasMore) {
      return;
    }

    setNextPage();
  };

  const [localScopeMedia, setLocalScopeMedia] = useState(false);

  return (
    <StyledPane id={paneId} {...props}>
      <div style={{ position: 'absolute', top: 0, zIndex: 9999999 }}>
        <button onClick={() => setLocalScopeMedia((v) => !v)}>
          {localScopeMedia ? 'Disable' : 'Enable'} localScopeMedia (not global)
        </button>
      </div>
      <Inner>
        <Padding>
          <SearchInput
            value={searchTerm}
            placeholder={__('Search', 'web-stories')}
            onChange={onSearch}
          />
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
        </Padding>

        <VirtualList
          resources={resources}
          loadNextPage={loadNextPage}
          localScopeMedia={localScopeMedia}
          insertMediaElement={insertMediaElement}
        />
      </Inner>
    </StyledPane>
  );
}

export default MediaPane;
