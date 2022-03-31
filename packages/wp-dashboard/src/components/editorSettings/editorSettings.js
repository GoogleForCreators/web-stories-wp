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
import { useCallback, useEffect, useState } from '@googleforcreators/react';
import { __, sprintf } from '@googleforcreators/i18n';
import {
  PageHeading,
  Layout,
  MIN_IMG_WIDTH,
  MIN_IMG_HEIGHT,
  useConfig,
} from '@googleforcreators/dashboard';

/**
 * Internal dependencies
 */
import { useTelemetryOptIn, useMediaOptimization } from '../../effects';
import useApiAlerts from '../../api/hooks/useApiAlerts';
import AdManagement from './adManagement';
import PublisherLogoSettings from './publisherLogo';
import TelemetrySettings from './telemetry';
import MediaOptimizationSettings from './mediaOptimization';
import VideoCacheSettings from './videoCache';
import ArchiveSettings from './archive';
import GoogleAnalyticsSettings from './googleAnalytics';
import { Wrapper, Main } from './components';
import useEditorSettings from './useEditorSettings';
import CustomFontsSettings from './customFonts';

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
    archivePageId,
    searchPages,
    getPageById,
    customFonts,
    addCustomFont,
    deleteCustomFont,
    publisherLogos,
    addPublisherLogo,
    fetchPublisherLogos,
    removePublisherLogo,
    setPublisherLogoAsDefault,
  } = useEditorSettings(
    ({
      actions: {
        fontsApi: { addCustomFont, deleteCustomFont },
        settingsApi: { fetchSettings, updateSettings },
        pagesApi: { searchPages, getPageById },
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
          archivePageId,
        },
        media: { isLoading: isMediaLoading, newlyCreatedMediaIds },
        publisherLogos: { publisherLogos },
        customFonts,
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
      archivePageId,
      searchPages,
      getPageById,
      customFonts,
      addCustomFont,
      deleteCustomFont,
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
    defaultArchiveURL,
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

  const [mediaError, setMediaError] = useState('');

  useEffect(() => {
    if (canManageSettings) {
      fetchSettings();
      fetchPublisherLogos();
    }
  }, [fetchSettings, fetchPublisherLogos, canManageSettings]);

  useEffect(() => {
    if (newlyCreatedMediaIds.length > 0) {
      addPublisherLogo(newlyCreatedMediaIds);
    }
  }, [newlyCreatedMediaIds, addPublisherLogo]);

  useApiAlerts();

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

  const handleRemoveLogo = useCallback(
    (publisherLogo) => {
      removePublisherLogo(publisherLogo.id);
    },
    [removePublisherLogo]
  );

  const handleUpdateDefaultLogo = useCallback(
    (newDefaultLogo) => setPublisherLogoAsDefault(newDefaultLogo.id),
    [setPublisherLogoAsDefault]
  );

  return (
    <Layout.Provider>
      <Wrapper data-testid="editor-settings">
        <PageHeading heading={__('Settings', 'web-stories')} />
        <Layout.Scrollable>
          <Main>
            {canManageSettings && (
              <>
                <GoogleAnalyticsSettings
                  googleAnalyticsId={googleAnalyticsId}
                  handleUpdateAnalyticsId={handleUpdateGoogleAnalyticsId}
                  usingLegacyAnalytics={usingLegacyAnalytics}
                  handleMigrateLegacyAnalytics={handleMigrateLegacyAnalytics}
                  siteKitStatus={siteKitStatus}
                />
                <PublisherLogoSettings
                  onAddLogos={handleAddLogos}
                  onRemoveLogo={handleRemoveLogo}
                  onUpdateDefaultLogo={handleUpdateDefaultLogo}
                  publisherLogos={publisherLogos}
                  canUploadFiles={canUploadFiles}
                  isLoading={isMediaLoading}
                  uploadError={mediaError}
                />
              </>
            )}
            <CustomFontsSettings
              customFonts={customFonts}
              addCustomFont={addCustomFont}
              deleteCustomFont={deleteCustomFont}
            />
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
              <>
                <VideoCacheSettings
                  isEnabled={videoCache}
                  updateSettings={updateSettings}
                />
                <ArchiveSettings
                  archive={archive}
                  archiveURL={archiveURL}
                  defaultArchiveURL={defaultArchiveURL}
                  updateSettings={updateSettings}
                  searchPages={searchPages}
                  archivePageId={archivePageId}
                  getPageById={getPageById}
                />
                <AdManagement
                  updateSettings={updateSettings}
                  adNetwork={adNetwork}
                  publisherId={adSensePublisherId}
                  adSenseSlotId={adSenseSlotId}
                  adManagerSlotId={adManagerSlotId}
                  siteKitStatus={siteKitStatus}
                />
              </>
            )}
          </Main>
        </Layout.Scrollable>
      </Wrapper>
    </Layout.Provider>
  );
}

export default EditorSettings;
