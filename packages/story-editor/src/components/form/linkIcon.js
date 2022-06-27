/*
 * Copyright 2021 Google LLC
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
import { useMemo } from '@googleforcreators/react';
import { getExtensionsFromMimeType } from '@googleforcreators/media';
import PropTypes from 'prop-types';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import { __, sprintf, translateToExclusiveList } from '@googleforcreators/i18n';
import { MEDIA_VARIANTS } from '@googleforcreators/design-system';
import { useConfig } from '../../app';
import Media from './media';

const StyledMedia = styled(Media)`
  width: 54px;
  height: 54px;
`;

function LinkIcon({ handleChange, icon, isLoading = false, ...rest }) {
  const enableHotlinking = useFeature('linkIconHotlinking');
  const {
    allowedMimeTypes: { image: allowedImageMimeTypes },
    capabilities: { hasUploadMediaAction },
  } = useConfig();

  const allowedImageFileTypes = useMemo(
    () =>
      allowedImageMimeTypes
        .map((type) => getExtensionsFromMimeType(type))
        .flat(),
    [allowedImageMimeTypes]
  );

  const iconErrorMessage = useMemo(() => {
    let message = __(
      'No image file types are currently supported.',
      'web-stories'
    );

    if (allowedImageFileTypes.length) {
      message = sprintf(
        /* translators: %s: list of allowed file types. */
        __('Please choose only %s as an icon.', 'web-stories'),
        translateToExclusiveList(allowedImageFileTypes)
      );
    }

    return message;
  }, [allowedImageFileTypes]);

  const options = [
    enableHotlinking && hasUploadMediaAction && 'upload',
    !enableHotlinking && hasUploadMediaAction && 'edit',
    enableHotlinking && 'hotlink',
    icon && 'remove',
  ].filter(Boolean);

  return (
    <StyledMedia
      value={icon || ''}
      cropParams={{
        width: 96,
        height: 96,
      }}
      onChange={handleChange}
      onChangeErrorText={iconErrorMessage}
      title={__('Select as link icon', 'web-stories')}
      ariaLabel={__('Edit link icon', 'web-stories')}
      buttonInsertText={__('Select as link icon', 'web-stories')}
      hotlinkTitle={__('Use external image as link icon', 'web-stories')}
      hotlinkInsertText={__('Use image as link icon', 'web-stories')}
      hotlinkInsertingText={__('Using image as link icon', 'web-stories')}
      type={allowedImageMimeTypes}
      isLoading={isLoading}
      variant={MEDIA_VARIANTS.CIRCLE}
      canUpload={options.length !== 0}
      menuOptions={options}
      {...rest}
    />
  );
}

LinkIcon.propTypes = {
  icon: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
};

export default LinkIcon;
