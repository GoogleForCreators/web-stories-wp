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
import { Modal, theme } from '@googleforcreators/design-system';
import { trackEvent } from '@googleforcreators/tracking';
import { useCallback, useEffect } from '@googleforcreators/react';
/**
 * Internal dependencies
 */
import { useCheckpoint } from '../checklist';
import DirectionAware from '../directionAware';
import Header from './header';
import Content from './content';

const Container = styled.div`
  height: 100%;
  color: ${theme.colors.fg.primary};
  background-color: ${theme.colors.bg.primary};
  border: ${`1px solid ${theme.colors.divider.primary}`};
  border-radius: ${theme.borders.radius.medium};
`;

function PublishModal({
  isOpen,
  onPublish,
  onClose,
  publishButtonDisabled,
  hasFutureDate,
}) {
  const openChecklist = useCheckpoint(
    ({ actions }) => actions.onPublishDialogChecklistRequest
  );

  useEffect(() => {
    if (isOpen) {
      trackEvent('publish_modal');
    }
  }, [isOpen]);

  const handleReviewChecklist = useCallback(() => {
    trackEvent('review_prepublish_checklist');
    onClose();
    openChecklist();
  }, [onClose, openChecklist]);

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
        overflow: 'hidden',
      }}
      overlayStyles={{
        backgroundColor: theme.colors.inverted.interactiveBg.modalScrim,
      }}
    >
      {isOpen && (
        <DirectionAware>
          <Container>
            <Header
              hasFutureDate={hasFutureDate}
              publishButtonDisabled={publishButtonDisabled}
              onClose={onClose}
              onPublish={onPublish}
            />
            <Content handleReviewChecklist={handleReviewChecklist} />
          </Container>
        </DirectionAware>
      )}
    </Modal>
  );
}

export default PublishModal;

PublishModal.propTypes = {
  isOpen: PropTypes.bool,
  onPublish: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  hasFutureDate: PropTypes.bool,
  publishButtonDisabled: PropTypes.bool,
};
