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
import { useCallback, useState, useEffect } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Row } from '../../form';
import { isValidUrl, withProtocol } from '../../../utils/url';
import { SimplePanel } from '../panel';
import { Note, ExpandedTextInput } from '../shared';
import { useStory } from '../../../app/story';
import useElementsWithLinks from '../../../utils/useElementsWithLinks';
import { useCanvas } from '../../canvas';

const Error = styled.span`
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.warning};
`;

function PageAttachmentPanel() {
  const {
    currentPage,
    updateCurrentPageProperties,
    updateElementsById,
  } = useStory((state) => ({
    updateCurrentPageProperties: state.actions.updateCurrentPageProperties,
    updateElementsById: state.actions.updateElementsById,
    currentPage: state.state.currentPage,
  }));
  const { setHasLinkInAttachmentArea } = useCanvas((state) => ({
    setHasLinkInAttachmentArea: state.actions.setHasLinkInAttachmentArea,
  }));
  const { pageAttachment = {} } = currentPage;
  const defaultCTA = __('Learn more', 'web-stories');
  const { url, ctaText = defaultCTA } = pageAttachment;
  const [_ctaText, _setCtaText] = useState(ctaText);
  const [displayWarning, setDisplayWarning] = useState(false);

  const { getElementsInAttachmentArea } = useElementsWithLinks();
  const linksInAttachmentArea = getElementsInAttachmentArea();
  const hasLinksInAttachmentArea = linksInAttachmentArea.length > 0;

  useEffect(() => {
    setHasLinkInAttachmentArea(hasLinksInAttachmentArea && !url.length);
    return () => {
      setHasLinkInAttachmentArea(false);
    };
  }, [hasLinksInAttachmentArea, setHasLinkInAttachmentArea, url]);

  const onFocus = () => {
    if (hasLinksInAttachmentArea && !url.length) {
      setDisplayWarning(true);
    }
  };

  useEffect(() => {
    if (displayWarning && url.length) {
      setDisplayWarning(false);
    }
  }, [url, displayWarning]);

  const updatePageAttachment = useCallback(
    (value) => {
      if (value.url) {
        const urlWithProtocol = withProtocol(value.url);
        const valid = isValidUrl(urlWithProtocol);
        setIsInvalidUrl(!valid);
        if (hasLinksInAttachmentArea) {
          // Remove links from elements if Page attachment was updated.
          updateElementsById({
            elementIds: linksInAttachmentArea.map(({ id }) => id),
            properties: {
              link: null,
            },
          });
        }
      }
      const _pageAttachment = {
        ...pageAttachment,
        ...value,
      };
      updateCurrentPageProperties({
        properties: { pageAttachment: _pageAttachment },
      });
    },
    [
      updateCurrentPageProperties,
      pageAttachment,
      hasLinksInAttachmentArea,
      linksInAttachmentArea,
      updateElementsById,
    ]
  );

  const [isInvalidUrl, setIsInvalidUrl] = useState(
    !isValidUrl(withProtocol(url || ''))
  );

  const isDefault = _ctaText === defaultCTA;
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
          onFocus={onFocus}
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

      {displayWarning && (
        <Row>
          <Error>
            {__(
              'Links can not be located below the dashed line when a page attachment is present. The link to elements found below this line will be removed if you add a page attachment',
              'web-stories'
            )}
          </Error>
        </Row>
      )}

      {Boolean(url) && !isInvalidUrl && (
        <Row>
          <ExpandedTextInput
            onChange={(value) => _setCtaText(value)}
            onBlur={(atts = {}) => {
              const { onClear } = atts;
              if (onClear) {
                updatePageAttachment({ ctaText: defaultCTA });
                _setCtaText(defaultCTA);
              } else {
                updatePageAttachment({
                  ctaText: _ctaText ? _ctaText : defaultCTA,
                });
              }
            }}
            value={_ctaText}
            aria-label={__('Edit: Page Attachment CTA text', 'web-stories')}
            clear={Boolean(_ctaText) && !isDefault}
            suffix={isDefault ? __('default', 'web-stories') : null}
            width={isDefault ? 85 : null}
          />
        </Row>
      )}
    </SimplePanel>
  );
}

export default PageAttachmentPanel;
