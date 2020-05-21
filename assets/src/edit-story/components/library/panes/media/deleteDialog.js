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
import styled from 'styled-components';
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

const DialogBody = styled.div`
  width: 512px;
  font-family: ${({ theme }) => theme.fonts.body1.family};
  line-height: ${({ theme }) => theme.fonts.body1.lineHeight};
  font-weight: ${({ theme }) => theme.fonts.body1.weight};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  color: ${({ theme }) => theme.colors.fg.v0};
`;

/**
 * Display a confirmation dialog for when a user wants to delete a media element.
 *
 * @param {Object} props Component props.
 * @param {number} props.mediaId Selected media element.
 * @param {function()} props.onClose Callback to toggle dialog display on close.
 * @return {null|*} The dialog element.
 */
function DeleteDialog({ mediaId, onClose }) {
  const {
    actions: { deleteMedia },
  } = useAPI();
  const { showSnackbar } = useSnackbar();
  const {
    actions: { deleteMediaElement },
  } = useMedia();

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

  // Keep icon and menu displayed if menu is open (even if user's mouse leaves the area).
  return (
    <Dialog
      open={true}
      onClose={() => onClose()}
      title={__('Delete image/video?', 'web-stories')}
      actions={
        <>
          <Plain data-testid="cancel" onClick={() => onClose()}>
            {__('Cancel', 'web-stories')}
          </Plain>
          <Plain data-testid="delete" onClick={() => onDelete()}>
            {__('Delete', 'web-stories')}
          </Plain>
        </>
      }
    >
      <DialogBody>
        {__(
          'You are about to permanently delete this image/video from your site. ' +
            'The image/video will appear broken in any stories that uses it. ',
          'web-stories'
        )}
        <strong>{__('This action can not be undone.', 'web-stories')}</strong>
      </DialogBody>
    </Dialog>
  );
}

DeleteDialog.propTypes = {
  mediaId: PropTypes.number,
  onClose: PropTypes.func,
};

export default DeleteDialog;
