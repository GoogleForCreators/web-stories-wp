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
import { __, sprintf } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  THEME_CONSTANTS,
  Text,
} from '@googleforcreators/design-system';
import { Dialog } from '@googleforcreators/story-editor';

/**
 * Internal dependencies
 */
import { Img } from './shared';

/**
 * @param {Object} props Component props.
 * @param {boolean} props.isOpen If open or not.
 * @param {Object} props.user Lock owner's user data as a object.
 * @param {string} props.dashboardLink Link to dashboard.
 * @param {string} props.previewLink Preview link.
 * @param {Function} props.onClose Function when dialog is closed.
 * @param {boolean} props.showTakeOver Weather or not to show take over button.
 * @return {*} Render.
 */
function PostLockDialog({
  isOpen,
  onClose,
  user,
  dashboardLink,
  previewLink,
  showTakeOver = false,
}) {
  const dialogTile = __('Story is locked', 'web-stories');
  const dialogContent = showTakeOver
    ? sprintf(
        /* translators: %s: user's name */
        __(
          '%s is already editing this story. Do you want to take over?',
          'web-stories'
        ),
        user?.name
      )
    : sprintf(
        /* translators: %s: user's name */
        __('%s is already editing this story.', 'web-stories'),
        user?.name
      );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={dialogTile}
      contentLabel={dialogTile}
      actions={
        <>
          <Button
            type={BUTTON_TYPES.TERTIARY}
            size={BUTTON_SIZES.SMALL}
            href={dashboardLink}
          >
            {__('Dashboard', 'web-stories')}
          </Button>
          <Button
            type={BUTTON_TYPES.TERTIARY}
            size={BUTTON_SIZES.SMALL}
            href={previewLink}
            target="_blank"
          >
            {__('Preview', 'web-stories')}
          </Button>
          {showTakeOver && (
            <Button
              type={BUTTON_TYPES.TERTIARY}
              size={BUTTON_SIZES.SMALL}
              onClick={onClose}
            >
              {__('Take over', 'web-stories')}
            </Button>
          )}
        </>
      }
    >
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {user?.avatar && (
          <Img
            src={user.avatar}
            alt={user.name}
            height={48}
            width={48}
            crossOrigin="anonymous"
            decoding="async"
          />
        )}
        {dialogContent}
      </Text>
    </Dialog>
  );
}

PostLockDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  showTakeOver: PropTypes.bool,
  user: PropTypes.object,
  dashboardLink: PropTypes.string.isRequired,
  previewLink: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default PostLockDialog;
