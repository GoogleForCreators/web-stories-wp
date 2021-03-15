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
import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDebouncedCallback } from 'use-debounce';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import {
  Input,
  Text,
  THEME_CONSTANTS,
  useBatchingCallback,
} from '../../../../../design-system';
import { useStory, useAPI, useCanvas } from '../../../../app';
import { isValidUrl, toAbsoluteUrl, withProtocol } from '../../../../utils/url';
import useElementsWithLinks from '../../../../utils/useElementsWithLinks';
import { MULTIPLE_DISPLAY_VALUE, MULTIPLE_VALUE } from '../../../../constants';
import { Media, Row, LinkInput } from '../../../form';
import { createLink } from '../../../elementLink';
import { SimplePanel } from '../../panel';
import { useCommonObjectValue } from '../../shared';
import { MEDIA_VARIANTS } from '../../../../../design-system/components/mediaInput/constants';

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
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.warning};
`;

function LinkPanel({ selectedElements, pushUpdateForObject }) {
  const {
    clearEditing,
    setDisplayLinkGuidelines,
    displayLinkGuidelines,
  } = useCanvas((state) => ({
    clearEditing: state.actions.clearEditing,
    setDisplayLinkGuidelines: state.actions.setDisplayLinkGuidelines,
    displayLinkGuidelines: state.state.displayLinkGuidelines,
  }));

  const { currentPage } = useStory((state) => ({
    currentPage: state.state.currentPage,
  }));

  const { getElementsInAttachmentArea } = useElementsWithLinks();
  const hasElementsInAttachmentArea =
    getElementsInAttachmentArea(selectedElements).length > 0 &&
    currentPage?.pageAttachment?.url?.length > 0;

  const defaultLink = useMemo(
    () => createLink({ url: '', icon: null, desc: null }),
    []
  );

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
        (prev) =>
          url
            ? {
                url,
                desc: title ? title : prev.desc,
                icon: icon ? toAbsoluteUrl(url, icon) : prev.icon,
              }
            : null,
        defaultLink,
        true
      ),
    [pushUpdateForObject, defaultLink]
  );

  const [isInvalidUrl, setIsInvalidUrl] = useState(
    !isValidUrl(withProtocol(link.url || ''))
  );

  const [populateMetadata] = useDebouncedCallback((url) => {
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
    (image) => {
      handleChange({ icon: image?.sizes?.medium?.url || image?.url }, true);
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

  const isMultipleUrl = MULTIPLE_VALUE === link.url;
  const isMultipleDesc = MULTIPLE_VALUE === link.desc;
  return (
    <SimplePanel name="link" title={__('Link', 'web-stories')}>
      <LinkInput
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
            />
          </Row>
          <Row spaceBetween={false}>
            <Media
              value={link.icon || ''}
              onChange={handleChangeIcon}
              title={__('Select as link icon', 'web-stories')}
              ariaLabel={__('Edit link icon', 'web-stories')}
              buttonInsertText={__('Select as link icon', 'web-stories')}
              type={'image'}
              isLoading={fetchingMetadata}
              variant={MEDIA_VARIANTS.CIRCLE}
              menuOptions={link.icon ? ['edit', 'remove'] : []}
            />
            <IconInfo>
              <IconText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
                {__('Optional brand icon', 'web-stories')}
              </IconText>
            </IconInfo>
          </Row>
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
