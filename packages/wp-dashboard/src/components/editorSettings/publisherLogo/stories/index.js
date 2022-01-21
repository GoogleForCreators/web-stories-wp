/*
 * Copyright 2022 Google LLC
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
import { useCallback, useState } from '@googleforcreators/react';
import { createBlob, createFileReader } from '@googleforcreators/media';
import { ConfigProvider } from '@googleforcreators/dashboard';

/**
 * Internal dependencies
 */
import { rawPublisherLogos } from '../../dataUtils/formattedPublisherLogos';
import PublisherLogoSettings from '..';

export default {
  title: 'Dashboard/Views/EditorSettings/PublisherLogo',
  component: PublisherLogoSettings,
  args: {
    canUploadFiles: true,
    isLoading: false,
    uploadError: '',
  },
  argTypes: {
    onAddLogos: { action: 'onSubmit fired' },
    onRemoveLogo: { action: 'onDelete fired' },
  },
  parameters: {
    controls: {
      exclude: ['publisherLogos'],
    },
  },
};

export const _default = (args) => {
  const [uploadedContent, setUploadedContent] = useState(rawPublisherLogos);

  const handleAddLogos = useCallback(
    async (newPublisherLogos) => {
      args.onAddLogos(newPublisherLogos);

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
    },
    [args]
  );

  const handleRemoveLogo = useCallback(
    (deleteLogo) => {
      args.onRemoveLogo(deleteLogo);

      setUploadedContent((existingUploadedContent) => {
        return existingUploadedContent.filter(
          (uploadedLogo) => uploadedLogo.id !== deleteLogo.id
        );
      });
    },
    [args]
  );

  return (
    <ConfigProvider config={{ allowedImageMimeTypes: {} }}>
      <PublisherLogoSettings
        onAddLogos={handleAddLogos}
        onRemoveLogo={handleRemoveLogo}
        publisherLogos={uploadedContent}
        {...args}
      />
    </ConfigProvider>
  );
};
