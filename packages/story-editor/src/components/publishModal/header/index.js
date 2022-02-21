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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Headline,
  Icons,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import { HEADER_BAR_HEIGHT, HEADER_BAR_MARGIN } from '../constants';

const _Header = styled.header`
  width: 100%;
  height: ${HEADER_BAR_HEIGHT};
  display: flex;
  align-items: center;
  margin-bottom: ${HEADER_BAR_MARGIN};
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  border-top-left-radius: ${({ theme }) => theme.borders.radius.medium};
  border-top-right-radius: ${({ theme }) => theme.borders.radius.medium};
`;

const CloseButton = styled(Button)`
  margin: 6px auto 5px 6px;
`;

const PublishButton = styled(Button)`
  height: 32px;
  padding: 6px 8px;
  margin: 6px 6px 5px auto;
`;

const Header = ({ onClose, onPublish, publishButtonCopy }) => {
  return (
    <_Header>
      <CloseButton
        variant={BUTTON_VARIANTS.SQUARE}
        size={BUTTON_SIZES.SMALL}
        type={BUTTON_TYPES.TERTIARY}
        onClick={onClose}
        aria-label={__('Close', 'web-stories')}
      >
        <Icons.Cross />
      </CloseButton>
      <Headline
        as="h2"
        size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XXX_SMALL}
      >
        {__('Story Details', 'web-stories')}
      </Headline>
      <PublishButton
        variant={BUTTON_VARIANTS.RECTANGLE}
        size={BUTTON_SIZES.SMALL}
        type={BUTTON_TYPES.PRIMARY}
        onClick={onPublish}
      >
        {publishButtonCopy}
      </PublishButton>
    </_Header>
  );
};

export default Header;

Header.propTypes = {
  onClose: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired,
  publishButtonCopy: PropTypes.string.isRequired,
};
