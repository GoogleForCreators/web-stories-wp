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
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Layout } from '../../../components';
import { ApiContext } from '../../api/apiProvider';
import { useConfig } from '../../config';
import { PageHeading } from '../shared';
import GoogleAnalyticsSettings from './googleAnalytics';
import { Wrapper, Main } from './components';
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

  const { capabilities: { canUploadFiles } = {}, maxUpload } = useConfig();

  const [mediaError, setMediaError] = useState('');
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

  const handleUpdateGoogleAnalyticsId = useCallback(
    (newGoogleAnalyticsId) =>
      updateSettings({ googleAnalyticsId: newGoogleAnalyticsId }),
    [updateSettings]
  );

  const handleAddLogos = useCallback(
    (files) => {
      const isFileSizeWithinMaxUpload = files.every(
        (file) => file.size <= maxUpload
      );

      if (!isFileSizeWithinMaxUpload) {
        const errorText =
          files.length === 1
            ? __(
                'Sorry, this file is too big. Make sure your logo is under 100 MB.',
                'web-stories'
              )
            : __(
                'Sorry, one or more of these files are too big. Make sure your logos are all under 100 MB.',
                'web-stories'
              );
        return setMediaError(errorText);
      }
      setMediaError('');
      return uploadMedia(files);
    },
    [maxUpload, uploadMedia]
  );

  const handleRemoveLogo = useCallback(
    (e, media) => {
      e.preventDefault();
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
      return undefined; // this is a safeguard against edge cases where a user has > 100 publisher logos, which is more than we're loading
    });
  }, [activePublisherLogoId, publisherLogoIds, publisherLogos]);

  return (
    <Layout.Provider>
      <Wrapper data-testid="editor-settings">
        <Layout.Squishable>
          <PageHeading
            defaultTitle={__('Settings', 'web-stories')}
            showTypeahead={false}
          />
        </Layout.Squishable>
        <Layout.Scrollable>
          <Main>
            <GoogleAnalyticsSettings
              handleUpdate={handleUpdateGoogleAnalyticsId}
              googleAnalyticsId={googleAnalyticsId}
            />
            <PublisherLogoSettings
              handleAddLogos={handleAddLogos}
              handleRemoveLogo={handleRemoveLogo}
              publisherLogos={orderedPublisherLogos}
              canUploadFiles={canUploadFiles}
              isLoading={isMediaLoading}
              uploadError={mediaError}
            />
          </Main>
        </Layout.Scrollable>
      </Wrapper>
    </Layout.Provider>
  );
}

export default EditorSettings;
