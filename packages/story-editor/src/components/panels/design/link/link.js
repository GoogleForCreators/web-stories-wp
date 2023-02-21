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
  useEffect,
  useMemo,
  useState,
  useDebouncedCallback,
  useBatchingCallback,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __, sprintf } from '@googleforcreators/i18n';
import {
  DropDown,
  Input,
  Placement,
  Text,
  TextSize,
} from '@googleforcreators/design-system';
import {
  isValidUrl,
  toAbsoluteUrl,
  withProtocol,
} from '@googleforcreators/url';
import { LinkType } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { MULTIPLE_VALUE, MULTIPLE_DISPLAY_VALUE } from '../../../../constants';
import { useAPI, useCanvas, useStory } from '../../../../app';
import useElementsWithLinks from '../../../../utils/useElementsWithLinks';
import { Row, LinkInput, LinkIcon, Switch } from '../../../form';
import { createLink } from '../../../elementLink';
import { SimplePanel } from '../../panel';
import { inputContainerStyleOverride } from '../../shared/styles';
import { LinkRelations, useCommonObjectValue } from '../../shared';
import { states, useHighlights } from '../../../../app/highlights';
import styles from '../../../../app/highlights/styles';
import useCORSProxy from '../../../../utils/useCORSProxy';

const IconInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;

const IconText = styled(Text.Paragraph)`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

const Error = styled.span`
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.fg.negative};
`;

const StyledSwitch = styled(Switch)`
  width: 100%;
