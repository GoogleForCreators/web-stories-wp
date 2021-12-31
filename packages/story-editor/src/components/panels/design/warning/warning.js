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
import { Text, Icons, useLiveRegion } from '@web-stories-wp/design-system';

const WarningContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  margin: 14px auto;
  border: 1px solid ${({ theme }) => theme.colors.border.defaultHover};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  padding: 8px;
  color: ${({ theme }) => theme.colors.fg.primary};
  font-weight: ${({ theme }) => theme.typography.weight.regular};
`;
const WarningIcon = styled(Icons.WarningLow)`
  width: 32px;
  height: 100%;
  color: #f4b844;
`;

const Message = styled(Text)`
  width: 100%;
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
