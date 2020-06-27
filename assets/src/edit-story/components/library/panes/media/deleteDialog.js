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
import { useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useAPI } from '../../../../app/api';
import { Plain } from '../../../../components/button';
import Dialog from '../../../../components/dialog';
import { useSnackbar } from '../../../../app/snackbar';
import { useMedia } from '../../../../app/media';

/**
 * Display a confirmation dialog for when a user wants to delete a media element.
 *
 * @param {Object} props Component props.
 * @param {number} props.mediaId Selected media element's ID.
 * @param {string} props.type Selected media element's type.
 * @param {function()} props.onClose Callback to toggle dialog display on close.
 * @return {null|*} The dialog element.
 */
function DeleteDialog({ mediaId, type, onClose }) {
  const {
    actions: { deleteMedia },
  } = useAPI();
  const { showSnackbar } = useSnackbar();
  const { deleteMediaElement } = useMedia((state) => ({
    deleteMediaElement: state.actions.deleteMediaElement,
  }));

  const onDelete = useCallback(async () => {
    onClose();
    try {
      await deleteMedia(mediaId);
      deleteMediaElement({ id: mediaId });
    } catch (err) {
      showSnackbar({
        message: __('Failed to delete media item.', 'web-stories'),
      });
    }
  }, [deleteMedia, deleteMediaElement, mediaId, onClose, showSnackbar]);

  const imageDialogTitle = __('Delete Image?', 'web-stories');
  const videoDialogTitle = __('Delete Video?', 'web-stories');
  const imageDialogDescription = __(
    'You are about to permanently delete this image from your site. ' +
      'The image will appear broken in any WordPress content that uses it. ',
    'web-stories'
  );
  const videoDialogDescription = __(
    'You are about to permanently delete this video from your site. ' +
      'The video will appear broken in any WordPress content that uses it. ',
    'web-stories'
  );

  // Keep icon and menu displayed if menu is open (even if user's mouse leaves the area).
  return (
    <Dialog
      open={true}
      onClose={onClose}
      title={type === 'image' ? imageDialogTitle : videoDialogTitle}
      actions={
        <>
          <Plain onClick={onClose}>{__('Cancel', 'web-stories')}</Plain>
          <Plain onClick={onDelete}>{__('Delete', 'web-stories')}</Plain>
        </>
      }
      maxWidth={512}
    >
      {type === 'image' ? imageDialogDescription : videoDialogDescription}
      <strong>{__('This action can not be undone.', 'web-stories')}</strong>
    </Dialog>
  );
}

DeleteDialog.propTypes = {
  mediaId: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DeleteDialog;
