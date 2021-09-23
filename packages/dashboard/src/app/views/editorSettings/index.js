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
import { useCallback, useEffect, useState } from '@web-stories-wp/react';
import { __, sprintf } from '@web-stories-wp/i18n';
import { Text, THEME_CONSTANTS } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import useApi from '../../api/useApi';
import { Dialog, Layout } from '../../../components';
import { MIN_IMG_WIDTH, MIN_IMG_HEIGHT } from '../../../constants';
import { useConfig } from '../../config';
import { PageHeading } from '../shared';
import useTelemetryOptIn from '../shared/useTelemetryOptIn';
import useMediaOptimization from '../shared/useMediaOptimization';
import GoogleAnalyticsSettings from './googleAnalytics';
import { Main, Wrapper } from './components';
import AdManagement from './adManagement';
import PublisherLogoSettings from './publisherLogo';
import TelemetrySettings from './telemetry';
import MediaOptimizationSettings from './mediaOptimization';
import VideoCacheSettings from './videoCache';
import ArchiveSettings from './archive';

const ACTIVE_DIALOG_REMOVE_LOGO = 'REMOVE_LOGO';

function EditorSettings() {
  const {
    fetchSettings,
    updateSettings,
    googleAnalyticsId,
    usingLegacyAnalytics,
    adSensePublisherId,
    adSenseSlotId,
    adManagerSlotId,
    adNetwork,
    uploadMedia,
    newlyCreatedMediaIds,
    isMediaLoading,
    videoCache,
    archive,
    publisherLogos,
    addPublisherLogo,
    fetchPublisherLogos,
    removePublisherLogo,
    setPublisherLogoAsDefault,
  } = useApi(
    ({
      actions: {
        settingsApi: { fetchSettings, updateSettings },
        mediaApi: { uploadMedia },
        publisherLogosApi: {
          fetchPublisherLogos,
          addPublisherLogo,
          removePublisherLogo,
          setPublisherLogoAsDefault,
        },
      },
      state: {
        settings: {
          googleAnalyticsId,
          usingLegacyAnalytics,
          adSensePublisherId,
          adSenseSlotId,
          adManagerSlotId,
          adNetwork,
          videoCache,
          archive,
        },
        media: { isLoading: isMediaLoading, newlyCreatedMediaIds },
        publisherLogos: { publisherLogos },
      },
    }) => ({
      fetchSettings,
      updateSettings,
      googleAnalyticsId,
      usingLegacyAnalytics,
      adSensePublisherId,
      adSenseSlotId,
      adManagerSlotId,
      adNetwork,
      uploadMedia,
      isMediaLoading,
      newlyCreatedMediaIds,
      videoCache,
      archive,
      fetchPublisherLogos,
      addPublisherLogo,
      removePublisherLogo,
      setPublisherLogoAsDefault,
      publisherLogos,
    })
  );

  const {
    capabilities: { canUploadFiles, canManageSettings } = {},
    siteKitStatus = {},
    maxUpload,
    maxUploadFormatted,
    allowedImageMimeTypes,
    archiveURL,
  } = useConfig();

  const {
    disabled: disableOptedIn,
    toggleWebStoriesTrackingOptIn,
    optedIn,
  } = useTelemetryOptIn();

  const {
    disabled: disableMediaOptimization,
    toggleWebStoriesMediaOptimization,
    mediaOptimization,
  } = useMediaOptimization();

  const [activeDialog, setActiveDialog] = useState(null);
  const [logoToBeDeleted, setLogoToBeDeleted] = useState('');
  const [mediaError, setMediaError] = useState('');

  useEffect(() => {
    if (canManageSettings) {
      fetchSettings();
      fetchPublisherLogos();
    }
  }, [fetchSettings, fetchPublisherLogos, canManageSettings]);

  useEffect(() => {
    if (newlyCreatedMediaIds.length > 0) {
      for (const id of newlyCreatedMediaIds) {
        addPublisherLogo(id);
      }
    }
  }, [newlyCreatedMediaIds, addPublisherLogo]);

  const handleUpdateGoogleAnalyticsId = useCallback(
    (newGoogleAnalyticsId) =>
      updateSettings({ googleAnalyticsId: newGoogleAnalyticsId }),
    [updateSettings]
  );

  const handleMigrateLegacyAnalytics = useCallback(
    () => updateSettings({ usingLegacyAnalytics: false }),
    [updateSettings]
  );

  const handleAddLogos = useCallback(
    async (files) => {
      let allFileSizesWithinMaxUpload = true;
      let allFileTypeSupported = true;
      let errorProcessingImages = false;
      const imagePromises = [];

      files.forEach((file) => {
        allFileSizesWithinMaxUpload =
          allFileSizesWithinMaxUpload && file.size <= maxUpload;
        const fileTypeSupported = allowedImageMimeTypes.includes(file.type);
        allFileTypeSupported = allFileTypeSupported && fileTypeSupported;

        if (fileTypeSupported) {
          return;
        }

        imagePromises.push(
          new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(file.name));

            img.src = URL.createObjectURL(file);
          })
        );
      });

      if (!allFileSizesWithinMaxUpload) {
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

      if (!allFileTypeSupported) {
        const errorText =
          files.length === 1
            ? __(
                'Sorry, this file type is not supported. Only jpg, png, and static gifs are supported for publisher logos.',
                'web-stories'
              )
            : __(
                'Sorry, one or more of these files are of an unsupported file type. Only jpg, png, and static gifs are supported for publisher logos.',
                'web-stories'
              );
        return setMediaError(errorText);
      }

      const images = await Promise.all(imagePromises).catch(() => {
        errorProcessingImages = true;
      });

      if (errorProcessingImages) {
        const errorText =
          files.length === 1
            ? __(
                'Sorry, there was an error processing your upload. Please try again.',
                'web-stories'
              )
            : __(
                'Sorry, there was an error processing one or more of your uploads. Please try again.',
                'web-stories'
              );
        return setMediaError(errorText);
      }

      const allFileDimensionsValid = images.every(
        ({ height, width }) =>
          height >= MIN_IMG_HEIGHT && width >= MIN_IMG_WIDTH
      );

      if (!allFileDimensionsValid) {
        const errorText =
          files.length === 1
            ? sprintf(
                /* translators: 1 = minimum width, 2 = minimum height */
                __(
                  'Sorry, this file is too small. Make sure your logo is larger than %s.',
                  'web-stories'
                ),
                sprintf('%1$dx%2$dpx', MIN_IMG_WIDTH, MIN_IMG_HEIGHT)
              )
            : sprintf(
                /* translators: %s: image dimensions in pixels. */
                __(
                  'Sorry, one or more files are too small. Make sure your logos are all larger than %s.',
                  'web-stories'
                ),
                sprintf('%1$dx%2$dpx', MIN_IMG_WIDTH, MIN_IMG_HEIGHT)
              );
        return setMediaError(errorText);
      }

      setMediaError('');
      return uploadMedia(files);
    },
    [maxUpload, maxUploadFormatted, uploadMedia, allowedImageMimeTypes]
  );

  const handleRemoveLogo = useCallback((publisherLogo) => {
    setActiveDialog(ACTIVE_DIALOG_REMOVE_LOGO);
    setLogoToBeDeleted(publisherLogo);
  }, []);

  const handleDialogConfirmRemoveLogo = useCallback(() => {
    removePublisherLogo(logoToBeDeleted.id);
    setActiveDialog(null);
  }, [logoToBeDeleted, removePublisherLogo]);

  const handleUpdateDefaultLogo = useCallback(
    (newDefaultLogo) => setPublisherLogoAsDefault(newDefaultLogo.id),
    [setPublisherLogoAsDefault]
  );

  const isActiveRemoveLogoDialog = Boolean(
    activeDialog === ACTIVE_DIALOG_REMOVE_LOGO && logoToBeDeleted
  );

  return (
    <Layout.Provider>
      <Wrapper data-testid="editor-settings">
        <PageHeading heading={__('Settings', 'web-stories')} />
        <Layout.Scrollable>
          <Main>
            {canManageSettings && (
              <GoogleAnalyticsSettings
                googleAnalyticsId={googleAnalyticsId}
                handleUpdateAnalyticsId={handleUpdateGoogleAnalyticsId}
                usingLegacyAnalytics={usingLegacyAnalytics}
                handleMigrateLegacyAnalytics={handleMigrateLegacyAnalytics}
                siteKitStatus={siteKitStatus}
              />
            )}
            {canManageSettings && (
              <PublisherLogoSettings
                onAddLogos={handleAddLogos}
                onRemoveLogo={handleRemoveLogo}
                onUpdateDefaultLogo={handleUpdateDefaultLogo}
                publisherLogos={publisherLogos}
                canUploadFiles={canUploadFiles}
                isLoading={isMediaLoading}
                uploadError={mediaError}
              />
            )}
            <TelemetrySettings
              disabled={disableOptedIn}
              onCheckboxSelected={toggleWebStoriesTrackingOptIn}
              selected={optedIn}
            />
            {canUploadFiles && (
              <MediaOptimizationSettings
                disabled={disableMediaOptimization}
                onCheckboxSelected={toggleWebStoriesMediaOptimization}
                selected={mediaOptimization}
              />
            )}
            {canManageSettings && (
              <VideoCacheSettings
                isEnabled={videoCache}
                updateSettings={updateSettings}
              />
            )}
            {canManageSettings && (
              <ArchiveSettings
                archive={archive}
                archiveURL={archiveURL}
                updateSettings={updateSettings}
              />
            )}
            {canManageSettings && (
              <AdManagement
                updateSettings={updateSettings}
                adNetwork={adNetwork}
                publisherId={adSensePublisherId}
                adSenseSlotId={adSenseSlotId}
                adManagerSlotId={adManagerSlotId}
                siteKitStatus={siteKitStatus}
              />
            )}
          </Main>
        </Layout.Scrollable>
      </Wrapper>

      {/* TODO: Remove this dialog, as it's not technically correct. */}
      <Dialog
        isOpen={isActiveRemoveLogoDialog}
        contentLabel={__(
          'Dialog to confirm removing a publisher logo',
          'web-stories'
        )}
        title={__('Are you sure you want to remove this logo?', 'web-stories')}
        onClose={() => setActiveDialog(null)}
        secondaryText={__('Cancel', 'web-stories')}
        onPrimary={handleDialogConfirmRemoveLogo}
        primaryText={__('Delete Logo', 'web-stories')}
      >
        <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {__(
            'The logo will be removed from any stories that currently use it as their publisher logo.',
            'web-stories'
          )}
        </Text>
      </Dialog>
    </Layout.Provider>
  );
}

export default EditorSettings;
