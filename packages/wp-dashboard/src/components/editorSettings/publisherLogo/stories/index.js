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
import { useCallback, useState } from '@web-stories-wp/react';
import { boolean, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { createBlob, createFileReader } from '@web-stories-wp/media';
import { ConfigProvider } from '@web-stories-wp/dashboard';

/**
 * Internal dependencies
 */
import { rawPublisherLogos } from '../../dataUtils/formattedPublisherLogos';
import PublisherLogoSettings from '..';

export default {
  title: 'Dashboard/Views/EditorSettings/PublisherLogo',
  component: PublisherLogoSettings,
};

export const _default = () => {
  const [uploadedContent, setUploadedContent] = useState(rawPublisherLogos);

  const handleAddLogos = useCallback(async (newPublisherLogos) => {
    action('onSubmit fired')(newPublisherLogos);

    // this is purely for the sake of storybook demoing
    const newUploads = await Promise.all(
      newPublisherLogos.map(async (file) => {
        const reader = await createFileReader(file);
        const src = createBlob(
          new window.Blob([reader.result], { type: file.type })
        );
        return {
          id: src,
          url: src,
          title: file.name,
        };
      })
    );
    setUploadedContent((existingUploads) => [
      ...existingUploads,
      ...newUploads,
    ]);
  }, []);

  const handleRemoveLogo = useCallback((deleteLogo) => {
    action('onDelete fired')(deleteLogo);

    setUploadedContent((existingUploadedContent) => {
      return existingUploadedContent.filter(
        (uploadedLogo) => uploadedLogo.id !== deleteLogo.id
      );
    });
  }, []);

  return (
    <ConfigProvider config={{ allowedImageMimeTypes: {} }}>
      <PublisherLogoSettings
        canUploadFiles={boolean('canUploadFile', true)}
        onAddLogos={handleAddLogos}
        onRemoveLogo={handleRemoveLogo}
        isLoading={boolean('isLoading', false)}
        publisherLogos={uploadedContent}
        uploadError={text('uploadError', '')}
      />
    </ConfigProvider>
  );
};
