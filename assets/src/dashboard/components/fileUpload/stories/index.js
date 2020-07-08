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
import styled from 'styled-components';
import { text, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

/**
 * Internal dependencies
 */
import FileUploadForm from '../';
import { getResourceFromLocalFile } from '../../../utils';

const Container = styled.div`
  width: 600px;
`;
export default {
  title: 'Dashboard/Components/FileUploadForm',
  component: FileUploadForm,
};

export const _default = () => {
  const [uploadedContent, setUploadedContent] = useState([]);

  const formatFiles = async (files) => {
    action('handleSubmit fired')(files);
    const resources = await Promise.all(
      files.map(async (file) => ({
        localResource: await getResourceFromLocalFile(file),
        file,
      }))
    );
    setUploadedContent((existingUploads) => {
      const newUploads = resources.map(({ file, localResource }) => {
        return {
          src: localResource.src,
          title: file.name,
          alt: localResource.alt,
        };
      });

      return [...existingUploads, ...newUploads];
    });
  };

  const deleteUploadedContent = useCallback((index, fileData) => {
    action('handleDelete fired')(index, fileData);
    setUploadedContent((existingUploadedContent) => {
      existingUploadedContent.splice(index, 1);
      return [...existingUploadedContent];
    });
  }, []);

  return (
    <Container>
      <FileUploadForm
        acceptableFormats={['.jpg', '.jpeg', '.png', '.gif']}
        handleSubmit={formatFiles}
        handleDelete={deleteUploadedContent}
        id={'898989'}
        label={text('label', 'Upload')}
        isMultiple={boolean('isMultiple', true)}
        isFileNameVisible={boolean('isFileNameVisible', false)}
        ariaLabel={'click to upload a file'}
        uploadedContent={uploadedContent}
        emptyDragHelperText={text(
          'emptyDragHelperText',
          'You can also drag your logo here'
        )}
      />
    </Container>
  );
};
