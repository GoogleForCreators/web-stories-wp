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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import FileUpload from '..';

const Container = styled.div`
  width: 600px;
`;
export default {
  title: 'Dashboard/Components/FileUpload',
  component: FileUpload,
  args: {
    label: 'Upload',
    isLoading: false,
    isMultiple: true,
    instructionalText:
      'Drag a jpg, png, or static gif in this box. Or click “Upload logo” below.',
  },
  argTypes: {
    onSubmit: { action: 'files uploaded' },
  },
  parameters: {
    controls: {
      exclude: ['id', 'ariaLabel', 'acceptableFormats'],
    },
  },
};

export const _default = {
  render: function Render(args) {
    return (
      <Container>
        <FileUpload
          acceptableFormats={['.jpg', '.jpeg', '.png', '.gif']}
          id={'898989'}
          ariaLabel={'Click to upload a file'}
          {...args}
        />
      </Container>
    );
  },
};
