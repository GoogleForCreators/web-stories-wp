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

const _Header = styled.header`
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  margin-bottom: 1px;
  background-color: ${({ theme }) => theme.colors.bg.secondary};

  & > button:first-of-type {
    margin: 0 auto 0 6px;
  }
  & > button:last-of-type {
    margin: 0 6px 0 auto;
  }
`;

const PublishButton = styled(Button)`
  height: 32px;
`;

const Header = ({ isPublishEnabled, onClose, onPublish }) => {
  return (
    <_Header>
      <Button
        variant={BUTTON_VARIANTS.SQUARE}
        size={BUTTON_SIZES.SMALL}
        type={BUTTON_TYPES.TERTIARY}
        onClick={onClose}
        aria-label={__('Close', 'web-stories')}
      >
        <Icons.Cross />
      </Button>
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
        disabled={!isPublishEnabled}
        onClick={onPublish}
      >
        {__('Publish', 'web-stories')}
      </PublishButton>
    </_Header>
  );
};

export default Header;

Header.propTypes = {
  isPublishEnabled: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired,
};
