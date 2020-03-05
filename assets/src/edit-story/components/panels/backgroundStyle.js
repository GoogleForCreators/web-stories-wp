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
import { useEffect, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Row } from '../form';
import { SimplePanel } from './panel';
import getCommonValue from './utils/getCommonValue';
import OpacityControl from './shared/opacityControl';

function BackgroundStylePanel({ selectedElements, onSetProperties }) {
  const opacity = getCommonValue(selectedElements, 'opacity');
  const [state, setState] = useState({ opacity });

  useEffect(() => {
    setState({ opacity });
  }, [opacity]);
  const handleSubmit = (evt) => {
    onSetProperties(state);
    evt.preventDefault();
  };
  // TODO: removing as background, flipping, layover will also be displayed here at some point.
  return (
    <SimplePanel
      name="backgroundStyle"
      title={__('Style', 'web-stories')}
      onSubmit={handleSubmit}
    >
      <Row expand={false} spaceBetween={true}>
        <OpacityControl
          value={state.opacity}
          onChange={(value) =>
            setState({
              ...state,
              opacity: isNaN(value) || value === '' ? '' : parseFloat(value),
            })
          }
        />
      </Row>
    </SimplePanel>
  );
}

BackgroundStylePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default BackgroundStylePanel;
