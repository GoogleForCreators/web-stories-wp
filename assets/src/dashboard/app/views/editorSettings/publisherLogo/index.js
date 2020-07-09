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
 * Internal dependencies
 */
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
};
function PublisherLogoSettings() {
  return (
    <SettingForm>
      <SettingHeading htmlFor="publisherLogo">
        {TEXT.SECTION_HEADING}
      </SettingHeading>
      <div>
        <FileUploadHelperText>{TEXT.CONTEXT}</FileUploadHelperText>
        <UploadContainer>
          <p>{'Upload Placeholder'}</p>
          <button>{TEXT.SUBMIT}</button>
        </UploadContainer>
        <FinePrintHelperText>{TEXT.INSTRUCTIONS}</FinePrintHelperText>
      </div>
    </SettingForm>
  );
}

export default PublisherLogoSettings;
