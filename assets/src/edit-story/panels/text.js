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
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import { Panel, Title, InputGroup, getCommonValue } from './shared';

function TextPanel({ selectedElements, onSetProperties }) {
  const content = getCommonValue(selectedElements, 'content');
  const [state, setState] = useState({ content });
  useEffect(() => {
    setState({ content });
  }, [content]);
  const handleSubmit = (evt) => {
    onSetProperties(state);
    evt.preventDefault();
  };
  return (
    <Panel onSubmit={handleSubmit}>
      <Title>
        { __('Text', 'web-stories') }
      </Title>
      <InputGroup
        type="text"
        label={__('Text content', 'web-stories')}
        value={state.content}
        isMultiple={content === ''}
        onChange={(value) => setState({ ...state, content: value })}
      />
    </Panel>
  );
}

TextPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default TextPanel;
