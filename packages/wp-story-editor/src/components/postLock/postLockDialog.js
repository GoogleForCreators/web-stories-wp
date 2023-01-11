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
  ButtonSize,
  ButtonType,
  TextSize,
} from '@googleforcreators/design-system';
import { Dialog } from '@googleforcreators/story-editor';

/**
 * Internal dependencies
 */
import {
  DialogWrapper,
  DialogText,
  DialogImageWrapper,
  DialogContent,
  Avatar,
} from './shared';

/**
 * @param {Object} props Component props.
 * @param {boolean} props.isOpen If open or not.
 * @param {Object} props.owner Lock owner's user data as a object.
 * @param {string} props.dashboardLink Link to dashboard.
 * @param {string} props.previewLink Preview link.
 * @param {Function} props.onClose Function when dialog is closed.
 * @return {*} Render.
 */
function PostLockDialog({
  isOpen,
  onClose,
  owner,
  dashboardLink,
  previewLink,
}) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
      title={__('This story is already being edited', 'web-stories')}
      actions={
        <>
          <Button
            type={ButtonType.Tertiary}
            size={ButtonSize.Small}
            href={previewLink}
            target="_blank"
            rel="noreferrer"
          >
            {__('Preview', 'web-stories')}
          </Button>
          <Button
            type={ButtonType.Tertiary}
            size={ButtonSize.Small}
            onClick={onClose}
          >
            {__('Take over', 'web-stories')}
          </Button>
          <Button
            type={ButtonType.Primary}
            size={ButtonSize.Small}
            href={dashboardLink}
          >
            {__('Back to dashboard', 'web-stories')}
          </Button>
        </>
      }
    >
      <DialogWrapper>
        {owner?.avatar && (
          <DialogImageWrapper>
            <Avatar
              src={owner.avatar}
              alt={owner.name}
              height={48}
              width={48}
              crossOrigin="anonymous"
              decoding="async"
            />
          </DialogImageWrapper>
        )}
        <DialogContent>
          <DialogText size={TextSize.Small}>
            <>
              {sprintf(
                /* translators: %s: owner's name */
                __(
                  '%s is currently working on this story, which means you cannot make changes, unless you take over.',
                  'web-stories'
                ),
                owner?.name
              )}
            </>
          </DialogText>
          <DialogText size={TextSize.Small}>
            {sprintf(
              /* translators: %s: owner's name */ __(
                'If you take over, %s will lose editing control to the story, but their changes will be saved.',
                'web-stories'
              ),
              owner?.name
            )}
          </DialogText>
        </DialogContent>
      </DialogWrapper>
    </Dialog>
  );
}

PostLockDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  owner: PropTypes.object,
  dashboardLink: PropTypes.string.isRequired,
  previewLink: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default PostLockDialog;
