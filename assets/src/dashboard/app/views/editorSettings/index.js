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
import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import useApi from '../../api/useApi';
import { Layout, Dialog, Button } from '../../../components';
import { BUTTON_TYPES } from '../../../constants';
import { useConfig } from '../../config';
import { PageHeading } from '../shared';
import GoogleAnalyticsSettings from './googleAnalytics';
import { Main, Wrapper } from './components';
import PublisherLogoSettings from './publisherLogo';

const ACTIVE_DIALOG_REMOVE_LOGO = 'REMOVE_LOGO';

function EditorSettings() {
  const {
    fetchSettings,
    updateSettings,
    googleAnalyticsId,
    fetchMediaById,
    uploadMedia,
    activePublisherLogoId,
    isMediaLoading,
    mediaById,
    newlyCreatedMediaIds,
    publisherLogoIds,
  } = useApi(
    ({
      actions: {
        settingsApi: { fetchSettings, updateSettings },
        mediaApi: { fetchMediaById, uploadMedia },
      },
      state: {
        settings: {
          activePublisherLogoId,
          googleAnalyticsId,
          publisherLogoIds,
        },
        media: { isLoading: isMediaLoading, mediaById, newlyCreatedMediaIds },
      },
    }) => ({
      fetchSettings,
      updateSettings,
      googleAnalyticsId,
      fetchMediaById,
      uploadMedia,
      activePublisherLogoId,
      isMediaLoading,
      mediaById,
      newlyCreatedMediaIds,
      publisherLogoIds,
    })
  );

  const {
    capabilities: { canUploadFiles } = {},
    maxUpload,
    maxUploadFormatted,
  } = useConfig();

  const [activeDialog, setActiveDialog] = useState(null);
  const [activeLogo, setActiveLogo] = useState('');
  const [mediaError, setMediaError] = useState('');
  /**
   * WP settings references publisher logos by ID.
   * We must retrieve the media for those IDs from /media when present
   * Summarized below:
   * FETCH - fetch settings to know what IDs to load media for
   * then fetch media when publisherLogoIds are in state with useEffect
   * ADD - first upload new logo to media. use the new ID(s) to update settings.
   * REMOVE - send ID to remove to settings. Not deleting media, just removing from logos.
   */

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (newlyCreatedMediaIds.length > 0) {
      updateSettings({ publisherLogoIds: newlyCreatedMediaIds });
    }
  }, [updateSettings, newlyCreatedMediaIds]);

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
            ? sprintf(
                /* translators: %s: max upload size for media */
                __(
                  'Sorry, this file is too big. Make sure your logo is under %s.',
                  'web-stories'
                ),
                maxUploadFormatted
              )
            : sprintf(
                /* translators: %s: max upload size for media */
                __(
                  'Sorry, one or more of these files are too big. Make sure your logos are all under %s.',
                  'web-stories'
                ),
                maxUploadFormatted
              );
        return setMediaError(errorText);
      }
      setMediaError('');
      return uploadMedia(files);
    },
    [maxUpload, maxUploadFormatted, uploadMedia]
  );

  const handleRemoveLogo = useCallback((e, media) => {
    e.preventDefault();

    setActiveDialog(ACTIVE_DIALOG_REMOVE_LOGO);
    setActiveLogo(media.id);
  }, []);

  const isActiveRemoveLogoDialog = Boolean(
    activeDialog === ACTIVE_DIALOG_REMOVE_LOGO && activeLogo
  );

  const orderedPublisherLogos = useMemo(() => {
    if (Object.keys(mediaById).length <= 0) {
      return [];
    }

    return publisherLogoIds.map((publisherLogoId) => {
      if (mediaById[publisherLogoId]) {
        return publisherLogoId === activePublisherLogoId
          ? { ...mediaById[publisherLogoId], isActive: true }
          : mediaById[publisherLogoId];
      }
      return undefined; // this is a safeguard against edge cases where a user has > 100 publisher logos, which is more than we're loading
    });
  }, [activePublisherLogoId, publisherLogoIds, mediaById]);

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

      <Dialog
        isOpen={isActiveRemoveLogoDialog}
        contentLabel={__(
          'Dialog to confirm removing a publisher logo',
          'web-stories'
        )}
        title={__('Are you sure you want to remove this logo?', 'web-stories')}
        onClose={() => setActiveDialog(null)}
        actions={
          <>
            <Button
              type={BUTTON_TYPES.DEFAULT}
              onClick={() => setActiveDialog(null)}
            >
              {__('Cancel', 'web-stories')}
            </Button>
            <Button
              type={BUTTON_TYPES.DEFAULT}
              onClick={() => {
                updateSettings({ publisherLogoIdToRemove: activeLogo });
                setActiveDialog(null);
              }}
            >
              {__('Remove Logo', 'web-stories')}
            </Button>
          </>
        }
      >
        {__(
          'This will affect any stories that currently use it as their publisher logo.',
          'web-stories'
        )}
      </Dialog>
    </Layout.Provider>
  );
}

export default EditorSettings;
