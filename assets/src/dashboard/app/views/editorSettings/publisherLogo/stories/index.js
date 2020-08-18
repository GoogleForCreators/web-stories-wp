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
import { useState, useCallback } from 'react';
import { action } from '@storybook/addon-actions';

/**
 * Internal dependencies
 */
import PublisherLogoSettings from '../';

export default {
  title: 'Dashboard/Views/EditorSettings/PublisherLogo',
  component: PublisherLogoSettings,
};

export const _default = () => {
  const [uploadedContent, setUploadedContent] = useState([]);

  const handleSubmit = useCallback(({ newPublisherLogos, deleteLogo }) => {
    if (newPublisherLogos) {
      action('onSubmit fired')(newPublisherLogos);

      setUploadedContent((existingUploads) => {
        const newUploads = newPublisherLogos.map(({ file, localResource }) => {
          return {
            src: localResource.src,
            title: file.name,
            alt: localResource.alt,
          };
        });

        return [...existingUploads, ...newUploads];
      });
    }

    if (deleteLogo) {
      action('onDelete fired')(deleteLogo);

      setUploadedContent((existingUploadedContent) => {
        const revisedMockUploads = existingUploadedContent.filter(
          (uploadedLogo) => uploadedLogo.title !== deleteLogo.title
        );
        return revisedMockUploads;
      });
    }
  }, []);

  return (
    <PublisherLogoSettings
      onUpdatePublisherLogo={handleSubmit}
      publisherLogos={uploadedContent}
    />
  );
};
