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
import { useCallback, useContext, useEffect, useMemo } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ApiContext } from '../../api/apiProvider';
import { useConfig } from '../../config';
import GoogleAnalyticsSettings from './googleAnalytics';
import { Wrapper, Header, Heading, Main } from './components';
import PublisherLogoSettings from './publisherLogo';

function EditorSettings() {
  const {
    actions: {
      settingsApi: { fetchSettings, updateSettings },
      mediaApi: { uploadMedia, fetchMediaById },
    },
    state: {
      settings: { activePublisherLogoId, googleAnalyticsId, publisherLogoIds },
      media: { isLoading: isMediaLoading, uploadedMediaIds, publisherLogos },
    },
  } = useContext(ApiContext);

  const { capabilities: { canUploadFiles } = {} } = useConfig();

  /**
   * WP settings references publisher logos by ID.
   * We must retrieve the media for those ids from /media when present
   * Summarized below:
   * FETCH - fetch settings to know what IDs to load media for
   * then fetch media when publisherLogoIds are in state with useEffect
   * ADD - first upload new logo to media. use the new ID(s) to update settings.
   * REMOVE - send id to remove to settings. Not deleting media, just removing from logos.
   */

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (uploadedMediaIds.length > 0) {
      updateSettings({ publisherLogoIds: uploadedMediaIds });
    }
  }, [updateSettings, uploadedMediaIds]);

  useEffect(() => {
    if (publisherLogoIds.length > 0) {
      fetchMediaById(publisherLogoIds);
    }
  }, [fetchMediaById, publisherLogoIds]);

  const handleUpdateSettings = useCallback(
    (newGoogleAnalyticsId) =>
      updateSettings({ googleAnalyticsId: newGoogleAnalyticsId }),
    [updateSettings]
  );

  const handleAddLogos = useCallback(
    (files) => {
      uploadMedia(files);
    },
    [uploadMedia]
  );

  const handleRemoveLogo = useCallback(
    (e, media) => {
      e.preventDefault();
      // TODO how to handle deleting a default?
      updateSettings({ publisherLogoIdToRemove: media.id });
    },
    [updateSettings]
  );

  const orderedPublisherLogos = useMemo(() => {
    if (Object.keys(publisherLogos).length <= 0) {
      return [];
    }
    return publisherLogoIds.map((publisherLogoId) => {
      if (publisherLogos[publisherLogoId]) {
        if (publisherLogoId === activePublisherLogoId) {
          publisherLogos[publisherLogoId].isActive = true;
        }
        return publisherLogos[publisherLogoId];
      }
    });
  }, [activePublisherLogoId, publisherLogoIds, publisherLogos]);

  return (
    <Wrapper data-testid="editor-settings">
      <Header>
        <Heading>{__('Settings', 'web-stories')}</Heading>
      </Header>
      <Main>
        <GoogleAnalyticsSettings
          handleUpdateSettings={handleUpdateSettings}
          googleAnalyticsId={googleAnalyticsId}
        />
        <PublisherLogoSettings
          handleAddLogos={handleAddLogos}
          handleRemoveLogo={handleRemoveLogo}
          publisherLogos={orderedPublisherLogos}
          canUploadFiles={canUploadFiles}
          isLoading={isMediaLoading}
        />
      </Main>
    </Wrapper>
  );
}

export default EditorSettings;
