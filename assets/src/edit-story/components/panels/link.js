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

/**
 * WordPress dependencies
 */
import { useEffect, useCallback, useState } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useDebouncedCallback } from 'use-debounce';
import { Media, Row } from '../form';
import { createLink } from '../link';
import { useAPI } from '../../app/api';
import { isValidUrl, toAbsoluteUrl, withProtocol } from '../../utils/url';
import { SimplePanel } from './panel';
import { Note, ExpandedTextInput } from './shared';
import getCommonValue from './utils/getCommonValue';

function LinkPanel({ selectedElements, onSetProperties }) {
  const link = getCommonValue(selectedElements, 'link') || null;
  const isFill = getCommonValue(selectedElements, 'isFill');

  const [fetchingMetadata, setFetchingMetadata] = useState(false);
  const [state, setState] = useState({ ...(link || createLink()) });
  useEffect(() => {
    setState({ ...link });
  }, [link]);

  const handleChange = useCallback(
    (property) => (value) =>
      setState((originalState) => ({
        ...originalState,
        [property]: value,
      })),
    [setState]
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
    [onSetProperties, state]
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
      setState({ url: null, desc: null, icon: null });
      onSetProperties({ link: null });
    } else if (state.url) {
      populateMetadata(state.url);
    }
  }, [onSetProperties, populateMetadata, state.url]);

  return (
    <SimplePanel
      name="link"
      title={__('Link', 'web-stories')}
      onSubmit={(evt) => handleSubmit(evt)}
    >
      <Row>
        <Note>
          {__('Enter an address to apply a 1 or 2 tap link', 'web-stories')}
        </Note>
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

      {Boolean(state.url) && (
        <Row>
          <ExpandedTextInput
            placeholder={__('Optional description', 'web-stories')}
            disabled={!canLink}
            onChange={handleChange('desc')}
            value={state.desc || ''}
          />
        </Row>
      )}
      {Boolean(state.url) && (
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
          <span>{__('Optional brand icon', 'web-stories')}</span>
        </Row>
      )}
    </SimplePanel>
  );
}

LinkPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default LinkPanel;
