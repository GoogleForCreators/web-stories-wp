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
import styled from 'styled-components';
import { __, sprintf } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import Dialog from '../dialog';
import { Plain } from '../button';

const Paragraph = styled.p`
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body1.family};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body1.size};
  line-height: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body1.lineHeight};
  letter-spacing: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.body1.letterSpacing};
`;

const Img = styled.img`
  float: left;
  margin: 0px 10px 10px 0px;
`;

function PostLockDialog({
  open,
  author,
  allStoriesLink,
  previewLink,
  onClose,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={__('Story is locked', 'web-stories')}
      contentLabel={__('Story is locked', 'web-stories')}
      actions={
        <>
          <Plain href={allStoriesLink}>
            {__('All Stories', 'web-stories')}
          </Plain>
          <Plain href={previewLink}>{__('Preview', 'web-stories')}</Plain>
          <Plain onClick={onClose}>{__('Take over', 'web-stories')}</Plain>
        </>
      }
    >
      {author && author.name && (
        <Paragraph>
          <Img src={author['avatar_urls']['48']} alt={author.name} />
          {sprintf(
            /* translators: %s: user's name */
            __(
              '%s is already editing this story. Do you want to take over? ',
              'web-stories'
            ),
            author.name
          )}
        </Paragraph>
      )}
    </Dialog>
  );
}

PostLockDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  author: PropTypes.object,
  allStoriesLink: PropTypes.string.isRequired,
  previewLink: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PostLockDialog;
