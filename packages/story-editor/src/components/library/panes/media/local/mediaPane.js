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
import { useCallback, useEffect, useMemo } from '@web-stories-wp/react';
import styled from 'styled-components';
import {
  __,
  _n,
  sprintf,
  translateToExclusiveList,
} from '@web-stories-wp/i18n';
import { trackEvent } from '@web-stories-wp/tracking';
import { resourceList, canTranscodeResource } from '@web-stories-wp/media';
import {
  Button as DefaultButton,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Text,
  THEME_CONSTANTS,
  useSnackbar,
  Icons,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../../../app/config';
import { useLocalMedia } from '../../../../../app/media';
import { SearchInput } from '../../../common';
import useLibrary from '../../../useLibrary';
import { Select } from '../../../../form';
import {
  MediaGalleryMessage,
  PaneHeader,
  PaneInner,
  SearchInputContainer,
  StyledPane,
} from '../common/styles';
import PaginatedMediaGallery from '../common/paginatedMediaGallery';
import Flags from '../../../../../flags';
import { Placement } from '../../../../popup/constants';
import { PANE_PADDING } from '../../shared';
import { LOCAL_MEDIA_TYPE_ALL } from '../../../../../app/media/local/types';
import { focusStyle } from '../../../../panels/shared';
import useFFmpeg from '../../../../../app/media/utils/useFFmpeg';
import Tooltip from '../../../../tooltip';
import paneId from './paneId';
import VideoOptimizationDialog from './videoOptimizationDialog';
import LinkInsertion from './hotlink';

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

const SearchCount = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.MEDIUM,
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
    isMediaLoading,
    isMediaLoaded,
    mediaType,
    searchTerm,
    setNextPage,
    resetWithFetch,
    setMediaType,
    setSearchTerm,
    postProcessingResource,
    totalItems,
    optimizeVideo,
    optimizeGif,
  } = useLocalMedia(
    ({
      state: {
        hasMore,
        media,
        isMediaLoading,
        isMediaLoaded,
        mediaType,
        searchTerm,
        totalItems,
      },
      actions: {
        setNextPage,
        resetWithFetch,
        setMediaType,
        setSearchTerm,
        postProcessingResource,
        optimizeVideo,
        optimizeGif,
      },
    }) => {
      return {
        hasMore,
        media,
        isMediaLoading,
        isMediaLoaded,
        mediaType,
        searchTerm,
        totalItems,
        setNextPage,
        resetWithFetch,
        setMediaType,
        setSearchTerm,
        postProcessingResource,
        optimizeVideo,
        optimizeGif,
      };
    }
  );

  const { showSnackbar } = useSnackbar();
  const enableHotlinking = useFeature('enableHotlinking');

  const {
    allowedTranscodableMimeTypes,
    allowedFileTypes,
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      video: allowedVideoMimeTypes,
    },
    capabilities: { hasUploadMediaAction },
    MediaUpload,
  } = useConfig();

  const { isTranscodingEnabled } = useFFmpeg();

  const allowedMimeTypes = useMemo(() => {
    if (isTranscodingEnabled) {
      return [
        ...allowedTranscodableMimeTypes,
        ...allowedImageMimeTypes,
        ...allowedVideoMimeTypes,
      ];
    }
    return [...allowedImageMimeTypes, ...allowedVideoMimeTypes];
  }, [
    allowedImageMimeTypes,
    allowedVideoMimeTypes,
    isTranscodingEnabled,
    allowedTranscodableMimeTypes,
  ]);

  const transcodableMimeTypes = useMemo(() => {
    return allowedTranscodableMimeTypes.filter(
      (x) => !allowedVideoMimeTypes.includes(x)
    );
  }, [allowedTranscodableMimeTypes, allowedVideoMimeTypes]);

  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  const isSearching = searchTerm.length > 0;

  const onClose = resetWithFetch;

  /**
   * Callback of select in media picker to insert media element.
   *
   * @param {Object} resource Object coming from backbone media picker.
   */
  const onSelect = (resource) => {
    try {
      if (isTranscodingEnabled && canTranscodeResource(resource)) {
        if (transcodableMimeTypes.includes(resource.mimeType)) {
          optimizeVideo({ resource });
        }

        if (resource.mimeType === 'image/gif') {
          optimizeGif({ resource });
        }
      }
      // WordPress media picker event, sizes.medium.source_url is the smallest image
      insertMediaElement(
        resource,
        resource.sizes?.medium?.source_url || resource.src
      );

      postProcessingResource(resource);
    } catch (e) {
      showSnackbar({
        message: e.message,
        dismissible: true,
      });
    }
  };

  let onSelectErrorMessage = __(
    'No file types are currently supported.',
    'web-stories'
  );
  if (allowedFileTypes.length) {
    onSelectErrorMessage = sprintf(
      /* translators: %s: list of allowed file types. */
      __('Please choose only %s to insert into page.', 'web-stories'),
      translateToExclusiveList(allowedFileTypes)
    );
  }

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

  /**
   * Insert element such image, video and audio into the editor.
   *
   * @param {Object} resource Resource object
   * @param {string} thumbnailURL The thumbnail's url
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

  const incrementalSearchDebounceMedia = useFeature(
    Flags.INCREMENTAL_SEARCH_DEBOUNCE_MEDIA
  );

  const renderUploadButtonIcon = useCallback(
    (open) => (
      <Button
        variant={BUTTON_VARIANTS.SQUARE}
        type={BUTTON_TYPES.SECONDARY}
        size={BUTTON_SIZES.SMALL}
        onClick={open}
        aria-label={__('Upload', 'web-stories')}
      >
        <Icons.ArrowCloud />
      </Button>
    ),
    []
  );

  const renderUploadButton = useCallback(
    (open) => (
      <Button
        variant={BUTTON_VARIANTS.RECTANGLE}
        type={BUTTON_TYPES.SECONDARY}
        size={BUTTON_SIZES.SMALL}
        onClick={open}
      >
        {__('Upload', 'web-stories')}
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
              incremental={incrementalSearchDebounceMedia}
            />
          </SearchInputContainer>
          <FilterArea>
            <Select
              selectedValue={mediaType?.toString() || FILTER_NONE}
              onMenuItemClick={onFilter}
              options={FILTERS}
              placement={Placement.BOTTOM_START}
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
            {!isSearching && enableHotlinking && (
              <ButtonsWrapper>
                <LinkInsertion />
                {hasUploadMediaAction && (
                  <Tooltip title={__('Upload', 'web-stories')}>
                    <MediaUpload
                      onSelect={onSelect}
                      onSelectErrorMessage={onSelectErrorMessage}
                      onClose={onClose}
                      type={allowedMimeTypes}
                      render={renderUploadButtonIcon}
                    />
                  </Tooltip>
                )}
              </ButtonsWrapper>
            )}
            {!isSearching && !enableHotlinking && hasUploadMediaAction && (
              <MediaUpload
                onSelect={onSelect}
                onSelectErrorMessage={onSelectErrorMessage}
                onClose={onClose}
                type={allowedMimeTypes}
                render={renderUploadButton}
              />
            )}
          </FilterArea>
        </PaneHeader>

        {isMediaLoaded && !media.length ? (
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
