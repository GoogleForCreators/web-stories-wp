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
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { useCallback, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useDebouncedCallback } from 'use-debounce';
import { Media, Row } from '../../form';
import {
  createLink,
  inferLinkType,
  getLinkFromElement,
  LinkType,
} from '../../link';
import { useAPI } from '../../../app/api';
import { isValidUrl, toAbsoluteUrl, withProtocol } from '../../../utils/url';
import { ReactComponent as Info } from '../../../icons/info.svg';
import { SimplePanel } from '../panel';
import { Note, ExpandedTextInput } from '../shared';
import Dialog from '../../dialog';
import theme from '../../../theme';
import useBatchingCallback from '../../../utils/useBatchingCallback';
import { Plain } from '../../button';
import LinkInfoDialog from './infoDialog';

const BrandIconText = styled.span`
  margin-left: 12px;
`;

const ActionableNote = styled(Note)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const InfoIcon = styled(Info)`
  width: 13px;
  height: 13px;
  margin-top: -2px;
  margin-left: 2px;
  justify-self: flex-end;
`;

function LinkPanel({ selectedElements, pushUpdateForObject }) {
  const selectedElement = selectedElements[0];
  const { isFill } = selectedElement;
  const inferredLinkType = useMemo(() => inferLinkType(selectedElement), [
    selectedElement,
  ]);
  const defaultLink = useMemo(
    () => createLink({ url: null, icon: null, desc: null }),
    []
  );
  const link = useMemo(
    () => getLinkFromElement(selectedElement) || defaultLink,
    [selectedElement, defaultLink]
  );
  const canLink = selectedElements.length === 1 && !isFill;

  const [fetchingMetadata, setFetchingMetadata] = useState(false);

  const {
    actions: { getLinkMetadata },
  } = useAPI();

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
      .catch((reason) => {
        if (reason?.code === 'rest_invalid_url') {
          return;
        }
        throw reason;
      })
      .finally(() => {
        setFetchingMetadata(false);
      });
  }, 1200);

  const handleChange = useCallback(
    (properties, submit) => {
      if (properties.url) {
        populateMetadata(properties.url);
      }
      return pushUpdateForObject(
        'link',
        {
          ...properties,
          type: inferredLinkType,
        },
        defaultLink,
        submit
      );
    },
    [populateMetadata, pushUpdateForObject, inferredLinkType, defaultLink]
  );

  const handleChangeIcon = useCallback(
    (image) => {
      handleChange({ icon: image.sizes?.medium?.url || image.url }, true);
    },
    [handleChange]
  );

  // Informational dialog
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const openDialog = useCallback(() => setInfoDialogOpen(true), []);
  const closeDialog = useCallback(() => setInfoDialogOpen(false), []);

  return (
    <SimplePanel name="link" title={__('Link', 'web-stories')}>
      <Row>
        <ActionableNote onClick={() => openDialog()}>
          {__('Enter an address to apply a 1 or 2-tap link', 'web-stories')}
          <InfoIcon />
        </ActionableNote>
      </Row>

      <Row>
        <ExpandedTextInput
          placeholder={__('Web address', 'web-stories')}
          disabled={!canLink}
          onChange={(value) => handleChange({ url: value })}
          value={link.url || ''}
          clear
        />
      </Row>

      {Boolean(link.url) && link.type === LinkType.TWO_TAP && (
        <Row>
          <ExpandedTextInput
            placeholder={__('Optional description', 'web-stories')}
            disabled={!canLink}
            onChange={(value) => handleChange({ desc: value })}
            value={link.desc || ''}
          />
        </Row>
      )}
      {Boolean(link.url) && link.type === LinkType.TWO_TAP && (
        <Row spaceBetween={false}>
          <Media
            value={link.icon || ''}
            onChange={handleChangeIcon}
            title={__('Select as link icon', 'web-stories')}
            buttonInsertText={__('Select as link icon', 'web-stories')}
            type={'image'}
            size={60}
            loading={fetchingMetadata}
            circle
          />
          <BrandIconText>
            {__('Optional brand icon', 'web-stories')}
          </BrandIconText>
        </Row>
      )}
      <Dialog
        open={infoDialogOpen}
        onClose={closeDialog}
        title={__('How to apply a link', 'web-stories')}
        actions={
          <Plain onClick={() => closeDialog()}>
            {__('Ok, got it', 'web-stories')}
          </Plain>
        }
        style={{
          overlay: {
            background: rgba(theme.colors.bg.v11, 0.6),
          },
        }}
      >
        <LinkInfoDialog />
      </Dialog>
    </SimplePanel>
  );
}

LinkPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdateForObject: PropTypes.func.isRequired,
};

export default LinkPanel;
