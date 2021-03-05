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
import { __, sprintf } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import Dialog from '../dialog';
import { Plain } from '../button';
import { Img, Paragraph } from './shared';

function PostLockDialog({ open, user, dashboardLink, previewLink, onClose }) {
  const dialogTile = __('Story is locked', 'web-stories');
  const dialogContent = sprintf(
    /* translators: %s: user's name */
    __(
      '%s is already editing this story. Do you want to take over? ',
      'web-stories'
    ),
    user?.name
  );

  return (
    <Dialog
      open={open}
      title={dialogTile}
      contentLabel={dialogTile}
      actions={
        <>
          <Plain href={dashboardLink}>{__('My Stories', 'web-stories')}</Plain>
          <Plain href={previewLink}>{__('Preview', 'web-stories')}</Plain>
          <Plain onClick={onClose}>{__('Take over', 'web-stories')}</Plain>
        </>
      }
    >
      <Paragraph>
        {user['avatar_urls'] && (
          <Img
            src={user['avatar_urls']['48']}
            alt={user.name}
            height={48}
            width={48}
          />
        )}
        {dialogContent}
      </Paragraph>
    </Dialog>
  );
}

PostLockDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  user: PropTypes.object,
  dashboardLink: PropTypes.string.isRequired,
  previewLink: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PostLockDialog;