`;

function LinkPanel({ selectedElements, pushUpdateForObject }) {
  const { clearEditing, setDisplayLinkGuidelines, displayLinkGuidelines } =
    useCanvas((state) => ({
      clearEditing: state.actions.clearEditing,
      setDisplayLinkGuidelines: state.actions.setDisplayLinkGuidelines,
      displayLinkGuidelines: state.state.displayLinkGuidelines,
    }));

  const { highlight, resetHighlight, cancelHighlight } = useHighlights(
    (state) => ({
      highlight: state[states.Link],
      resetHighlight: state.onFocusOut,
      cancelHighlight: state.cancelEffect,
    })
  );

  const pages = useStory(
    ({ state }) =>
      state?.pages
        ?.map(({ id }, index) => ({
          value: id,
          label: sprintf(
            /* translators: %s: page number. */
            __('Page %s', 'web-stories'),
            index + 1
          ),
        }))
        .filter(({ value }) => value !== state.currentPage?.id) || []
  );

  const { hasElementsInAttachmentArea } = useElementsWithLinks();

  const defaultLink = useMemo(() => createLink({ icon: null, desc: null }), []);

  const linkRaw = useCommonObjectValue(selectedElements, 'link', defaultLink);
  const link = createLink(linkRaw);
  const {
    url = '',
    desc = '',
    icon,
    rel = [],
    type: linkType = LinkType.Regular,
    pageId = null,
  } = link;

  const [fetchingMetadata, setFetchingMetadata] = useState(false);
  const [isLinkFocused, setIsLinkFocused] = useState(false);

  const {
    actions: { getLinkMetadata },
  } = useAPI();

  const { getProxiedUrl, checkResourceAccess } = useCORSProxy();

  const updateLinkFromMetadataApi = useBatchingCallback(
    ({ newUrl, newTitle, newIcon, needsProxy }) =>
      pushUpdateForObject(
        'link',
        () =>
          newUrl
            ? createLink({
                url: newUrl,
                needsProxy,
                desc: newTitle ? newTitle : '',
                icon: newIcon ? toAbsoluteUrl(newUrl, newIcon) : '',
              })
            : null,
        defaultLink,
        true
      ),
    [pushUpdateForObject, defaultLink]
  );

  const [isInvalidUrl, setIsInvalidUrl] = useState(
    !isValidUrl(withProtocol(url))
  );

  const populateMetadata = useDebouncedCallback(
    useCallback(
      async (newUrl) => {
        // Nothing to fetch for tel: or mailto: links.
        if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
          return;
        }

        setFetchingMetadata(true);
        try {
          const { title: newTitle, image: newIcon } = getLinkMetadata
            ? await getLinkMetadata(newUrl)
            : {};
          const needsProxy = newIcon
            ? await checkResourceAccess(newIcon)
            : false;

          updateLinkFromMetadataApi({
            newUrl,
            newTitle,
            newIcon,
            needsProxy,
          });
        } catch (e) {
          setIsInvalidUrl(true);
        } finally {
          setFetchingMetadata(false);
        }
      },
      [checkResourceAccess, getLinkMetadata, updateLinkFromMetadataApi]
    ),
    1200
  );

  const handleChange = useCallback(
    (properties, submit) => {
      clearEditing();

      populateMetadata.cancel();

      if (properties.url) {
        // Don't submit any changes in case of multiple value.
        if (MULTIPLE_VALUE === properties.url) {
          return;
        }
        const urlWithProtocol = withProtocol(properties.url);
        const valid = isValidUrl(urlWithProtocol);
        setIsInvalidUrl(!valid);

        if (valid) {
          populateMetadata(urlWithProtocol);
        }
      }

      pushUpdateForObject(
        'link',
        properties.url !== ''
          ? {
              ...properties,
            }
          : null,
        defaultLink,
        submit
      );
    },
    [clearEditing, pushUpdateForObject, defaultLink, populateMetadata]
  );

  const handleChangeIcon = useCallback(
    /**
     * Handle link icon change.
     *
     * @param {import('@googleforcreators/media').Resource} resource The new image.
     */
    (resource) => {
      handleChange({ icon: resource?.src }, true);
    },
    [handleChange]
  );

  const hasLinkSet = Boolean(url?.length);
  const displayMetaFields =
    (hasLinkSet && !isInvalidUrl) ||
    (linkType === LinkType.Branching && pageId);

  // If we're focusing on the link input and any of the relevant values changes,
  // Check if we need to hide/display the guidelines.
  useEffect(() => {
    if (isLinkFocused) {
      // Display the guidelines if there's no link / if it's multiple value.
      const hasLink = hasLinkSet && url !== MULTIPLE_VALUE;
      setDisplayLinkGuidelines(hasElementsInAttachmentArea && !hasLink);
    }
  }, [
    selectedElements,
    isLinkFocused,
    hasElementsInAttachmentArea,
    hasLinkSet,
    setDisplayLinkGuidelines,
    url,
  ]);

  const linkIcon = icon ? getProxiedUrl(link, icon) : null;

  const isMultipleLinkType = MULTIPLE_VALUE === linkType;
  const isMultiplePageId = MULTIPLE_VALUE === pageId;
  const isMultipleUrl = MULTIPLE_VALUE === url;
  const isMultipleDesc = MULTIPLE_VALUE === desc;
  const isMultipleRel = MULTIPLE_VALUE === rel;

  const onChangeRel = useCallback(
    (newRel) => handleChange({ rel: newRel }, true),
    [handleChange]
  );

  const onChangeLinkType = useCallback(() => {
    handleChange(
      {
        type:
          linkType === LinkType.Regular ? LinkType.Branching : LinkType.Regular,
      },
      true
    );
  }, [handleChange, linkType]);
  const onChangePageId = useCallback(
    (_event, value) => {
      handleChange({ pageId: value }, true);
    },
    [handleChange]
  );

  return (
    <SimplePanel
      name="link"
      title={__('Link', 'web-stories')}
      css={highlight?.showEffect && styles.FLASH}
      onAnimationEnd={() => resetHighlight()}
      isPersistable={!highlight}
    >
      <Row>
        <StyledSwitch
          groupLabel={__('Link Type', 'web-stories')}
          name="link-type-switch"
          value={linkType === LinkType.Regular}
          onLabel={__('Link to website', 'web-stories')}
          offLabel={__('Link to story page', 'web-stories')}
          disabled={isMultipleLinkType}
          onChange={onChangeLinkType}
        />
      </Row>
      {linkType === LinkType.Branching ? (
        <Row>
          <DropDown
            ariaLabel={__('Page', 'web-stories')}
            dropDownLabel={__('Page', 'web-stories')}
            placeholder={__('Select Page', 'web-stories')}
            options={pages}
            placement={Placement.TopStart}
            onMenuItemClick={onChangePageId}
            selectedValue={pageId}
            disabled={!pages.length || isMultiplePageId}
          />
        </Row>
      ) : (
        <LinkInput
          ref={(node) => {
            if (node && highlight?.focus && highlight?.showEffect) {
              node.addEventListener('keydown', cancelHighlight, { once: true });
              node.focus();
            }
          }}
          onChange={(value) =>
            !displayLinkGuidelines &&
            handleChange({ url: value }, !value /* submit */)
          }
          onBlur={() => {
            setDisplayLinkGuidelines(false);
            setIsLinkFocused(false);
          }}
          onFocus={() => {
            setIsLinkFocused(true);
          }}
          value={url || ''}
          placeholder={
            isMultipleUrl
              ? MULTIPLE_DISPLAY_VALUE
              : __('Enter an address to apply a link', 'web-stories')
          }
          isIndeterminate={isMultipleUrl}
          aria-label={__('Element link', 'web-stories')}
          hasError={displayLinkGuidelines}
        />
      )}
      {displayLinkGuidelines && (
        <Row>
          <Error>
            {__(
              'Link can not reside below the dashed line when a page attachment is present',
              'web-stories'
            )}
          </Error>
        </Row>
      )}

      {displayMetaFields && (
        <>
          <Row>
            <Input
              placeholder={
                isMultipleDesc
                  ? MULTIPLE_DISPLAY_VALUE
                  : __('Optional description', 'web-stories')
              }
              onChange={({ target }) =>
                handleChange({ desc: target.value }, !target.value /* submit */)
              }
              value={desc}
              aria-label={__('Link description', 'web-stories')}
              isIndeterminate={isMultipleDesc}
              disabled={fetchingMetadata}
              containerStyleOverride={inputContainerStyleOverride}
            />
          </Row>
          <Row spaceBetween={false}>
            <LinkIcon
              handleChange={handleChangeIcon}
              icon={linkIcon}
              isLoading={fetchingMetadata}
              disabled={fetchingMetadata}
            />
            <IconInfo>
              <IconText size={TextSize.Small}>
                {__('Optional brand icon', 'web-stories')}
              </IconText>
            </IconInfo>
          </Row>
          {!isMultipleRel && linkType === LinkType.Regular && (
            <LinkRelations onChangeRel={onChangeRel} rel={rel} />
          )}
        </>
      )}
    </SimplePanel>
  );
}

LinkPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdateForObject: PropTypes.func.isRequired,
};

export default LinkPanel;
