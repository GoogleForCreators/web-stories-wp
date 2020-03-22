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
import { useCallback, useEffect, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Media, Row } from '../form';
import { Note, ExpandedTextInput } from './shared';
import { SimplePanel } from './panel';
import getCommonObjectValue from './utils/getCommonObjectValue';
import getCommonValue from './utils/getCommonValue';

function VideoAccessibilityPanel({ selectedElements, onSetProperties }) {
  const resource = getCommonValue(selectedElements, 'resource');
  const { posterId, poster, title, alt } = getCommonObjectValue(
    selectedElements,
    'resource',
    ['posterId', 'poster', 'title', 'alt'],
    false
  );
  const [state, setState] = useState({ posterId, poster, title, alt });
  useEffect(() => {
    setState({ posterId, poster, title, alt });
  }, [posterId, poster, title, alt]);

  const handleSubmit = (evt) => {
    onSetProperties(state);
    evt.preventDefault();
  };

  const handleChangeImage = (image) => {
    const newState = {
      posterId: image.id,
      poster: image.sizes?.medium?.url || image.url,
    };
    setState({ ...state, ...newState });
    onSetProperties({ resource: { ...resource, ...newState } });
  };

  const handleChange = useCallback(
    (property) => (value) => {
      const newState = {
        [property]: value,
      };
      setState({ ...state, ...newState });
      onSetProperties({ resource: { ...resource, ...newState } });
    },
    [state, onSetProperties, resource]
  );

  return (
    <SimplePanel
      name="videoAccessibility"
      title={__('Accessibility', 'web-stories')}
      onSubmit={handleSubmit}
    >
      <Row>
        <Media
          value={state.poster}
          onChange={handleChangeImage}
          title={__('Select as video poster', 'web-stories')}
          buttonInsertText={__('Set as video poster', 'web-stories')}
          type={'image'}
        />
      </Row>
      <Row>
        <ExpandedTextInput
          placeholder={__('Title', 'web-stories')}
          value={state.title || ''}
          onChange={handleChange('title')}
          clear
        />
      </Row>
      <Row>
        <ExpandedTextInput
          placeholder={__('Assistive text', 'web-stories')}
          value={state.alt || ''}
          onChange={handleChange('alt')}
          clear
        />
      </Row>
      <Row>
        <Note>{__('Text for visually impaired users.', 'web-stories')}</Note>
      </Row>
    </SimplePanel>
  );
}

VideoAccessibilityPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default VideoAccessibilityPanel;
