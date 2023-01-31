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
import { __ } from '@googleforcreators/i18n';
import {
  Text,
  TextSize,
  Button,
  ButtonSize,
  ButtonType,
  ButtonAsLink,
} from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import Dialog from '../dialog';

export const AutoSaveDialog = ({ onClose, isOpen, autoSaveLink }) => {
  return (
    <Dialog
      isOpen={isOpen}
      title={__('Autosave', 'web-stories')}
      contentLabel={__('Autosave Available', 'web-stories')}
      secondaryText={__('Dismiss', 'web-stories')}
      onClose={onClose}
      actions={
        <>
          <Button
            type={ButtonType.Tertiary}
            size={ButtonSize.Small}
            onClick={onClose}
          >
            {__('Dismiss', 'web-stories')}
          </Button>
          <ButtonAsLink
            type={ButtonType.Primary}
            size={ButtonSize.Small}
            href={autoSaveLink}
          >
            {__('View the autosave', 'web-stories')}
          </ButtonAsLink>
        </>
      }
    >
      <Text.Paragraph size={TextSize.Small}>
        {__(
          'There is an autosave of this story that is more recent than the version you are editing.',
          'web-stories'
        )}
      </Text.Paragraph>
    </Dialog>
  );
};

AutoSaveDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  autoSaveLink: PropTypes.string.isRequired,
};
