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
import { useDebouncedCallback } from 'use-debounce';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import { isValidUrl, withProtocol } from '../../../../utils/url';
import useElementsWithLinks from '../../../../utils/useElementsWithLinks';
import { LinkInput, Row } from '../../../form';
import { useCanvas } from '../../../canvas';
import { SimplePanel } from '../../panel';
import { ExpandedTextInput } from '../../shared';

const Error = styled.span`
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.warning};
`;

function PageAttachmentPanel() {
  const { currentPage, updateCurrentPageProperties } = useStory((state) => ({
    updateCurrentPageProperties: state.actions.updateCurrentPageProperties,
    currentPage: state.state.currentPage,
  }));
  const { setDisplayLinkGuidelines } = useCanvas((state) => ({
    setDisplayLinkGuidelines: state.actions.setDisplayLinkGuidelines,
  }));
  const { pageAttachment = {} } = currentPage;
  const defaultCTA = __('Learn more', 'web-stories');
  const { url, ctaText = defaultCTA } = pageAttachment;
  const [_ctaText, _setCtaText] = useState(ctaText);
  const [displayWarning, setDisplayWarning] = useState(false);

  const { getLinksInAttachmentArea } = useElementsWithLinks();
  const linksInAttachmentArea = getLinksInAttachmentArea();
  const hasLinksInAttachmentArea = linksInAttachmentArea.length > 0;

  // Stop displaying guidelines when unmounting.
  useEffect(() => {
    return () => {
      setDisplayLinkGuidelines(false);
    };
  }, [hasLinksInAttachmentArea, setDisplayLinkGuidelines, url]);

  // If we focus on the field and there are links in the area.
  const onFocus = () => {
    if (hasLinksInAttachmentArea && !url?.length) {
      setDisplayWarning(true);
      setDisplayLinkGuidelines(true);
    }
  };

  // If the Page Attachment is added, stop displaying the warning.
  useEffect(() => {
    if (displayWarning && url?.length) {
      setDisplayWarning(false);
    }
  }, [url, displayWarning]);

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

  const [debouncedCTAUpdate, cancelCTAUpdate] = useDebouncedCallback(
    (value) => {
      updatePageAttachment({ ctaText: value });
    },
    300
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
      <LinkInput
        description={__(
          'Type an address to add a page attachment',
          'web-stories'
        )}
        onChange={(value) => updatePageAttachment({ url: value })}
        onFocus={onFocus}
        value={url || ''}
        clear
        aria-label={__('Page Attachment link', 'web-stories')}
      />

      {displayWarning && (
        <Row>
          <Error>
            {__(
              'Links cannot reside below the dashed line when a page attachment is present. If you add a page attachment, your viewers will not be able to click on the link.',
              'web-stories'
            )}
          </Error>
        </Row>
      )}

      {Boolean(url) && !isInvalidUrl && (
        <Row>
          <ExpandedTextInput
            onChange={(value) => {
              // This allows smooth input value change without any lag.
              _setCtaText(value);
              debouncedCTAUpdate(value);
            }}
            onBlur={(atts = {}) => {
              const { onClear } = atts;
              if (onClear) {
                updatePageAttachment({ ctaText: defaultCTA });
              } else {
                cancelCTAUpdate();
                updatePageAttachment({
                  ctaText: _ctaText ? _ctaText : defaultCTA,
                });
              }
            }}
            value={_ctaText}
            aria-label={__('Page Attachment CTA text', 'web-stories')}
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
