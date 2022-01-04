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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';
import { useEffect } from '@web-stories-wp/react';
import {
  Text,
  Icons,
  useLiveRegion,
  THEME_CONSTANTS,
} from '@web-stories-wp/design-system';

const WarningContainer = styled.div`
  display: flex;
  gap: 8px;
  margin: 14px auto;
  border: 1px solid ${({ theme }) => theme.colors.border.defaultHover};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  padding: 8px;
`;

const WarningIcon = styled(Icons.ExclamationTriangle)`
  width: 32px;
  height: 100%;
  color: ${({ theme }) => theme.colors.warning.yellow};
`;

const Message = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  max-width: calc(100% - 40px);
`;

function Warning({ message }) {
  const speak = useLiveRegion('assertive');

  useEffect(() => {
    speak(message);
  }, [message, speak]);
  return (
    <WarningContainer>
      <WarningIcon title={__('Low Warning', 'web-stories')} />
      <Message>{message}</Message>
    </WarningContainer>
  );
}

Warning.propTypes = {
  message: PropTypes.string,
};

export default Warning;
