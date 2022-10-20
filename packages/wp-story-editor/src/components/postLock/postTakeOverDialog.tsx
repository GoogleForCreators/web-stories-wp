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
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';
import { Dialog } from '@googleforcreators/story-editor';

/**
 * Internal dependencies
 */
import type { User } from '../../types';
import {
  DialogWrapper,
  DialogText,
  DialogImageWrapper,
  DialogContent,
  Avatar,
} from './shared';

interface PostTakeOverDialogProps {
  isOpen: bool;
  user?: User;
  dashboardLink: string;
  previewLink: string;
  onClose: () => void;
}

/**
 * @param props Component props.
 * @param props.isOpen If open or not.
 * @param props.user Lock owner's user data as a object.
 * @param props.dashboardLink Link to dashboard.
 * @param props.previewLink Preview link.
 * @param props.onClose Function when dialog is closed.
 * @return Render.
 */
function PostTakeOverDialog({
  isOpen,
  user,
  dashboardLink,
  previewLink,
  onClose,
}: PostTakeOverDialogProps) {
  return (
    <Dialog
      isOpen={isOpen}
      title={__('Someone else has taken over this story', 'web-stories')}
      onClose={onClose}
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
      actions={
        <>
          <Button
            type={BUTTON_TYPES.TERTIARY}
            size={BUTTON_SIZES.SMALL}
            href={previewLink}
            target="_blank"
            rel="noreferrer"
          >
            {__('Preview', 'web-stories')}
          </Button>
          <Button
            type={BUTTON_TYPES.PRIMARY}
            size={BUTTON_SIZES.SMALL}
            variant={BUTTON_VARIANTS.RECTANGLE}
            href={dashboardLink}
          >
            {__('Back to dashboard', 'web-stories')}
          </Button>
        </>
      }
    >
      <DialogWrapper>
        {user && user?.avatar && (
          <DialogImageWrapper>
            <Avatar
              src={user.avatar}
              alt={user.name}
              height={48}
              width={48}
              crossOrigin="anonymous"
              decoding="async"
            />
          </DialogImageWrapper>
        )}

        <DialogContent>
          <DialogText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
            {sprintf(
              /* translators: %s: user's name */
              __('%s now has editing control of this story.', 'web-stories'),
              user?.name
            )}
          </DialogText>

          <DialogText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
            {__(
              "Don't worry, your changes up to this moment have been saved",
              'web-stories'
            )}
          </DialogText>
        </DialogContent>
      </DialogWrapper>
    </Dialog>
  );
}

export default PostTakeOverDialog;
