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
import { useCallback, useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { __ } from '@web-stories-wp/i18n';
import { Input } from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import { useStory, useCanvas } from '../../../../app';
import { isValidUrl, withProtocol } from '../../../../utils/url';
import useElementsWithLinks from '../../../../utils/useElementsWithLinks';
import { LinkInput, Row } from '../../../form';
import { SimplePanel } from '../../panel';

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
      const trimmedUrl = (value.url || '').trim();
      if (value.url) {
        const urlWithProtocol = withProtocol(trimmedUrl);
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

  const debouncedCTAUpdate = useDebouncedCallback((value) => {
    updatePageAttachment({ ctaText: value });
  }, 300);

  const [isInvalidUrl, setIsInvalidUrl] = useState(
    !isValidUrl(withProtocol(url || '').trim())
  );

  const isDefault = _ctaText === defaultCTA;
  const showTextInput = Boolean(url) && !isInvalidUrl;

  const handleChange = useCallback(
    ({ target }) => {
      const { value } = target;
      // This allows smooth input value change without any lag.
      _setCtaText(value);
      debouncedCTAUpdate(value);
    },
    [debouncedCTAUpdate]
  );

  const handleBlur = useCallback(
    ({ target }) => {
      if (!target.value) {
        updatePageAttachment({ ctaText: defaultCTA });
        _setCtaText(defaultCTA);
      } else {
        debouncedCTAUpdate.cancel();
        updatePageAttachment({
          ctaText: _ctaText ? _ctaText : defaultCTA,
        });
      }
    },
    [_ctaText, debouncedCTAUpdate, defaultCTA, updatePageAttachment]
  );

  return (
    <SimplePanel
      name="pageAttachment"
      title={__('Page Attachment', 'web-stories')}
    >
      <LinkInput
        onChange={(value) => updatePageAttachment({ url: value })}
        onBlur={() => updatePageAttachment({ url: url?.trim() })}
        onFocus={onFocus}
        value={url}
        clear
        aria-label={__(
          'Type an address to add a page attachment link',
          'web-stories'
        )}
        hasError={displayWarning}
        hint={
          displayWarning
            ? __(
                'Links cannot reside below the dashed line when a page attachment is present. If you add a page attachment, your viewers will not be able to click on the link.',
                'web-stories'
              )
            : undefined
        }
      />
      {showTextInput && (
        <Row>
          <Input
            onChange={handleChange}
            onBlur={handleBlur}
            value={_ctaText}
            aria-label={__('Page Attachment CTA text', 'web-stories')}
            suffix={isDefault ? __('Default', 'web-stories') : null}
          />
        </Row>
      )}
    </SimplePanel>
  );
}

export default PageAttachmentPanel;
