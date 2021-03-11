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
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  Dialog,
  Text,
  THEME_CONSTANTS,
} from '../../../../../design-system';

function ConfirmPageLayoutDialog({ onClose, onConfirm }) {
  return (
    <Dialog
      isOpen
      onClose={onClose}
      title={__('Confirm Page Layout', 'web-stories')}
      actions={
        <>
          <Button
            type={BUTTON_TYPES.TERTIARY}
            size={BUTTON_SIZES.SMALL}
            onClick={onClose}
          >
            {__('Cancel', 'web-stories')}
          </Button>
          <Button
            type={BUTTON_TYPES.PRIMARY}
            size={BUTTON_SIZES.SMALL}
            onClick={onConfirm}
          >
            {__('Apply Page Layout', 'web-stories')}
          </Button>
        </>
      }
    >
      <Text as="p" size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {__(
          'Applying page layout will clear all existing design elements and background colors on this page. Want to keep going?',
          'web-stories'
        )}
      </Text>
    </Dialog>
  );
}

ConfirmPageLayoutDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmPageLayoutDialog;
