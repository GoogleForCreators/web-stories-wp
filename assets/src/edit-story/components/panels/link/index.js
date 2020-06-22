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
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { useCallback, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useDebouncedCallback } from 'use-debounce';
import { Media, Row, Button } from '../../form';
import { createLink, getLinkFromElement } from '../../elementLink';
import { useAPI } from '../../../app/api';
import { useSnackbar } from '../../../app/snackbar';
import { isValidUrl, toAbsoluteUrl, withProtocol } from '../../../utils/url';
import { SimplePanel } from '../panel';
import { Note, ExpandedTextInput } from '../shared';
import useBatchingCallback from '../../../utils/useBatchingCallback';
import { useCanvas } from '../../canvas';
import { Close } from '../../../icons';

const IconText = styled.span`
  color: ${({ theme }) => theme.colors.fg.v1};
  font-family: ${({ theme }) => theme.fonts.body2.family};
  font-size: ${({ theme }) => theme.fonts.body2.size};
  line-height: ${({ theme }) => theme.fonts.body2.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing};
`;

const IconInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
`;

const IconRemoveButton = styled(Button)`
  margin-top: 6px;
  justify-content: flex-start;
  align-self: flex-start;
  padding: 4px 6px;
`;

const CloseIcon = styled(Close)`
  margin-right: 4px;
`;

function LinkPanel({ selectedElements, pushUpdateForObject }) {
  const { clearEditing } = useCanvas((state) => ({
    clearEditing: state.actions.clearEditing,
  }));

  const selectedElement = selectedElements[0];
  const defaultLink = useMemo(
    () => createLink({ url: '', icon: null, desc: null }),
    []
  );
  const link = useMemo(
    () => getLinkFromElement(selectedElement) || defaultLink,
    [selectedElement, defaultLink]
  );

  const [fetchingMetadata, setFetchingMetadata] = useState(false);

  const {
    actions: { getLinkMetadata },
  } = useAPI();
  const { showSnackbar } = useSnackbar();

  const updateLinkFromMetadataApi = useBatchingCallback(
    ({ url, title, icon }) =>
      pushUpdateForObject(
        'link',
        (prev) => ({
          url,
          desc: title ? title : prev.desc,
          icon: icon ? toAbsoluteUrl(url, icon) : prev.icon,
        }),
        defaultLink,
        true
      ),
    [pushUpdateForObject, defaultLink]
  );

  const [populateMetadata] = useDebouncedCallback((url) => {
    const urlWithProtocol = withProtocol(url);
    if (!isValidUrl(urlWithProtocol)) {
      return;
    }

    setFetchingMetadata(true);
    getLinkMetadata(urlWithProtocol)
      .then(({ title, image }) => {
        updateLinkFromMetadataApi({ url: urlWithProtocol, title, icon: image });
      })
      .catch(() => {
        showSnackbar({
          message: __('This is an invalid link.', 'web-stories'),
        });
      })
      .finally(() => {
        setFetchingMetadata(false);
      });
  }, 1200);

  const handleChange = useCallback(
    (properties, submit) => {
      clearEditing();

      if (properties.url) {
        populateMetadata(properties.url);
      }
      return pushUpdateForObject(
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
      handleChange({ icon: image.sizes?.medium?.url || image.url }, true);
    },
    [handleChange]
  );

  return (
    <SimplePanel name="link" title={__('Link', 'web-stories')}>
      <Row>
        <Note>{__('Type an address to apply a link', 'web-stories')}</Note>
      </Row>

      <Row>
        <ExpandedTextInput
          placeholder={__('Web address', 'web-stories')}
          onChange={(value) =>
            handleChange({ url: value }, !value /* submit */)
          }
          value={link.url || ''}
          clear
          aria-label={__('Edit: Element link', 'web-stories')}
        />
      </Row>

      {Boolean(link.url) && (
        <Row>
          <ExpandedTextInput
            placeholder={__('Optional description', 'web-stories')}
            onChange={(value) =>
              handleChange({ desc: value }, !value /* submit */)
            }
            value={link.desc || ''}
            aria-label={__('Edit: Link description', 'web-stories')}
          />
        </Row>
      )}
      {Boolean(link.url) && (
        <Row spaceBetween={false}>
          <Media
            value={link.icon || ''}
            onChange={handleChangeIcon}
            title={__('Select as link icon', 'web-stories')}
            buttonInsertText={__('Select as link icon', 'web-stories')}
            type={'image'}
            size={64}
            loading={fetchingMetadata}
            circle
          />
          <IconInfo>
            <IconText>{__('Optional brand icon', 'web-stories')}</IconText>
            {link.icon && (
              <IconRemoveButton
                onClick={() => handleChange({ icon: null }, true /* submit */)}
              >
                <CloseIcon width={14} height={14} />
                {__('Remove', 'web-stories')}
              </IconRemoveButton>
            )}
          </IconInfo>
        </Row>
      )}
    </SimplePanel>
  );
}

LinkPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdateForObject: PropTypes.func.isRequired,
};

export default LinkPanel;
