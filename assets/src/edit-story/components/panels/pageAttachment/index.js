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
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { useCallback, useState } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Row } from '../../form';
import { isValidUrl, withProtocol } from '../../../utils/url';
import { SimplePanel } from '../panel';
import { Note, ExpandedTextInput } from '../shared';
import { useStory } from '../../../app/story';

const Error = styled.span`
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.warning};
`;

function PageAttachmentPanel() {
  const {
    state: { currentPage },
    actions: { updateCurrentPageProperties },
  } = useStory();
  const { pageAttachment = {} } = currentPage;
  const defaultCTA = __('Learn more', 'web-stories');
  const { url, ctaText = defaultCTA } = pageAttachment;

  const updatePageAttachment = useCallback(
    (value) => {
      if (value.url) {
        const urlWithProtocol = withProtocol(value.url);
        const valid = isValidUrl(urlWithProtocol);
        setIsInvalidUrl(!valid);
      }
      const _pageAttachment = {
        ...pageAttachment,
        ...value,
      };
      updateCurrentPageProperties({
        properties: { pageAttachment: _pageAttachment },
      });
    },
    [updateCurrentPageProperties, pageAttachment]
  );

  const [isInvalidUrl, setIsInvalidUrl] = useState(
    !isValidUrl(withProtocol(url || ''))
  );

  return (
    <SimplePanel
      name="pageAttachment"
      title={__('Page Attachment', 'web-stories')}
    >
      <Row>
        <Note>
          {__('Type an address to add a page attachment', 'web-stories')}
        </Note>
      </Row>

      <Row>
        <ExpandedTextInput
          placeholder={__('Web address', 'web-stories')}
          onChange={(value) => updatePageAttachment({ url: value })}
          value={url || ''}
          clear
          aria-label={__('Edit: Page Attachment link', 'web-stories')}
        />
      </Row>
      {Boolean(url) && isInvalidUrl && (
        <Row>
          <Error>{__('Invalid web address.', 'web-stories')}</Error>
        </Row>
      )}

      {Boolean(url) && !isInvalidUrl && (
        <Row>
          <ExpandedTextInput
            onChange={(value) =>
              updatePageAttachment({ ctaText: value ? value : defaultCTA })
            }
            value={ctaText || defaultCTA}
            aria-label={__('Edit: Page Attachment CTA text', 'web-stories')}
            clear={Boolean(ctaText) && ctaText !== defaultCTA}
          />
        </Row>
      )}
    </SimplePanel>
  );
}

export default PageAttachmentPanel;
