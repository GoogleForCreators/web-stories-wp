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
} from '@web-stories-wp/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';
import {
  Input,
  Text,
  Checkbox,
  THEME_CONSTANTS,
  Link,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */

import { useStory, useAPI, useCanvas } from '../../../../app';
import { isValidUrl, toAbsoluteUrl, withProtocol } from '../../../../utils/url';
import useElementsWithLinks from '../../../../utils/useElementsWithLinks';
import { MULTIPLE_DISPLAY_VALUE, MULTIPLE_VALUE } from '../../../../constants';
import { Row, LinkInput, LinkIcon } from '../../../form';
import { createLink } from '../../../elementLink';
import { SimplePanel } from '../../panel';
import {
  inputContainerStyleOverride,
  useCommonObjectValue,
} from '../../shared';
import { states, styles, useHighlights } from '../../../../app/highlights';
import { LinkTypes, relHelpLink, relHelpText, relTitle } from '../constants';

const IconInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;

const IconText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

const Error = styled.span`
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.fg.negative};
`;

const CheckboxWrapper = styled.div`
  display: flex;
  padding: 9px 0;
`;

const Label = styled.label`
  margin-left: 12px;
`;

const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.secondary};
  padding: 8px 0;
`;

function LinkPanel({ selectedElements, pushUpdateForObject }) {
  const { clearEditing, setDisplayLinkGuidelines, displayLinkGuidelines } =
    useCanvas((state) => ({
      clearEditing: state.actions.clearEditing,
      setDisplayLinkGuidelines: state.actions.setDisplayLinkGuidelines,
      displayLinkGuidelines: state.state.displayLinkGuidelines,
    }));

  const { currentPage } = useStory((state) => ({
    currentPage: state.state.currentPage,
  }));

  const { highlight, resetHighlight, cancelHighlight } = useHighlights(
    (state) => ({
      highlight: state[states.LINK],
      resetHighlight: state.onFocusOut,
      cancelHighlight: state.cancelEffect,
    })
  );

  const { getElementsInAttachmentArea } = useElementsWithLinks();
  const hasElementsInAttachmentArea =
    getElementsInAttachmentArea(selectedElements).length > 0 &&
    currentPage?.pageAttachment?.url?.length > 0;

  const defaultLink = useMemo(() => createLink({ icon: null, desc: null }), []);

  const link = useCommonObjectValue(selectedElements, 'link', defaultLink);

  const [fetchingMetadata, setFetchingMetadata] = useState(false);
  const [isLinkFocused, setIsLinkFocused] = useState(false);

  const {
    actions: { getLinkMetadata },
  } = useAPI();

  const updateLinkFromMetadataApi = useBatchingCallback(
    ({ url, title, icon }) =>
      pushUpdateForObject(
        'link',
        () =>
          url
            ? createLink({
                url,
                desc: title ? title : '',
                icon: icon ? toAbsoluteUrl(url, icon) : '',
              })
            : null,
        defaultLink,
        true
      ),
    [pushUpdateForObject, defaultLink]
  );

  const [isInvalidUrl, setIsInvalidUrl] = useState(
    !isValidUrl(withProtocol(link.url || ''))
  );

  const populateMetadata = useDebouncedCallback((url) => {
    setFetchingMetadata(true);
    getLinkMetadata(url)
      .then(({ title, image }) => {
        updateLinkFromMetadataApi({ url, title, icon: image });
      })
      .catch(() => {
        setIsInvalidUrl(true);
      })
      .finally(() => {
        setFetchingMetadata(false);
      });
  }, 1200);

  const handleChange = useCallback(
    (properties, submit) => {
      clearEditing();

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
     * @param {import('@web-stories-wp/media').Resource} resource The new image.
     */
    (resource) => {
      handleChange({ icon: resource?.src }, true);
    },
    [handleChange]
  );

  const hasLinkSet = Boolean(link.url?.length);
  const displayMetaFields = hasLinkSet && !isInvalidUrl;

  // If we're focusing on the link input and any of the relevant values changes,
  // Check if we need to hide/display the guidelines.
  useEffect(() => {
    if (isLinkFocused) {
      // Display the guidelines if there's no link / if it's multiple value.
      const hasLink = hasLinkSet && link.url !== MULTIPLE_VALUE;
      setDisplayLinkGuidelines(hasElementsInAttachmentArea && !hasLink);
    }
  }, [
    selectedElements,
    isLinkFocused,
    hasElementsInAttachmentArea,
    hasLinkSet,
    setDisplayLinkGuidelines,
    link.url,
  ]);

  const onChangeRel = useCallback(
    (value) => {
      const rel = link.rel.includes(value)
        ? link.rel.filter((el) => el !== value)
        : [...link.rel, value];
      handleChange({ rel }, true);
    },
    [handleChange, link]
  );

  const isMultipleUrl = MULTIPLE_VALUE === link.url;
  const isMultipleDesc = MULTIPLE_VALUE === link.desc;
  const isMultipleRel = MULTIPLE_VALUE === link.rel;

  return (
    <SimplePanel
      name="link"
      title={__('Link', 'web-stories')}
      css={highlight?.showEffect && styles.FLASH}
      onAnimationEnd={() => resetHighlight()}
      isPersistable={!highlight}
    >
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
        value={link.url || ''}
        placeholder={
          isMultipleUrl
            ? MULTIPLE_DISPLAY_VALUE
            : __('Enter an address to apply a link', 'web-stories')
        }
        isIndeterminate={isMultipleUrl}
        aria-label={__('Element link', 'web-stories')}
        hasError={displayLinkGuidelines}
      />
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
              value={link.desc || ''}
              aria-label={__('Link description', 'web-stories')}
              isIndeterminate={isMultipleDesc}
              disabled={fetchingMetadata}
              containerStyleOverride={inputContainerStyleOverride}
            />
          </Row>
          <Row spaceBetween={false}>
            <LinkIcon
              handleChange={handleChangeIcon}
              icon={link.icon}
              isLoading={fetchingMetadata}
              disabled={fetchingMetadata}
            />
            <IconInfo>
              <IconText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
                {__('Optional brand icon', 'web-stories')}
              </IconText>
            </IconInfo>
          </Row>
          {!isMultipleRel && (
            <Row>
              <div>
                <StyledText
                  size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                >
                  {relTitle}
                </StyledText>
                {LinkTypes.map(({ key, title }) => (
                  <CheckboxWrapper key={key}>
                    <Checkbox
                      id={key}
                      name={key}
                      checked={link?.rel?.includes(key)}
                      onChange={() => onChangeRel(key)}
                    />
                    <Label htmlFor={key}>
                      <Text
                        size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                        as="span"
                      >
                        {title}
                      </Text>
                    </Label>
                  </CheckboxWrapper>
                ))}
                <Link
                  rel="noopener noreferrer"
                  target="_blank"
                  href={relHelpLink}
                  size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
                >
                  {relHelpText}
                </Link>
              </div>
            </Row>
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
