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
import { radialLine, curveBasisClosed } from 'd3-shape';
import { range } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Row, Color, Numeric } from '../form';
import { MaskTypes } from '../../masks';
import { SimplePanel } from './panel';
import getCommonValue from './utils/getCommonValue';
import getColorPickerActions from './utils/getColorPickerActions';

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
`;

function ShapeStylePanel({ selectedElements, pushUpdate }) {
  const backgroundColor = getCommonValue(selectedElements, 'backgroundColor');
  const isBackground = getCommonValue(selectedElements, 'isBackground');
  const mask = getCommonValue(selectedElements, 'mask');
  const [complexity, setComplexity] = useState(1);
  const [contrast, setContrast] = useState(1);

  const onChange = useCallback(
    (value) => pushUpdate({ backgroundColor: value }, true),
    [pushUpdate]
  );

  useEffect(() => {
    const path = roundPath(
      generateBlobShape(generateData(complexity, contrast)) + 'Z'
    );
    // console.log('complexity, contrast', complexity, contrast);
    // console.log('path', path);
    pushUpdate({ mask: { ...mask, path } }, true);
  }, [complexity, contrast, mask, pushUpdate]);

  const roundPath = (path, precision = 0.1) => {
    if (!path) {
      return '';
    }
    const query = /[\d.-][\d.e-]*/g;
    return path.replace(
      query,
      (n) => Math.round(n * (1 / precision)) / (1 / precision)
    );
  };

  const generateBlobShape = (data) => {
    const shapeGenerator = radialLine()
      .angle((d, i) => (i / data.length) * 2 * Math.PI)
      .curve(curveBasisClosed)
      .radius(() => 0.2);
    return shapeGenerator(data.map((d) => Math.abs(d)));
  };

  const generateData = (comp, cont) => {
    const scale = scaleLinear()
      .domain([0, 1])
      .range([100 - ((100 / 8) * cont - 0.01), 100]);
    return range(comp).map(() => scale(Math.random()));
  };

  return (
    <SimplePanel name="style" title={__('Style', 'web-stories')}>
      <Row>
        <Color
          hasGradient
          value={backgroundColor}
          isMultiple={backgroundColor === ''}
          onChange={onChange}
          label={__('Background color', 'web-stories')}
          hasOpacity={!isBackground}
          colorPickerActions={getColorPickerActions}
        />
      </Row>
      {mask.type === MaskTypes.BLOB && (
        <Row>{__('Blob Generator', 'web-stories')}</Row>
      )}
      <Row expand>
        <BoxedNumeric
          value={complexity}
          suffix={_x(
            'Complexity',
            'Complexity of the blob shape',
            'web-stories'
          )}
          onChange={(value) => {
            setComplexity(value);
          }}
          aria-label={__('Complexity', 'web-stories')}
        />
      </Row>
      <Row expand>
        <BoxedNumeric
          value={contrast}
          suffix={_x('Contrast', 'Contrast of the blob shape', 'web-stories')}
          onChange={(value) => {
            setContrast(value);
          }}
          aria-label={__('Contrast', 'web-stories')}
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
