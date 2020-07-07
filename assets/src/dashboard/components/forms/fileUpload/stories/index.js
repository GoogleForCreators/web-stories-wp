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
import { action } from '@storybook/addon-actions';

/**
 * Internal dependencies
 */
import { useState } from 'react';
import FileUploadForm from '../';
import { getResourceFromLocalFile } from '../../../../utils';

export default {
  title: 'Dashboard/Components/FileUploadForm',
  component: FileUploadForm,
};

export const _default = () => {
  const [uploadedContent, setUploadedContent] = useState([]);

  const formatFiles = async (files) => {
    action('onSubmitClick')(files);
    const resources = await Promise.all(
      files.map(async (file) => ({
        localResource: await getResourceFromLocalFile(file),
        file,
      }))
    );

    setUploadedContent((existingUploads) => {
      const newUploads = resources.map(({ localResource }) => {
        return { src: localResource.src, title: localResource.title };
      });

      return [...existingUploads, ...newUploads];
    });
  };

  return (
    <FileUploadForm
      handleSubmit={formatFiles}
      id={'898989'}
      label="Upload"
      isMultiple={true}
      ariaLabel={'click to upload a file'}
      uploadedContent={uploadedContent}
    />
  );
};
