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
import { useEffect, useCallback, useMemo, useState } from 'react';
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

function LinkPanel({ selectedElements, onSetProperties }) {
  const selectedElement = selectedElements[0];
  const { isFill } = selectedElement;
  const link = getLinkFromElement(selectedElement);
  const inferredLinkType = useMemo(() => inferLinkType(selectedElement), [
    selectedElement,
  ]);

  const [state, setState] = useState({
    ...(link || createLink({ type: inferredLinkType })),
  });

  const [fetchingMetadata, setFetchingMetadata] = useState(false);
  useEffect(() => {
    setState({ ...link });
  }, [link]);

  const handleChange = useCallback(
    (property) => (value) =>
      setState((originalState) => ({
        ...(originalState && originalState?.type
          ? originalState
          : createLink({ type: inferredLinkType })),
        [property]: value,
      })),
    [setState, inferredLinkType]
  );
  const handleChangeIcon = useCallback(
    (image) => {
      const icon = image.sizes?.medium?.url || image.url;
      setState((originalState) => ({
        ...originalState,
        icon,
      }));
      onSetProperties({ link: { ...state, icon } });
    },
    [state, onSetProperties]
  );
  const handleSubmit = useCallback(
    (evt) => {
      onSetProperties({ link: state?.url ? { ...state } : null });
      if (evt) {
        evt.preventDefault();
      }
    },
    [state, onSetProperties]
  );

  const {
    actions: { getLinkMetadata },
  } = useAPI();

  const canLink = selectedElements.length === 1 && !isFill;

  const [populateMetadata] = useDebouncedCallback((url) => {
    const urlWithProtocol = withProtocol(url);
    if (!isValidUrl(urlWithProtocol)) {
      return;
    }
    setFetchingMetadata(true);
    getLinkMetadata(urlWithProtocol)
      .then(({ title, image }) => {
        setState((originalState) => ({
          ...originalState,
          url: urlWithProtocol,
          desc: title ? title : originalState.desc,
          icon: image
            ? toAbsoluteUrl(urlWithProtocol, image)
            : originalState.icon,
        }));
      })
      .finally(() => {
        setFetchingMetadata(false);
      });
  }, 1200);

  useEffect(() => {
    if (state.url === '') {
      setState({ url: null, desc: null, icon: null, type: inferredLinkType });
      onSetProperties({ link: null });
    } else if (state.url) {
      populateMetadata(state?.url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSetProperties, populateMetadata, inferredLinkType, state.url]);

  // Informational dialog
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const openDialog = useCallback(() => setInfoDialogOpen(true), []);
  const closeDialog = useCallback(() => setInfoDialogOpen(false), []);

  return (
    <SimplePanel
      name="link"
      title={__('Link', 'web-stories')}
      onSubmit={(evt) => handleSubmit(evt)}
    >
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
          onChange={handleChange('url')}
          value={state.url || ''}
          clear
        />
      </Row>

      {Boolean(state.url) && state.type === LinkType.TWO_TAP && (
        <Row>
          <ExpandedTextInput
            placeholder={__('Optional description', 'web-stories')}
            disabled={!canLink}
            onChange={handleChange('desc')}
            value={state.desc || ''}
          />
        </Row>
      )}
      {Boolean(state.url) && state.type === LinkType.TWO_TAP && (
        <Row spaceBetween={false}>
          <Media
            value={state?.icon}
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
        buttons={[
          {
            text: __('OK, GOT IT', 'web-stories'),
            action: () => closeDialog(),
          },
        ]}
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
  onSetProperties: PropTypes.func.isRequired,
};

export default LinkPanel;
