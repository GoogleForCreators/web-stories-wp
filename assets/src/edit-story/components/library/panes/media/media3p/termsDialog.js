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
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { __, TranslateWithMarkup } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import localStore, {
  LOCAL_STORAGE_PREFIX,
} from '../../../../../utils/localStore';
import Dialog from '../../../../dialog';
import { Plain } from '../../../../button';

const Paragraph = styled.p`
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body1.family};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body1.size};
  line-height: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body1.lineHeight};
  letter-spacing: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.body1.letterSpacing};
`;

function TermsDialog() {
  const hasAcknowledgedTerms3p = localStore.getItemByKey(
    `${LOCAL_STORAGE_PREFIX.TERMS_MEDIA3P}`
  );

  const [dialogOpen, setDialogOpen] = useState(!hasAcknowledgedTerms3p);

  const acknowledgeTerms = () => {
    setDialogOpen(false);
    localStore.setItemByKey(`${LOCAL_STORAGE_PREFIX.TERMS_MEDIA3P}`, true);
  };

  useEffect(() => {
    setDialogOpen(!hasAcknowledgedTerms3p);
  }, [hasAcknowledgedTerms3p]);

  if (hasAcknowledgedTerms3p) {
    return null;
  }

  return (
    <Dialog
      open={dialogOpen}
      onClose={acknowledgeTerms}
      ariaHideApp={false}
      actions={
        <Plain onClick={acknowledgeTerms}>{__('Dismiss', 'web-stories')}</Plain>
      }
    >
      <Paragraph>
        <TranslateWithMarkup
          mapping={{
            a: (
              //eslint-disable-next-line jsx-a11y/anchor-has-content
              <a
                href="https://wp.stories.google/docs#Terms"
                rel="noreferrer"
                target="_blank"
                aria-label={__(
                  'Learn more by visiting Web Stories for WordPress',
                  'web-stories'
                )}
              />
            ),
          }}
        >
          {__(
            'Your use of stock content is subject to third party terms. <a>Learn more.</a>',
            'web-stories'
          )}
        </TranslateWithMarkup>
      </Paragraph>
    </Dialog>
  );
}

export default TermsDialog;
