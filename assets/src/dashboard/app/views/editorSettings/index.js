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
import { useFeature } from 'flagged';
import { __, sprintf } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import {
  Dialog,
  Button,
  BUTTON_TYPES,
  BUTTON_SIZES,
} from '../../../../design-system';
import useApi from '../../api/useApi';
import { Layout } from '../../../components';
import { MIN_IMG_WIDTH, MIN_IMG_HEIGHT } from '../../../constants';
import { useConfig } from '../../config';
import { PageHeading } from '../shared';
import useTelemetryOptIn from '../shared/useTelemetryOptIn';
import useMediaOptimization from '../shared/useMediaOptimization';
import { DashboardSnackbar } from '..';
import GoogleAnalyticsSettings from './googleAnalytics';
import { Main, Wrapper } from './components';
import AdManagement from './adManagement';
import PublisherLogoSettings from './publisherLogo';
import TelemetrySettings from './telemetry';
import MediaOptimizationSettings from './mediaOptimization';

const ACTIVE_DIALOG_REMOVE_LOGO = 'REMOVE_LOGO';

function EditorSettings() {
  const {
    fetchSettings,
    updateSettings,
    googleAnalyticsId,
    adSensePublisherId,
    adSenseSlotId,
    adManagerSlotId,
    adNetwork,
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
          googleAnalyticsId,
          adSensePublisherId,
          adSenseSlotId,
          adManagerSlotId,
          adNetwork,
          publisherLogoIds,
          activePublisherLogoId,
        },
        media: { isLoading: isMediaLoading, mediaById, newlyCreatedMediaIds },
      },
    }) => ({
      fetchSettings,
      updateSettings,
      googleAnalyticsId,
      adSensePublisherId,
      adSenseSlotId,
      adManagerSlotId,
      adNetwork,
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
    capabilities: { canUploadFiles, canManageSettings } = {},
    siteKitStatus = {},
    maxUpload,
    maxUploadFormatted,
    allowedImageMimeTypes,
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

  const videoOptimization = useFeature('videoOptimization');

  const [activeDialog, setActiveDialog] = useState(null);
  const [activeLogo, setActiveLogo] = useState('');
  const [mediaError, setMediaError] = useState('');

  const mediaIds = useMemo(() => Object.keys(mediaById), [mediaById]);
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
    if (canManageSettings) {
      fetchSettings();
    }
  }, [fetchSettings, canManageSettings]);

  useEffect(() => {
    if (newlyCreatedMediaIds.length > 0) {
      const updateObject = { publisherLogoIds: newlyCreatedMediaIds };

      if (publisherLogoIds.filter((id) => id !== 0).length === 0) {
        updateObject.publisherLogoToMakeDefault = newlyCreatedMediaIds[0];
      }

      updateSettings(updateObject);
    }
  }, [updateSettings, newlyCreatedMediaIds, publisherLogoIds]);

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

  const handleRemoveLogo = useCallback((media) => {
    setActiveDialog(ACTIVE_DIALOG_REMOVE_LOGO);
    setActiveLogo(media.id);
  }, []);

  const handleDialogConfirmRemoveLogo = useCallback(() => {
    if (activeLogo === activePublisherLogoId) {
      // find the next publisher logo to make default, there's cases where publisher logo ids have their media removed in the editor but the instance of them as a publisher logo is still present
      // so we need to find the next available logo by making sure media exists for it as well.
      const newDefaultLogoId = publisherLogoIds.reduce((acc, logoId) => {
        if (logoId === activeLogo) {
          return undefined;
        }
        const availableMedia = mediaIds.find(
          (mediaId) => mediaId.toString() === logoId.toString()
        );

        if (availableMedia) {
          return availableMedia;
        }
        return acc;
      }, false);

      updateSettings({
        publisherLogoIdToRemove: activeLogo,
        publisherLogoToMakeDefault: newDefaultLogoId,
      });
    } else {
      updateSettings({ publisherLogoIdToRemove: activeLogo });
    }
    setActiveDialog(null);
  }, [
    activeLogo,
    activePublisherLogoId,
    mediaIds,
    publisherLogoIds,
    updateSettings,
  ]);

  const handleUpdateDefaultLogo = useCallback(
    (media) => updateSettings({ publisherLogoToMakeDefault: media.id }),
    [updateSettings]
  );

  const isActiveRemoveLogoDialog = Boolean(
    activeDialog === ACTIVE_DIALOG_REMOVE_LOGO && activeLogo
  );

  const orderedPublisherLogos = useMemo(() => {
    if (Object.keys(mediaById).length <= 0) {
      return [];
    }

    return publisherLogoIds
      .map((publisherLogoId) => {
        if (mediaById[publisherLogoId]) {
          return publisherLogoId === activePublisherLogoId
            ? { ...mediaById[publisherLogoId], isDefault: true }
            : mediaById[publisherLogoId];
        }
        return {}; // this is a safeguard against edge cases where a user has > 100 publisher logos, which is more than we're loading
      })
      .filter((logo) => logo?.id);
  }, [activePublisherLogoId, publisherLogoIds, mediaById]);

  return (
    <Layout.Provider>
      <Wrapper data-testid="editor-settings">
        <PageHeading heading={__('Settings', 'web-stories')} />
        <Layout.Scrollable>
          <Main>
            {canManageSettings && (
              <GoogleAnalyticsSettings
                handleUpdate={handleUpdateGoogleAnalyticsId}
                googleAnalyticsId={googleAnalyticsId}
                siteKitStatus={siteKitStatus}
              />
            )}
            {canManageSettings && (
              <PublisherLogoSettings
                handleAddLogos={handleAddLogos}
                handleRemoveLogo={handleRemoveLogo}
                handleUpdateDefaultLogo={handleUpdateDefaultLogo}
                publisherLogos={orderedPublisherLogos}
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
            {videoOptimization && canUploadFiles && (
              <MediaOptimizationSettings
                disabled={disableMediaOptimization}
                onCheckboxSelected={toggleWebStoriesMediaOptimization}
                selected={mediaOptimization}
              />
            )}
            {canManageSettings && (
              <AdManagement
                updateSettings={updateSettings}
                adNetwork={adNetwork}
                publisherId={adSensePublisherId}
                adSenseSlotId={adSenseSlotId}
                adManagerSlotId={adManagerSlotId}
              />
            )}
          </Main>
        </Layout.Scrollable>
        <Layout.Fixed>
          <DashboardSnackbar />
        </Layout.Fixed>
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
              type={BUTTON_TYPES.TERTIARY}
              onClick={() => setActiveDialog(null)}
              size={BUTTON_SIZES.SMALL}
            >
              {__('Cancel', 'web-stories')}
            </Button>
            <Button
              type={BUTTON_TYPES.PRIMARY}
              onClick={handleDialogConfirmRemoveLogo}
              size={BUTTON_SIZES.SMALL}
            >
              {__('Delete Logo', 'web-stories')}
            </Button>
          </>
        }
      >
        {__(
          'The logo will be removed from any stories that currently use it as their publisher logo.',
          'web-stories'
        )}
      </Dialog>
    </Layout.Provider>
  );
}

export default EditorSettings;
