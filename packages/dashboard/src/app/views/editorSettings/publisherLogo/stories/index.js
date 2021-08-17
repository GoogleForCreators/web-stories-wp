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
import { useState, useCallback } from '@web-stories-wp/react';
import { boolean, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import {
  createBlob,
  getFileName,
  createFileReader,
} from '@web-stories-wp/media';

/**
 * Internal dependencies
 */
import formattedPublisherLogos from '../../../../../dataUtils/formattedPublisherLogos';
import { ConfigProvider } from '../../../../config';
import PublisherLogoSettings from '..';

export default {
  title: 'Dashboard/Views/EditorSettings/PublisherLogo',
  component: PublisherLogoSettings,
};

export const _default = () => {
  const [uploadedContent, setUploadedContent] = useState(
    formattedPublisherLogos
  );

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
          src,
          title: file.name,
          alt: getFileName(file.name),
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
      const revisedMockUploads = existingUploadedContent.filter(
        (uploadedLogo) => uploadedLogo.id !== deleteLogo.id
      );
      return revisedMockUploads;
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
