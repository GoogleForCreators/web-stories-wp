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
import { useDebouncedCallback } from '@web-stories-wp/react';
import { __ } from '@web-stories-wp/i18n';
import {
  Checkbox,
  Input,
  Text,
  THEME_CONSTANTS,
  ThemeGlobals,
} from '@web-stories-wp/design-system';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useStory, useCanvas } from '../../../../app';
import { isValidUrl, withProtocol } from '../../../../utils/url';
import useElementsWithLinks from '../../../../utils/useElementsWithLinks';
import { LinkIcon, LinkInput, Row } from '../../../form';
import { SimplePanel } from '../../panel';

const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
  CUSTOM: 'custom',
};

const Label = styled.label`
  margin-left: 12px;
`;

const StyledCheckbox = styled(Checkbox)`
  ${({ theme }) => `
    input[type='checkbox']&.${ThemeGlobals.FOCUS_VISIBLE_SELECTOR} ~ div, input[type='checkbox']:focus ~ div {
      box-shadow: 0px 0px 0 2px ${theme.colors.bg.secondary}, 0px 0px 0 4px ${theme.colors.border.focus} !important;
    }
  `}
`;

const StyledRow = styled(Row)`
  justify-content: flex-start;
`;

const Space = styled.div`
  width: 20px;
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
  const { url, ctaText = defaultCTA, icon, theme } = pageAttachment;
  const [_ctaText, _setCtaText] = useState(ctaText);
  const [_url, _setUrl] = useState(url);
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

  const debouncedUpdate = useDebouncedCallback((props) => {
    updatePageAttachment(props);
  }, 300);

  const [isInvalidUrl, setIsInvalidUrl] = useState(
    !isValidUrl(withProtocol(url || '').trim())
  );

  const isDefault = _ctaText === defaultCTA;
  const hasValidUrl = Boolean(url) && !isInvalidUrl;

  const handleChangeUrl = useCallback(
    (value) => {
      _setUrl(value);
      debouncedUpdate({ url: value });
    },
    [debouncedUpdate]
  );

  const handleChangeCta = useCallback(
    ({ target }) => {
      const { value } = target;
      // This allows smooth input value change without any lag.
      _setCtaText(value);
      debouncedUpdate({ ctaText: value });
    },
    [debouncedUpdate]
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
        debouncedUpdate.cancel();
        updatePageAttachment({
          ctaText: _ctaText ? _ctaText : defaultCTA,
        });
      }
    },
    [_ctaText, debouncedUpdate, defaultCTA, updatePageAttachment]
  );

  const checkboxId = `cb-${uuidv4()}`;
  return (
    <SimplePanel
      name="pageAttachment"
      title={__('Page Attachment', 'web-stories')}
    >
      <LinkInput
        onChange={(value) => handleChangeUrl(value?.trim())}
        onBlur={() => {
          debouncedUpdate.cancel();
          updatePageAttachment({
            url: url.trim() ? withProtocol(url.trim()) : '',
          });
        }}
        onFocus={onFocus}
        value={_url}
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
              onChange={handleChangeCta}
              onBlur={handleBlur}
              value={_ctaText}
              aria-label={__('Page Attachment CTA text', 'web-stories')}
              suffix={isDefault ? __('Default', 'web-stories') : null}
            />
          </Row>
          <StyledRow>
            {/* The default is light theme, only if checked, use dark theme */}
            <StyledCheckbox
              id={checkboxId}
              checked={theme === THEME.DARK}
              onChange={(evt) =>
                updatePageAttachment({
                  theme: evt.target.checked ? THEME.DARK : THEME.LIGHT,
                })
              }
            />
            <Label htmlFor={checkboxId}>
              <Text
                as="span"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
              >
                {__('Use dark theme', 'web-stories')}
              </Text>
            </Label>
          </StyledRow>
          <StyledRow>
            <LinkIcon handleChange={handleChangeIcon} icon={icon} />
            <Space />
            <Text
              as="span"
              size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
            >
              {__('Link icon', 'web-stories')}
            </Text>
          </StyledRow>
        </>
      )}
    </SimplePanel>
  );
}

export default PageAttachmentPanel;
