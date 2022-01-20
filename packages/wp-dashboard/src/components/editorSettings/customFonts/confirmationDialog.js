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
import { __ } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import {
  Text,
  THEME_CONSTANTS,
  Dialog,
  BUTTON_TYPES,
  BUTTON_SIZES,
  Button,
  theme,
} from '@googleforcreators/design-system';

function ConfirmationDialog({ onClose, onPrimary }) {
  return (
    <ThemeProvider theme={theme}>
      <Dialog
        isOpen
        onClose={onClose}
        title={__('Delete Font', 'web-stories')}
        actions={
          <>
            <Button
              type={BUTTON_TYPES.TERTIARY}
              size={BUTTON_SIZES.SMALL}
              onClick={() => onClose()}
            >
              {__('Cancel', 'web-stories')}
            </Button>
            <Button
              type={BUTTON_TYPES.PRIMARY}
              size={BUTTON_SIZES.SMALL}
              onClick={() => onPrimary()}
            >
              {__('Delete Font', 'web-stories')}
            </Button>
          </>
        }
      >
        <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {__(
            'Deleting a font will delete it from every previous story it’s in. Would you like to proceed?',
            'web-stories'
          )}
        </Text>
      </Dialog>
    </ThemeProvider>
  );
}

ConfirmationDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onPrimary: PropTypes.func.isRequired,
};

export default ConfirmationDialog;
