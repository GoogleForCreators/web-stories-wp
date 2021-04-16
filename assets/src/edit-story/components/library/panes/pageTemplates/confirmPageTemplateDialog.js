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
import { Text, THEME_CONSTANTS } from '../../../../../design-system';
import Dialog from '../../../dialog';

function ConfirmPageTemplateDialog({ onClose, onConfirm }) {
  return (
    <Dialog
      isOpen
      onClose={onClose}
      title={__('Confirm Page Template', 'web-stories')}
      secondaryText={__('Cancel', 'web-stories')}
      onPrimary={onConfirm}
      primaryText={__('Apply Page Template', 'web-stories')}
    >
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {__(
          'Applying page template will clear all existing design elements and background colors on this page. Want to keep going?',
          'web-stories'
        )}
      </Text>
    </Dialog>
  );
}

ConfirmPageTemplateDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmPageTemplateDialog;
