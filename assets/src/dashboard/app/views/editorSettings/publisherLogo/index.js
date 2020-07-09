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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { useCallback } from 'react';

/**
 * Internal dependencies
 */
import { getResourceFromLocalFile } from '../../../../utils';
import {
  SettingForm,
  FileUploadHelperText,
  FinePrintHelperText,
  UploadContainer,
  SettingHeading,
} from '../components';

const TEXT = {
  SECTION_HEADING: __('Publisher Logo', 'web-stories'),
  CONTEXT: __(
    'Upload your logos here and they will become available to any stories you create.',
    'web-stories'
  ),
  INSTRUCTIONS: __(
    'Click on upload or drag a jpg, png, or static gif in the box above. Avoid vector files, such as svg or eps. Logos should be at least 96x96 pixels and a perfect square. The background should not be transparent.',
    'web-stories'
  ),
  SUBMIT: __('Upload', 'web-stories'),
  ARIA_LABEL: __('Click to upload a new logo', 'web-stories'),
  HELPER_UPLOAD: __('You can also drag your logo here', 'web-stories'),
};

function PublisherLogoSettings({ onUpdatePublisherLogo, publisherLogos }) {
  const onSubmitNewFile = useCallback(
    async (files) => {
      const resources = await Promise.all(
        files.map(async (file) => ({
          localResource: await getResourceFromLocalFile(file),
          file,
        }))
      );
      onUpdatePublisherLogo({ newPublisherLogos: resources });
    },
    [onUpdatePublisherLogo]
  );

  const onSubmitDeleteFile = useCallback(
    (_, fileData) => {
      onUpdatePublisherLogo({ deleteLogo: fileData });
    },
    [onUpdatePublisherLogo]
  );

  return (
    <SettingForm>
      <SettingHeading htmlFor="publisherLogo">
        {TEXT.SECTION_HEADING}
      </SettingHeading>
      <div>
        <FileUploadHelperText>{TEXT.CONTEXT}</FileUploadHelperText>
        <UploadContainer
          acceptableFormats={['.jpg', '.jpeg', '.png', '.gif']}
          onSubmit={onSubmitNewFile}
          onDelete={onSubmitDeleteFile}
          id="settings_publisher_logos"
          label={TEXT.SUBMIT}
          isMultiple
          ariaLabel={TEXT.ARIA_LABEL}
          uploadedContent={publisherLogos}
          emptyDragHelperText={TEXT.HELPER_UPLOAD}
        />
        <FinePrintHelperText>{TEXT.INSTRUCTIONS}</FinePrintHelperText>
      </div>
    </SettingForm>
  );
}

PublisherLogoSettings.propTypes = {
  onUpdatePublisherLogo: PropTypes.func,
  publisherLogos: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string,
      title: PropTypes.string,
      alt: PropTypes.string,
      id: PropTypes.string,
    })
  ),
};
export default PublisherLogoSettings;
