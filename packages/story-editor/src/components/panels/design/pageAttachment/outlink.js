/*
 * Copyright 2022 Google LLC
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
import { useCallback, useState, useEffect } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { isValidUrl, withProtocol } from '@googleforcreators/url';

/**
 * Internal dependencies
 */
import { useCanvas } from '../../../../app';
import useElementsWithLinks from '../../../../utils/useElementsWithLinks';
import { LinkRelations } from '../../shared';
import { CallToActionText, Theme, Icon, LinkUrl } from './shared';

function Outlink({ pageAttachment, updatePageAttachment }) {
  const { setDisplayLinkGuidelines } = useCanvas((state) => ({
    setDisplayLinkGuidelines: state.actions.setDisplayLinkGuidelines,
  }));

  const { url, ctaText, icon, theme, rel = [], needsProxy } = pageAttachment;
  const [displayWarning, setDisplayWarning] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [isInvalidUrl, setIsInvalidUrl] = useState(
    url && !isValidUrl(withProtocol(url).trim())
  );

  const hasValidUrl = Boolean(url) && !isInvalidUrl;

  const { hasLinksInAttachmentArea } = useElementsWithLinks();

  // Stop displaying guidelines when unmounting.
  useEffect(() => {
    return () => {
      setDisplayLinkGuidelines(false);
    };
  }, [hasLinksInAttachmentArea, setDisplayLinkGuidelines, url]);

  // If we focus on the field and there are links in the area.
  const onFocus = useCallback(() => {
    if (hasLinksInAttachmentArea && !url?.length) {
      setDisplayWarning(true);
      setDisplayLinkGuidelines(true);
    }
  }, [hasLinksInAttachmentArea, setDisplayLinkGuidelines, url?.length]);

  // If the Page Attachment is added, stop displaying the warning.
  useEffect(() => {
    if (displayWarning && url?.length) {
      setDisplayWarning(false);
    }
  }, [url, displayWarning]);

  const onChangeRel = useCallback(
    (newRel) => updatePageAttachment({ rel: newRel }, true),
    [updatePageAttachment]
  );

  let hint;
  const hasError = displayWarning || isInvalidUrl;
  if (hasError) {
    hint = displayWarning
      ? __(
          'Links cannot reside below the dashed line when a page attachment is present. If you add a page attachment, your viewers will not be able to click on the link.',
          'web-stories'
        )
      : __('Invalid link', 'web-stories');
  }

  return (
    <>
      <LinkUrl
        value={url}
        onChange={updatePageAttachment}
        isFetching={isFetching}
        setIsFetching={setIsFetching}
        setIsInvalidUrl={setIsInvalidUrl}
        hint={hint}
        onFocus={onFocus}
        hasError={hasError}
      />
      {hasValidUrl && (
        <>
          <CallToActionText
            value={ctaText}
            defaultValue={__('Learn more', 'web-stories')}
            onChange={updatePageAttachment}
          />
          <Theme theme={theme} onChange={updatePageAttachment} />
        </>
      )}
      {hasValidUrl && (
        <>
          <Icon
            icon={icon}
            isFetching={isFetching}
            needsProxy={needsProxy}
            onChange={updatePageAttachment}
          />
          <LinkRelations onChangeRel={onChangeRel} rel={rel} />
        </>
      )}
    </>
  );
}

Outlink.propTypes = {
  pageAttachment: PropTypes.shape({
    url: PropTypes.string,
    ctaText: PropTypes.string,
    icon: PropTypes.string,
    theme: PropTypes.string,
    rel: PropTypes.arrayOf(PropTypes.string),
    needsProxy: PropTypes.bool,
  }).isRequired,
  updatePageAttachment: PropTypes.func.isRequired,
};

export default Outlink;
