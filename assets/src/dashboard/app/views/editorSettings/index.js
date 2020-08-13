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
import { getResourceFromLocalFile } from '../../../utils';
import { ApiContext } from '../../api/apiProvider';
import { useConfig } from '../../config';
import GoogleAnalyticsSettings from './googleAnalytics';
import { Wrapper, Header, Heading, Main } from './components';
import PublisherLogoSettings from './publisherLogo';

function EditorSettings() {
  const { capabilities: { canManageSettings } = {} } = useConfig();

  const {
    actions: {
      settingsApi: { fetchSettings, updateSettings },
      mediaApi: { removeMedia, uploadMedia, fetchMediaById },
    },
    state: {
      settings: { activePublisherLogoId, googleAnalyticsId, publisherLogoIds },
      media: { isLoading, uploadedMediaIds, publisherLogos },
    },
  } = useContext(ApiContext);

  const { capabilities: { canUploadFiles } = {} } = useConfig();

  // get settings
  // get logos from IDs retrieved in settings

  // upload new logo to media
  // tell settings that those new media ids belong to logos
  // add logos to visible
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (uploadedMediaIds.length > 0) {
      updateSettings({ publisherLogoIds: uploadedMediaIds });
    }
  }, [updateSettings, uploadedMediaIds]);

  useEffect(() => {
    console.log('???', publisherLogoIds);
    if (publisherLogoIds.length > 0) {
      console.log('fetch! ');
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
    (_, media) => {
      console.log('MEDIA TO REMOVE: ', media);
      removeMedia(media);
    },
    [removeMedia]
  );

  const orderedPublisherLogos = useMemo(() => {
    // to allow to put default logo first
    return Object.values(publisherLogos).map((publisherLogo) => {
      if (publisherLogo.id === activePublisherLogoId) {
        publisherLogo.isActive = true;
      }
      return publisherLogo;
    });
  }, [activePublisherLogoId, publisherLogos]);

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
        />
      </Main>
    </Wrapper>
  );
}

export default EditorSettings;
