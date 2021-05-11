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
import { __ } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { Text } from '../../../../../design-system/components/typography/text';
import { THEME_CONSTANTS } from '../../../../../design-system/theme/constants';
import Dialog from '../../../dialog';
import { PRESET_TYPES } from './constants';

function ConfirmationDialog({ onClose, onPrimary, presetType }) {
  const isColor = PRESET_TYPES.COLOR === presetType;
  const dialogText = isColor
    ? __(
        'This is a global color. Deleting this color will remove it from the Saved Colors panel across all stories and the color will no longer be available to any other users on the site.',
        'web-stories'
      )
    : __(
        'This is a global style. Deleting this style will remove it from the Saved Styles panel across all stories and the style will no longer be available to any other users on the site.',
        'web-stories'
      );
  return (
    <Dialog
      isOpen
      onClose={onClose}
      secondaryText={__('Cancel', 'web-stories')}
      onPrimary={onPrimary}
      primaryText={__('Delete', 'web-stories')}
    >
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {dialogText}
      </Text>
    </Dialog>
  );
}

ConfirmationDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onPrimary: PropTypes.func.isRequired,
  presetType: PropTypes.string.isRequired,
};

export default ConfirmationDialog;
