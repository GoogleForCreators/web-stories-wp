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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Text, THEME_CONSTANTS } from '../../../../design-system';
import Dialog from '../../dialog';

const TEXT = {
  TITLE: __('Review checklist before publishing.', 'web-stories'),
  SECONDARY_BUTTON: __('Continue to publish', 'web-stories'),
  PRIMARY_BUTTON: __('Review Checklist', 'web-stories'),
  BODY: __(
    'Complete checklist items to make this Web Story easier to discover on Google Search.',
    'web-stories'
  ),
};

function ReviewChecklistDialog({ isOpen, onIgnore, onReview, onClose }) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={TEXT.TITLE}
      onSecondary={onIgnore}
      secondaryText={TEXT.SECONDARY_BUTTON}
      primaryText={TEXT.PRIMARY_BUTTON}
      onPrimary={onReview}
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
