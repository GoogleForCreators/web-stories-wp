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
import { useCallback } from 'react';
import { Plain } from '../button';
import Dialog from '../dialog';
import Link from '../link';
import { trackClick } from '../../../tracking';
import { TranslateWithMarkup } from '../../../i18n';

const Paragraph = styled.p`
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  line-height: ${({ theme }) => theme.fonts.body1.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body1.letterSpacing};
`;

function PostPublishDialog({ open, onClose, confirmURL, storyURL }) {
  const onAddToPostClick = useCallback(
    (evt) => {
      trackClick(evt, 'add_story_to_new_post', 'editor', confirmURL);
    },
    [confirmURL]
  );

  const onViewStoryClick = useCallback(
    (evt) => {
      trackClick(evt, 'view_story', 'editor', storyURL);
    },
    [storyURL]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={__('Story published!', 'web-stories')}
      actions={
        <>
          <Plain onClick={onClose}>{__('Dismiss', 'web-stories')}</Plain>
          <Plain href={confirmURL} onClick={onAddToPostClick}>
            {__('Add to new post', 'web-stories')}
          </Plain>
        </>
      }
    >
      <Paragraph>
        <TranslateWithMarkup
          mapping={{
            a: (
              <Link
                href={storyURL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onViewStoryClick}
              />
            ),
          }}
        >
          {__(
            'Your story has been successfully published! <a>View story</a>.',
            'web-stories'
          )}
        </TranslateWithMarkup>
      </Paragraph>
      <Paragraph>
        {__('Would you like to include it on a new post?', 'web-stories')}
      </Paragraph>
    </Dialog>
  );
}

PostPublishDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  confirmURL: PropTypes.string.isRequired,
  storyURL: PropTypes.string,
};

PostPublishDialog.defaultProps = {
  storyURL: '',
};

export default PostPublishDialog;
