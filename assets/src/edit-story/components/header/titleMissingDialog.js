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
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { TranslateWithMarkup } from '../../../i18n';
import { Plain } from '../button';
import Dialog from '../dialog';
import Link from '../link';

const Paragraph = styled.p`
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  line-height: ${({ theme }) => theme.fonts.body1.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body1.letterSpacing};
`;

function TitleMissingDialog({ open, onIgnore, onFix, onClose }) {
  const link = __(
    'https://amp.dev/documentation/guides-and-tutorials/start/create_successful_stories/#title',
    'web-stories'
  );
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={__('Missing title', 'web-stories')}
      actions={
        <>
          <Plain onClick={onFix}>{__('Add a title', 'web-stories')}</Plain>
          <Plain onClick={onIgnore}>
            {__('Publish without title', 'web-stories')}
          </Plain>
        </>
      }
    >
      <Paragraph>
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
      </Paragraph>
    </Dialog>
  );
}

TitleMissingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onIgnore: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onFix: PropTypes.func.isRequired,
};

export default TitleMissingDialog;
