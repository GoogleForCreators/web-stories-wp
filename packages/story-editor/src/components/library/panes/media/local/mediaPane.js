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
import { useCallback, useEffect } from '@googleforcreators/react';
import styled from 'styled-components';
import { __, _n, sprintf } from '@googleforcreators/i18n';
import { trackEvent } from '@googleforcreators/tracking';
import {
  Button as DefaultButton,
  ButtonSize,
  ButtonType,
  ButtonVariant,
  Text,
  TextSize,
  Icons,
  Placement,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../../../app/config';
import { useLocalMedia } from '../../../../../app/media';
import { SearchInput } from '../../../common';
import { MediaUploadButton, Select } from '../../../../form';
import {
  MediaGalleryMessage,
  PaneHeader,
  PaneInner,
  SearchInputContainer,
  StyledPane,
} from '../common/styles';
import PaginatedMediaGallery from '../common/paginatedMediaGallery';
import { PANE_PADDING } from '../../shared';
import { LOCAL_MEDIA_TYPE_ALL } from '../../../../../app/media/local/types';
import { focusStyle } from '../../../../panels/shared/styles';
import Tooltip from '../../../../tooltip';
import useOnMediaSelect from './useOnMediaSelect';
import paneId from './paneId';
import VideoOptimizationDialog from './videoOptimizationDialog';
import LinkInsertion from './hotlink';
import MediaRecording from './mediaRecording';

export const ROOT_MARGIN = 300;

const Button = styled(DefaultButton)`
  ${focusStyle};
`;

const FilterArea = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  padding: 0 ${PANE_PADDING} 0 ${PANE_PADDING};
`;

const SearchCount = styled(Text.Paragraph).attrs({
  size: TextSize.Medium,
})`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const FILTER_NONE = LOCAL_MEDIA_TYPE_ALL;
const FILTERS = [
  { value: FILTER_NONE, label: __('All Types', 'web-stories') },
  { value: 'image', label: __('Images', 'web-stories') },
  { value: 'video', label: __('Video', 'web-stories') },
];

function MediaPane(props) {
  const {
    hasMore,
    media,
    uploadingMedia,
    isMediaLoading,
    isMediaLoaded,
    mediaType,
    searchTerm,
    setNextPage,
    setMediaType,
    setSearchTerm,
    totalItems,
  } = useLocalMedia(
    ({
      state: {
        hasMore,
        media,
        uploadingMedia,
        isMediaLoading,
        isMediaLoaded,
        mediaType,
        searchTerm,
        totalItems,
      },
      actions: { setNextPage, setMediaType, setSearchTerm },
    }) => {
      return {
        hasMore,
        media,
        // If the media library is empty and we're still loading new items,
        // do not display uploading items either for better UX.
        uploadingMedia: !media.length && isMediaLoading ? [] : uploadingMedia,
        isMediaLoading,
        isMediaLoaded,
        mediaType,
        searchTerm,
        totalItems,
        setNextPage,
        setMediaType,
        setSearchTerm,
      };
    }
  );

  const {
    capabilities: { hasUploadMediaAction },
  } = useConfig();

  const isSearching = searchTerm.length > 0;

  /**
   * Filter REST API calls and re-request API.
   *
   * @param {string} value that is passed to rest api to filter.
   */
  const onFilter = useCallback(
    (evt, filter) => {
      setMediaType({ mediaType: filter });
    },
    [setMediaType]
  );

  const { onSelect, insertMediaElement } = useOnMediaSelect();

  const onSearch = (value) => {
    const trimText = value.trim();
    if (trimText !== searchTerm) {
      setSearchTerm({ searchTerm: trimText });
    }
  };

  useEffect(() => {
    if (searchTerm.length > 0) {
      trackEvent('search', {
        search_type: 'media',
        search_term: searchTerm,
        search_filter: mediaType,
      });
    }
  }, [searchTerm, mediaType]);

  const renderUploadButtonIcon = useCallback(
    (open) => (
      <Button
        variant={ButtonVariant.Square}
        type={ButtonType.Secondary}
        size={ButtonSize.Small}
        onClick={open}
        aria-label={__('Upload', 'web-stories')}
      >
        <Icons.ArrowCloud />
      </Button>
    ),
    []
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
            />
          </SearchInputContainer>
          <FilterArea>
            <Select
              selectedValue={mediaType?.toString() || FILTER_NONE}
              onMenuItemClick={onFilter}
              options={FILTERS}
              placement={Placement.BottomStart}
            />
            {isSearching && media.length > 0 && (
              <SearchCount>
                {sprintf(
                  /* translators: %d: number of results. */
                  _n(
                    '%s result found.',
                    '%s results found.',
                    totalItems,
                    'web-stories'
                  ),
                  totalItems
                )}
              </SearchCount>
            )}
            {!isSearching && (
              <ButtonsWrapper>
                {/* MediaRecording already checks for permissions */}
                <MediaRecording />
                <LinkInsertion />
                {hasUploadMediaAction && (
                  <Tooltip title={__('Upload', 'web-stories')}>
                    <MediaUploadButton
                      renderButton={renderUploadButtonIcon}
                      onInsert={onSelect}
                    />
                  </Tooltip>
                )}
              </ButtonsWrapper>
            )}
          </FilterArea>
        </PaneHeader>

        {isMediaLoaded && !media.length && !uploadingMedia.length ? (
          <MediaGalleryMessage>
            {isSearching
              ? __('No results found.', 'web-stories')
              : __('No media found.', 'web-stories')}
          </MediaGalleryMessage>
        ) : (
          <PaginatedMediaGallery
            providerType="local"
            canEditMedia={hasUploadMediaAction}
            resources={media}
            uploadingResources={uploadingMedia}
            isMediaLoading={isMediaLoading}
            isMediaLoaded={isMediaLoaded}
            hasMore={hasMore}
            onInsert={insertMediaElement}
            setNextPage={setNextPage}
            searchTerm={searchTerm}
          />
        )}
        <VideoOptimizationDialog />
      </PaneInner>
    </StyledPane>
  );
}

export default MediaPane;
