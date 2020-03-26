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
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Row, Color } from '../form';
import { SimplePanel } from './panel';
import getCommonValue from './utils/getCommonValue';

function ShapeStylePanel({ selectedElements, pushUpdate }) {
  const backgroundColor = getCommonValue(selectedElements, 'backgroundColor');

  return (
    <SimplePanel name="style" title={__('Style', 'web-stories')}>
      <Row>
        <Color
          hasGradient
          value={backgroundColor}
          isMultiple={backgroundColor === ''}
          onChange={(value) => pushUpdate({ backgroundColor: value }, true)}
          label={__('Background color', 'web-stories')}
        />
      </Row>
    </SimplePanel>
  );
}

ShapeStylePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default ShapeStylePanel;
