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
import { useEffect, useState } from 'react';

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

const Bold = styled.span`
  font-weight: bold;
`;

/**
 * Display a confirmation dialog for when a user wants to delete a media element.
 *
 * @param {Object} props Component props.
 * @param {number} props.mediaId Selected media element.
 * @param {boolean} props.showDeleteDialog If dialog should be displayed.
 * @param {function(boolean)} props.setShowDeleteDialog Callback to toggle dialog display.
 * @return {null|*} The dialog element.
 */
function DeleteDialog({ mediaId, showDeleteDialog, setShowDeleteDialog }) {
  const {
    actions: { deleteMedia },
  } = useAPI();
  const { showSnackbar } = useSnackbar();
  const {
    actions: { deleteMediaElement },
  } = useMedia();

  const [shouldDelete, setShouldDelete] = useState(false);

  useEffect(() => {
    const deleteMediaItem = async () => {
      setShouldDelete(false);
      setShowDeleteDialog(false);
      try {
        await deleteMedia(mediaId);
        deleteMediaElement({ id: mediaId });
      } catch (err) {
        showSnackbar({
          message: __('Failed to delete media item.', 'web-stories'),
        });
      }
    };
    shouldDelete ? deleteMediaItem() : null;
  }, [
    deleteMedia,
    deleteMediaElement,
    mediaId,
    setShowDeleteDialog,
    shouldDelete,
    showSnackbar,
  ]);

  // Keep icon and menu displayed if menu is open (even if user's mouse leaves the area).
  return (
    <Dialog
      open={showDeleteDialog}
      onClose={() => setShowDeleteDialog(false)}
      title={__('Delete image/video?', 'web-stories')}
      actions={
        <>
          <Plain
            data-testid="cancel"
            onClick={() => setShowDeleteDialog(false)}
          >
            {__('Cancel', 'web-stories')}
          </Plain>
          <Plain data-testid="delete" onClick={() => setShouldDelete(true)}>
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
        <Bold>{__('This action can not be undone.', 'web-stories')}</Bold>
      </DialogBody>
    </Dialog>
  );
}

DeleteDialog.propTypes = {
  mediaId: PropTypes.number,
  showDeleteDialog: PropTypes.bool,
  setShowDeleteDialog: PropTypes.func,
};

export default DeleteDialog;
