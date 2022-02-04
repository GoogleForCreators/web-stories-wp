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
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import { Modal } from '@googleforcreators/design-system';
import { trackEvent } from '@googleforcreators/tracking';
import { useCallback, useEffect, useState } from '@googleforcreators/react';
/**
 * Internal dependencies
 */
import Header from './header';
import MainContent from './mainContent';

const Container = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.fg.primary};
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border: ${({ theme }) => `1px solid ${theme.colors.divider.primary}`};
  border-radius: ${({ theme }) => theme.borders.radius.medium};
`;

function PublishModal() {
  const [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    if (isOpen) {
      trackEvent('publish_modal');
    }
  }, [isOpen]);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentLabel={__('Story details', 'web-stories')}
      contentStyles={{
        display: 'block',
        width: '71vw',
        minWidth: '917px',
        height: '66vh',
        minHeight: '580px',
      }}
    >
      <Container>
        <Header />
        <MainContent />
      </Container>
    </Modal>
  );
}

export default PublishModal;
