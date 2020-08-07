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
import { __, sprintf } from '@wordpress/i18n';

/**
 * External dependencies
 */
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { memo } from 'react';

/**
 * Internal dependencies
 */
import { useConfig } from '../../app/config';
import UploadDropTargetOverlay from './overlay';
import { ReactComponent as UploadIcon } from './icons/upload.svg';

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

const Heading = styled.h4`
  color: ${({ theme }) => theme.colors.fg.v1};
  margin: 0;
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.fg.v1};
`;

const Icon = styled(UploadIcon)`
  height: 54px;
  width: 54px;
  color: ${({ theme }) => theme.colors.fg.v1};
`;

function UploadDropTargetMessage({ message, ...rest }) {
  const { allowedFileTypes } = useConfig();

  return (
    <Container {...rest}>
      <Box>
        <Icon />
        <Heading>{message}</Heading>
        <Text>
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
