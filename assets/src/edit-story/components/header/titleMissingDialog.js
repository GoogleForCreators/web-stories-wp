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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import { TranslateWithMarkup } from '../../../i18n';
import Link from '../link';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  Dialog,
  Text,
  theme as designSystemTheme,
  THEME_CONSTANTS,
} from '../../../design-system';

const link = __(
  'https://amp.dev/documentation/guides-and-tutorials/start/create_successful_stories/#title',
  'web-stories'
);

const robotoTransitionalTheme = {
  ...designSystemTheme,
  typography: {
    ...designSystemTheme.typography,
    family: { primary: '"Roboto", sans-serif' },
  },
};

function TitleMissingDialog({ open, onIgnore, onFix, onClose }) {
  return (
    <ThemeProvider theme={robotoTransitionalTheme}>
      <Dialog
        onClose={onClose}
        isOpen={open}
        title={__('Missing title', 'web-stories')}
        actions={
          <>
            <Button
              size={BUTTON_SIZES.SMALL}
              type={BUTTON_TYPES.TERTIARY}
              onClick={onIgnore}
            >
              {__('Publish without title', 'web-stories')}
            </Button>
            <Button
              size={BUTTON_SIZES.SMALL}
              type={BUTTON_TYPES.PRIMARY}
              onClick={onFix}
            >
              {__('Add a title', 'web-stories')}
            </Button>
          </>
        }
      >
        <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          <TranslateWithMarkup
            mapping={{
              a: <Link href={link} target="_blank" rel="noopener noreferrer" />,
            }}
          >
            {__(
              'We recommend adding a title to the story prior to publishing. <a>Learn more</a>.',
              'web-stories'
            )}
          </TranslateWithMarkup>
        </Text>
      </Dialog>
    </ThemeProvider>
  );
}

TitleMissingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onIgnore: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onFix: PropTypes.func.isRequired,
};

export default TitleMissingDialog;
