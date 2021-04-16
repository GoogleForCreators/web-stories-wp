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
import { __, sprintf } from '@web-stories-wp/i18n';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { memo } from 'react';

/**
 * Internal dependencies
 */
import { useConfig } from '../../app/config';
import {
  Icons,
  Text as DefaultText,
  THEME_CONSTANTS,
} from '../../../design-system';
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
  const { allowedFileTypes } = useConfig();

  return (
    <Container {...rest}>
      <Box>
        <Icon />
        <Text isBold size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.MEDIUM}>
          {message}
        </Text>
        <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {sprintf(
            /* translators: %s is a list of allowed file extensions. */
            __('You can upload %s.', 'web-stories'),
            allowedFileTypes.join(
              /* translators: delimiter used in a list */
              __(', ', 'web-stories')
            )
          )}
        </Text>
      </Box>
    </Container>
  );
}

UploadDropTargetMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default memo(UploadDropTargetMessage);
