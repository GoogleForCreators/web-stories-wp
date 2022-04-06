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
import {
  useCallback,
  useState,
  useEffect,
  useDebouncedCallback,
} from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import {
  isValidUrl,
  toAbsoluteUrl,
  withProtocol,
} from '@googleforcreators/url';
import {
  Checkbox,
  Input,
  Text,
  THEME_CONSTANTS,
  ThemeGlobals,
} from '@googleforcreators/design-system';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useStory, useCanvas, useAPI } from '../../../../app';
import useElementsWithLinks from '../../../../utils/useElementsWithLinks';
import { LinkIcon, LinkInput, Row } from '../../../form';
import { SimplePanel } from '../../panel';
import { OUTLINK_THEME } from '../../../../constants';
import useCORSProxy from '../../../../utils/useCORSProxy';
import { LinkRelations } from '../../shared';

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
  const {
    actions: { getLinkMetadata },
  } = useAPI();

  const { pageAttachment = {} } = currentPage;
  const defaultCTA = __('Learn more', 'web-stories');
  const { url, ctaText = defaultCTA, icon, theme, rel = [] } = pageAttachment;
  const [_ctaText, _setCtaText] = useState(ctaText);
  const [_url, _setUrl] = useState(url);
  const [displayWarning, setDisplayWarning] = useState(false);
  const [fetchingMetadata, setFetchingMetadata] = useState(false);

  const { hasLinksInAttachmentArea } = useElementsWithLinks();

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

  const debouncedUpdate = useDebouncedCallback(updatePageAttachment, 300);
  const { getProxiedUrl, checkResourceAccess } = useCORSProxy();

  const populateUrlData = useDebouncedCallback(
    useCallback(
      async (value) => {
        // Nothing to fetch for tel: or mailto: links.
        if (!value.startsWith('http://') && !value.startsWith('https://')) {
          return;
        }

        setFetchingMetadata(true);
        try {
          const { image } = getLinkMetadata ? await getLinkMetadata(value) : {};
          const iconUrl = image ? toAbsoluteUrl(value, image) : '';
          const needsProxy = iconUrl
            ? await checkResourceAccess(iconUrl)
            : false;

          updatePageAttachment({
            url: value,
            icon: iconUrl,
            needsProxy,
          });
        } catch (e) {
          // We're allowing to save invalid URLs, however, remove icon in this case.
          updatePageAttachment({ url: value, icon: '', needsProxy: false });
          setIsInvalidUrl(true);
        } finally {
          setFetchingMetadata(false);
        }
      },
      [checkResourceAccess, getLinkMetadata, updatePageAttachment]
    ),
    1200
  );

  const [isInvalidUrl, setIsInvalidUrl] = useState(
    url && !isValidUrl(withProtocol(url).trim())
  );

  const isDefault = _ctaText === defaultCTA;
  const hasValidUrl = Boolean(url) && !isInvalidUrl;

  const handleChangeUrl = useCallback(
    (value) => {
      populateUrlData.cancel();

      _setUrl(value);
      setIsInvalidUrl(false);
      const urlWithProtocol = withProtocol(value.trim());
      const valid = isValidUrl(urlWithProtocol);
      if (valid) {
        populateUrlData(urlWithProtocol);
      }
    },
    [populateUrlData]
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
    /**
     * Handle page attachment icon change.
     *
     * @param {import('@googleforcreators/media').Resource} resource The new image.
     */
    (resource) => {
      updatePageAttachment({ icon: resource?.src }, true);
    },
    [updatePageAttachment]
  );

  const onChangeRel = useCallback(
    (newRel) => updatePageAttachment({ rel: newRel }, true),
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

  const iconUrl = icon ? getProxiedUrl(pageAttachment, icon) : null;

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
    <SimplePanel
      name="pageAttachment"
      title={__('Page Attachment', 'web-stories')}
      collapsedByDefault={false}
    >
      <LinkInput
        onChange={(value) => handleChangeUrl(value?.trim())}
        onBlur={() => {
          debouncedUpdate.cancel();
          updatePageAttachment({
            url: _url?.trim().length ? withProtocol(_url.trim()) : '',
          });
        }}
        onFocus={onFocus}
        value={_url}
        clear
        aria-label={__(
          'Type an address to add a page attachment link',
          'web-stories'
        )}
        hasError={hasError}
        hint={hint}
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
              checked={theme === OUTLINK_THEME.DARK}
              onChange={(evt) =>
                updatePageAttachment({
                  theme: evt.target.checked
                    ? OUTLINK_THEME.DARK
                    : OUTLINK_THEME.LIGHT,
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
            <LinkIcon
              handleChange={handleChangeIcon}
              icon={iconUrl}
              isLoading={fetchingMetadata}
              disabled={fetchingMetadata}
            />
            <Space />
            <Text
              as="span"
              size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
            >
              {__('Link icon', 'web-stories')}
            </Text>
          </StyledRow>
          <LinkRelations onChangeRel={onChangeRel} rel={rel} />
        </>
      )}
    </SimplePanel>
  );
}

export default PageAttachmentPanel;
