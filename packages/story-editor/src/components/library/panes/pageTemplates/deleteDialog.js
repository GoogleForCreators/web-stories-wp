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
import { Text, TextSize } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import Dialog from '../../../dialog';

/**
 * Display a confirmation dialog for when a user wants to delete a template.
 *
 * @param {Function} props.onClose Callback to toggle dialog display on close.
 * @param {Function} props.onDelete Callback to delete template.
 * @return {null|*} The dialog element.
 */
function DeleteDialog({ onClose, onDelete }) {
  return (
    <Dialog
      isOpen
      onClose={onClose}
      title={__('Delete Page Template', 'web-stories')}
      secondaryText={__('Cancel', 'web-stories')}
      onPrimary={onDelete}
      primaryText={__('Delete', 'web-stories')}
    >
      <Text.Paragraph size={TextSize.Small}>
        {__(
          'Are you sure you want to delete this template? This action cannot be undone.',
          'web-stories'
        )}
      </Text.Paragraph>
    </Dialog>
  );
}

DeleteDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteDialog;
