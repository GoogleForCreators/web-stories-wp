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
import { Plain } from '../button';
import Dialog from '../dialog';
import Link from '../link';

const Paragraph = styled.p`
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  line-height: ${({ theme }) => theme.fonts.body1.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body1.letterSpacing};
`;

const GUIDELINES =
  'https://drive.google.com/corp/drive/folders/1dqPtjNTYN7OxTngWAYhy8zn8X3EuRTGJ';

function TitleMissingDialog({ open, onIgnore, onFix }) {
  return (
    <Dialog
      open={open}
      onClose={onFix}
      title={__('Title missing!', 'web-stories')}
      actions={
        <>
          <Plain onClick={onIgnore}>
            {__('Publish anyway', 'web-stories')}
          </Plain>
          <Plain onclick={onFix}>{__('Add a title', 'web-stories')}</Plain>
        </>
      }
    >
      <Paragraph>
        {__('Your story is missing a title!', 'web-stories')}
      </Paragraph>
      <Paragraph>
        {__(
          'Research shows that stories with a good short title perform much better.',
          'web-stories'
        )}
      </Paragraph>
      <Paragraph>
        <Link href={GUIDELINES} target="_blank" rel="noopener noreferrer">
          {__('See our guidelines to learn more.', 'web-stories')}
        </Link>
      </Paragraph>
      <Paragraph>
        {__(
          'Do you want to go ahead and publish anyway or do you want to add a title?',
          'web-stories'
        )}
      </Paragraph>
    </Dialog>
  );
}

TitleMissingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onIgnore: PropTypes.func.isRequired,
  onFix: PropTypes.func.isRequired,
};

export default TitleMissingDialog;
