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
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  __,
  _n,
  sprintf,
  translateToExclusiveList,
} from '@web-stories-wp/i18n';
import { trackEvent } from '@web-stories-wp/tracking';
import { resourceList } from '@web-stories-wp/media';
import {
  Button as DefaultButton,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Text,
  THEME_CONSTANTS,
  useSnackbar,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../../../app/config';
import { useLocalMedia } from '../../../../../app/media';
import { useMediaPicker } from '../../../../mediaPicker';
import { SearchInput } from '../../../common';
import useLibrary from '../../../useLibrary';
import { Select } from '../../../../form';
import { getResourceFromMediaPicker } from '../../../../../app/media/utils';
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
import MissingUploadPermissionDialog from './missingUploadPermissionDialog';
import paneId from './paneId';
import VideoOptimizationDialog from './videoOptimizationDialog';

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
    uploadVideoPoster,
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
        uploadVideoPoster,
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
        uploadVideoPoster,
        optimizeVideo,
        optimizeGif,
      };
    }
  );

  const { showSnackbar } = useSnackbar();
  const isGifOptimizationEnabled = useFeature('enableGifOptimization');

  const {
    allowedTranscodableMimeTypes,
    allowedFileTypes,
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      video: allowedVideoMimeTypes,
    },
    capabilities: { hasUploadMediaAction },
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

  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);

  const isSearching = searchTerm.length > 0;

  const onClose = resetWithFetch;

  /**
   * Callback of select in media picker to insert media element.
   *
   * @param {Object} mediaPickerEl Object coming from backbone media picker.
   */
  const onSelect = (mediaPickerEl) => {
    const resource = getResourceFromMediaPicker(mediaPickerEl);
    try {
      if (isTranscodingEnabled) {
        if (transcodableMimeTypes.includes(resource.mimeType)) {
          optimizeVideo({ resource });
        }

        if (isGifOptimizationEnabled && resource.mimeType === 'image/gif') {
          optimizeGif({ resource });
        }
      }
      // WordPress media picker event, sizes.medium.url is the smallest image
      insertMediaElement(
        resource,
        mediaPickerEl.sizes?.medium?.url || mediaPickerEl.url
      );

      if (
        !resource.posterId &&
        !resource.local &&
        (allowedVideoMimeTypes.includes(resource.mimeType) ||
          resource.type === 'gif')
      ) {
        // Upload video poster and update media element afterwards, so that the
        // poster will correctly show up in places like the Accessibility panel.
        uploadVideoPoster(resource.id, mediaPickerEl.url);
      }
    } catch (e) {
      showSnackbar({
        message: e.message,
        dismissable: true,
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

  const openMediaPicker = useMediaPicker({
    onSelect,
    onSelectErrorMessage,
    onClose,
    type: allowedMimeTypes,
    onPermissionError: () => setIsPermissionDialogOpen(true),
  });

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
    trackEvent('search', {
      search_type: 'media',
      search_term: searchTerm,
      search_filter: mediaType,
    });
  }, [searchTerm, mediaType]);

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
            {!isSearching && (
              <Button
                variant={BUTTON_VARIANTS.RECTANGLE}
                type={BUTTON_TYPES.SECONDARY}
                size={BUTTON_SIZES.SMALL}
                onClick={openMediaPicker}
              >
                {__('Upload', 'web-stories')}
              </Button>
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

        <MissingUploadPermissionDialog
          isOpen={isPermissionDialogOpen}
          onClose={() => setIsPermissionDialogOpen(false)}
        />
        <VideoOptimizationDialog />
      </PaneInner>
    </StyledPane>
  );
}

export default MediaPane;
