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
import PropTypes from 'prop-types';
import { __ } from '@googleforcreators/i18n';
import { Text, THEME_CONSTANTS } from '@googleforcreators/design-system';
import { useCallback, useEffect } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import Dialog from '../dialog';
import { useCheckpoint } from './checkpointContext';

const TEXT = {
  TITLE: __('Review checklist before publishing.', 'web-stories'),
  SECONDARY_BUTTON: __('Continue to publish', 'web-stories'),
  PRIMARY_BUTTON: __('Review Checklist', 'web-stories'),
  BODY: __(
    'Complete checklist items to make this Web Story easier to discover on Google Search.',
    'web-stories'
  ),
};

const TRANSITION_DURATION = 300;

function ReviewChecklistDialog({
  isOpen: _isOpen,
  onIgnore,
  onReview,
  onClose,
}) {
  const { shouldReviewDialogBeSeen, onReviewDialogRequest } = useCheckpoint(
    ({
      actions: { onReviewDialogRequest },
      state: { shouldReviewDialogBeSeen },
    }) => ({
      shouldReviewDialogBeSeen,
      onReviewDialogRequest,
    })
  );

  const isOpen = _isOpen && shouldReviewDialogBeSeen;

  const openChecklist = useCallback(() => {
    onReviewDialogRequest();
  }, [onReviewDialogRequest]);

  const onPrimary = useCallback(() => {
    onReview?.();
    // Focus Checklist Tab
    // eslint-disable-next-line @wordpress/react-no-unsafe-timeout -- If component unmounts, nothing bad can happen
    setTimeout(() => openChecklist(), TRANSITION_DURATION);
  }, [onReview, openChecklist]);

  useEffect(() => {
    if (isOpen) {
      trackEvent('review_prepublish_checklist');
    }
  }, [isOpen]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={TEXT.TITLE}
      onSecondary={onIgnore}
      secondaryText={TEXT.SECONDARY_BUTTON}
      primaryText={TEXT.PRIMARY_BUTTON}
      onPrimary={onPrimary}
      id="modal-review-checklist"
      contentStyles={{
        width: '434px',
      }}
    >
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {TEXT.BODY}
      </Text>
    </Dialog>
  );
}

ReviewChecklistDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onIgnore: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onReview: PropTypes.func.isRequired,
};

export default ReviewChecklistDialog;
