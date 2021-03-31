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
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '../../../design-system';
import { Img, Paragraph } from './shared';

/**
 * @param {Object} props Component props.
 * @param {boolean} props.open If open or not.
 * @param {Object} props.user Lock owner's user data as a object.
 * @param {string} props.dashboardLink Link to dashboard.
 * @param {Function} props.onClose Function when dialog is closed.
 * @return {*} Render.
 */
function PostTakeOverDialog({ open, user, dashboardLink, onClose }) {
  const dialogTile = __(
    'Someone else has taken over this story.',
    'web-stories'
  );
  const dialogContent = sprintf(
    /* translators: %s: user's name */
    __('%s now has editing control of this story.', 'web-stories'),
    user?.name
  );

  return (
    <Dialog
      open={open}
      title={dialogTile}
      contentLabel={dialogTile}
      onClose={onClose}
      actions={
        <Button
          type={BUTTON_TYPES.QUATERNARY}
          size={BUTTON_SIZES.SMALL}
          variant={BUTTON_VARIANTS.RECTANGLE}
          href={dashboardLink}
        >
          {__('My Stories', 'web-stories')}
        </Button>
      }
    >
      <Paragraph>
        {user.avatar && (
          <Img src={user.avatar} alt={user.name} height={48} width={48} />
        )}
        {dialogContent}
      </Paragraph>
    </Dialog>
  );
}

PostTakeOverDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  user: PropTypes.object,
  dashboardLink: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PostTakeOverDialog;
