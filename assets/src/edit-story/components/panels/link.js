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
import { debounce } from 'throttle-debounce';

/**
 * WordPress dependencies
 */
import { useEffect, useCallback, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { TextInput, Media, Row } from '../form';
import {
  createLink,
  inferLinkType,
  getLinkFromElement,
  LinkType,
} from '../link';
import { SimplePanel } from './panel';

const BoxedTextInput = styled(TextInput)`
  padding: 6px 6px;
  border-radius: 4px;
`;

const ExpandedTextInput = styled(BoxedTextInput)`
  flex-grow: 1;
`;

const Note = styled.span`
  color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.54)};
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: 12px;
  line-height: 16px;
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

  const canLink = selectedElements.length === 1 && !isFill;
  const populateMetadata = useCallback(
    debounce(300, async (/** url */) => {
      // TODO(wassgha): Implement getting the page metadata
    })
  );

  useEffect(() => {
    if (state.url === '') {
      setState({ url: null, desc: null, icon: null, type: inferredLinkType });
      onSetProperties({ link: null });
    } else if (state?.url) {
      populateMetadata(state?.url);
    }
  }, [onSetProperties, populateMetadata, inferredLinkType, state]);

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
      {/** TODO(@wassgha): Replace with image upload component */}
      {Boolean(state.url) && state.type === LinkType.TWO_TAP && (
        <Row spaceBetween={false}>
          <Media
            value={state?.icon}
            onChange={handleChangeIcon}
            title={__('Select as link icon', 'web-stories')}
            buttonInsertText={__('Select as link icon', 'web-stories')}
            type={'image'}
            size={60}
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
