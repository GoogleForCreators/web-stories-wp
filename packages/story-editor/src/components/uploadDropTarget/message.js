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
import { getExtensionsFromMimeType } from '@googleforcreators/media';
import { __, sprintf, translateToExclusiveList } from '@googleforcreators/i18n';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { memo, useMemo } from '@googleforcreators/react';
import {
  Icons,
  Text as DefaultText,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import { useConfig } from '../../app/config';
import UploadDropTargetOverlay from './overlay';

const Container = styled(UploadDropTargetOverlay)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Box = styled.div`
  width: 100%;
  max-width: 240px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Text = styled(DefaultText)`
  color: ${({ theme }) => theme.colors.standard.white};
  margin-bottom: 14px;
  margin-top: 0px;
`;

const Icon = styled(Icons.ArrowCloud)`
  height: 52px;
  width: 52px;
  color: ${({ theme }) => theme.colors.standard.white};
`;

function UploadDropTargetMessage({ message, ...rest }) {
  const {
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      vector: allowedVectorMimeTypes,
      video: allowedVideoMimeTypes,
    },
  } = useConfig();

  const allowedMimeTypes = useMemo(
    () => [
      ...allowedImageMimeTypes,
      ...allowedVectorMimeTypes,
      ...allowedVideoMimeTypes,
    ],
    [allowedImageMimeTypes, allowedVideoMimeTypes, allowedVectorMimeTypes]
  );
  const allowedFileTypes = useMemo(
    () =>
      allowedMimeTypes.map((type) => getExtensionsFromMimeType(type)).flat(),
    [allowedMimeTypes]
  );

  let description = __('No file types are currently supported.', 'web-stories');

  if (allowedFileTypes.length) {
    description = sprintf(
      /* translators: %s is a list of allowed file extensions. */
      __('You can upload %s.', 'web-stories'),
      translateToExclusiveList(allowedFileTypes)
    );
  }

  return (
    <Container {...rest}>
      <Box>
        <Icon />
        <Text isBold size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.MEDIUM}>
          {message}
        </Text>
        <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {description}
        </Text>
      </Box>
    </Container>
  );
}

UploadDropTargetMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default memo(UploadDropTargetMessage);
