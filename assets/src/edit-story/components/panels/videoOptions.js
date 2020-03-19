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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
/**
 * External dependencies
 */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Switch } from '../form';
import { SimplePanel } from './panel';
import getCommonValue from './utils/getCommonValue';

function VideoOptionsPanel({ selectedElements, onSetProperties }) {
  const loop = getCommonValue(selectedElements, 'loop');
  const [state, setState] = useState({ loop });
  useEffect(() => {
    setState({ loop });
  }, [loop]);

  const handleChange = (value) => {
    const newState = {
      loop: value,
    };
    onSetProperties(newState);
    setState({ ...state, ...newState });
  };

  return (
    <SimplePanel
      name="videoOptions"
      title={__('Video settings', 'web-stories')}
    >
      <Switch
        value={state.loop}
        onLabel={__('Loop', 'web-stories')}
        offLabel={__('Play once', 'web-stories')}
        onChange={handleChange}
      />
    </SimplePanel>
  );
}

VideoOptionsPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default VideoOptionsPanel;
