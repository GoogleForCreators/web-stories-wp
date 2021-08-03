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
import { useCallback, useState, useEffect, useMemo } from 'react';
import { useDebouncedCallback } from '@web-stories-wp/react';
import { __, sprintf, translateToExclusiveList } from '@web-stories-wp/i18n';
import { Input, MEDIA_VARIANTS } from '@web-stories-wp/design-system';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useStory, useCanvas, useConfig } from '../../../../app';
import { isValidUrl, withProtocol } from '../../../../utils/url';
import useElementsWithLinks from '../../../../utils/useElementsWithLinks';
import { LinkInput, Media, Row } from '../../../form';
import { SimplePanel } from '../../panel';

const ICON_SIZE = 32;
const StyledMedia = styled(Media)`
  width: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
`;

function PageAttachmentPanel() {
  const { currentPage, updateCurrentPageProperties } = useStory((state) => ({
    updateCurrentPageProperties: state.actions.updateCurrentPageProperties,
    currentPage: state.state.currentPage,
  }));
  const { setDisplayLinkGuidelines } = useCanvas((state) => ({
    setDisplayLinkGuidelines: state.actions.setDisplayLinkGuidelines,
  }));
  const { allowedImageMimeTypes, allowedImageFileTypes } = useConfig();

  const { pageAttachment = {} } = currentPage;
  const defaultCTA = __('Learn more', 'web-stories');
  const { url, ctaText = defaultCTA, icon } = pageAttachment;
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
  const hasValidUrl = Boolean(url) && !isInvalidUrl;

  const handleChange = useCallback(
    ({ target }) => {
      const { value } = target;
      // This allows smooth input value change without any lag.
      _setCtaText(value);
      debouncedCTAUpdate(value);
    },
    [debouncedCTAUpdate]
  );

  const handleChangeIcon = useCallback(
    (image) => {
      updatePageAttachment(
        { icon: image?.sizes?.full?.url || image?.url },
        true
      );
    },
    [updatePageAttachment]
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

  const iconErrorMessage = useMemo(() => {
    let message = __(
      'No image file types are currently supported.',
      'web-stories'
    );

    if (allowedImageFileTypes.length) {
      message = sprintf(
        /* translators: %s: list of allowed file types. */
        __('Please choose only %s as an icon.', 'web-stories'),
        translateToExclusiveList(allowedImageFileTypes)
      );
    }

    return message;
  }, [allowedImageFileTypes]);

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
      {hasValidUrl && (
        <>
          <Row>
            <Input
              onChange={handleChange}
              onBlur={handleBlur}
              value={_ctaText}
              aria-label={__('Page Attachment CTA text', 'web-stories')}
              suffix={isDefault ? __('Default', 'web-stories') : null}
            />
          </Row>
          <Row>
            <StyledMedia
              value={icon || ''}
              cropParams={{
                width: ICON_SIZE,
                height: ICON_SIZE,
              }}
              onChange={handleChangeIcon}
              onChangeErrorText={iconErrorMessage}
              title={__('Select as link icon', 'web-stories')}
              ariaLabel={__('Edit link icon', 'web-stories')}
              buttonInsertText={__('Select as link icon', 'web-stories')}
              type={allowedImageMimeTypes}
              menuOptions={icon ? ['edit', 'remove'] : []}
              variant={MEDIA_VARIANTS.CIRCLE}
            />
          </Row>
        </>
      )}
    </SimplePanel>
  );
}

export default PageAttachmentPanel;
