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
import { SimplePanel } from './panel';
import getCommonValue from './utils/getCommonValue';
import OpacityControl from './shared/opacityControl';

function MediaStylePanel({ selectedElements, onSetProperties }) {
  const opacity = getCommonValue(selectedElements, 'opacity');
  const [state, setState] = useState({ opacity });

  useEffect(() => {
    setState({ opacity });
  }, [opacity]);
  const handleSubmit = (evt) => {
    onSetProperties(state);
    evt.preventDefault();
  };
  return (
    <SimplePanel
      name="mediaStyle"
      title={__('Style', 'web-stories')}
      onSubmit={handleSubmit}
    >
      <OpacityControl
        properties={{
          opacity,
        }}
        setState={setState}
        state={state}
      />
    </SimplePanel>
  );
}

MediaStylePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default MediaStylePanel;
