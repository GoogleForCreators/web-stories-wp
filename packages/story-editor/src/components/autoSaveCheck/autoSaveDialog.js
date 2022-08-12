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
import { Text, THEME_CONSTANTS } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import { __ } from '@googleforcreators/i18n';
import Dialog from '../dialog';

export const AutoSaveDialog = ({ onClose, isOpen, onPrimary }) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={__('AutoSave', 'web-stories')}
      contentLabel={__('AutoSave Available', 'web-stories')}
      secondaryText={__('Dismiss', 'web-stories')}
      onPrimary={onPrimary}
      primaryText={__('View the autosave', 'web-stories')}
    >
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {__(
          'There is an autosave of this story that is more recent than the version your editing.',
          'web-stories'
        )}
      </Text>
    </Dialog>
  );
};

AutoSaveDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onPrimary: PropTypes.func.isRequired,
};
