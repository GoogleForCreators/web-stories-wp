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
import { useCallback, useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useDebouncedCallback } from 'use-debounce';
import { Media, Row } from '../form';
import {
  createLink,
  inferLinkType,
  getLinkFromElement,
  LinkType,
} from '../link';
import { useAPI } from '../../app/api';
import { isValidUrl, toAbsoluteUrl, withProtocol } from '../../utils/url';
import { SimplePanel } from './panel';
import { Note, ExpandedTextInput } from './shared';

const DEFAULT_LINK = createLink({ url: null, icon: null, desc: null });

function LinkPanel({ selectedElements, pushUpdateForObject }) {
  const selectedElement = selectedElements[0];
  const { isFill } = selectedElement;
  const inferredLinkType = useMemo(() => inferLinkType(selectedElement), [
    selectedElement,
  ]);
  const link = useMemo(
    () => getLinkFromElement(selectedElement) || DEFAULT_LINK,
    [selectedElement]
  );
  const canLink = selectedElements.length === 1 && !isFill;

  const [fetchingMetadata, setFetchingMetadata] = useState(false);

  const {
    actions: { getLinkMetadata },
  } = useAPI();

  const [populateMetadata] = useDebouncedCallback((url) => {
    const urlWithProtocol = withProtocol(url);
    if (!isValidUrl(urlWithProtocol)) {
      return;
    }
    setFetchingMetadata(true);
    getLinkMetadata(urlWithProtocol)
      .then(({ title, image }) => {
        pushUpdateForObject(
          'link',
          (prev) => ({
            url: urlWithProtocol,
            desc: title ? title : prev.desc,
            icon: image ? toAbsoluteUrl(urlWithProtocol, image) : prev.icon,
          }),
          DEFAULT_LINK,
          true
        );
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
        DEFAULT_LINK,
        submit
      );
    },
    [populateMetadata, pushUpdateForObject, inferredLinkType]
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
        <Note>
          {__('Enter an address to apply a 1 or 2 tap link', 'web-stories')}
        </Note>
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
          <span>{__('Optional brand icon', 'web-stories')}</span>
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
