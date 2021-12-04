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
import styled, { css } from 'styled-components';
import { useCallback } from '@web-stories-wp/react';
import { __ } from '@web-stories-wp/i18n';
import { resourceList } from '@web-stories-wp/media';
import { Headline, THEME_CONSTANTS } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import PaginatedMediaGallery from '../common/paginatedMediaGallery';
import useMedia from '../../../../../app/media/useMedia';
import { PROVIDERS } from '../../../../../app/media/media3p/providerConfiguration';
import useMedia3pApi from '../../../../../app/media/media3p/api/useMedia3pApi';
import { useStory } from '../../../../../app/story';
import useLibrary from '../../../useLibrary';
import { ChipGroup } from '../../shared';
import { getMediaBaseColor } from '../../../../../utils/getMediaBaseColor';

const MediaSubheading = styled(Headline).attrs(() => ({
  as: 'h2',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XX_SMALL,
}))`
  margin-top: 24px;
  padding: 0 24px;
  ${(props) => props.shouldDisplay || 'display: none;'}
`;

const ProviderWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100px;
  max-width: 100%;
  top: 0;
  left: 0;
  ${({ hidden }) =>
    hidden &&
    css`
      position: absolute;
      visibility: hidden;
    `}
`;

function ProviderPanel({ providerType, isActive, searchTerm, ...rest }) {
  const { updateElementsByResourceId } = useStory(({ actions }) => ({
    updateElementsByResourceId: actions.updateElementsByResourceId,
  }));

  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  const {
    actions: { registerUsage },
  } = useMedia3pApi();

  /**
   * If the resource has a register usage url then the fact that it's been
   * inserted needs to be registered as per API provider policies.
   *
   * @param {Object} resource The resource to attempt to register usage.
   */
  const handleRegisterUsage = useCallback(
    (resource) => {
      if (resource?.attribution?.registerUsageUrl) {
        registerUsage({
          registerUsageUrl: resource.attribution.registerUsageUrl,
        });
      }
    },
    [registerUsage]
  );

  // Update the base color for an existing media3p resource on the page.
  // Like useDetectBaseColor, but without updating the local media library.
  const updateBaseColor = useCallback(
    async (resource) => {
      const { id, type, src, poster, baseColor } = resource;
      const imageSrc = type === 'image' ? src : poster;
      if (!imageSrc) {
        return;
      }
      try {
        const color = await getMediaBaseColor(imageSrc);
        const properties = ({ resource: prevResource }) => ({
          resource: {
            ...prevResource,
            baseColor: color,
          },
        });
        updateElementsByResourceId({ id, properties });
      } catch (error) {
        // Do nothing for now.
      }
    },
    [updateElementsByResourceId]
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
      handleRegisterUsage(resource);

      if (!resource.baseColor) {
        updateBaseColor(resource);
      }
    },
    [insertElement, handleRegisterUsage, updateBaseColor]
  );

  const { media3p } = useMedia(({ media3p }) => ({ media3p }));

  if (!isActive) {
    return <ProviderWrapper {...rest} hidden />;
  }

  const state = media3p[providerType].state;
  const actions = media3p[providerType].actions;
  const displayName = state.categories.selectedCategoryId
    ? state.categories.categories.find(
        (e) => e.id === state.categories.selectedCategoryId
      ).label
    : __('Trending', 'web-stories');

  // We display the media name if there's media to display or a category has
  // been selected.
  const shouldDisplayMediaSubheading = Boolean(
    state.media?.length || state.categories.selectedCategoryId
  );
  // When displaying search results, subHeading should be updated to reflect so
  const searchResultsLabel = __('Search Results', 'web-stories');

  return (
    <ProviderWrapper {...rest}>
      {PROVIDERS[providerType].supportsCategories && (
        <ChipGroup
          items={state.categories.categories}
          selectedItemId={state.categories.selectedCategoryId}
          selectItem={actions.selectCategory}
          deselectItem={actions.deselectCategory}
        />
      )}
      <MediaSubheading
        data-testid={'media-subheading'}
        shouldDisplay={shouldDisplayMediaSubheading}
      >
        {searchTerm.length && !state.categories.selectedCategoryId
          ? searchResultsLabel
          : displayName}
      </MediaSubheading>
      <PaginatedMediaGallery
        providerType={providerType}
        resources={state.media}
        isMediaLoading={state.isMediaLoading}
        isMediaLoaded={state.isMediaLoaded}
        hasMore={state.hasMore}
        setNextPage={actions.setNextPage}
        onInsert={insertMediaElement}
        searchTerm={searchTerm}
        selectedCategoryId={state.categories.selectedCategoryId}
      />
    </ProviderWrapper>
  );
}

ProviderPanel.propTypes = {
  providerType: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string,
};

export default ProviderPanel;
