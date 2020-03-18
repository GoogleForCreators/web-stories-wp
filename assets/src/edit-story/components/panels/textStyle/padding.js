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
import { useCallback, useEffect, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Label, Numeric, Row, Toggle } from '../../form';
import { dataPixels } from '../../../units';
import { ReactComponent as Locked } from '../../../icons/lock.svg';
import { ReactComponent as Unlocked } from '../../../icons/unlock.svg';
import getCommonValue from '../utils/getCommonValue';

const BoxedNumeric = styled(Numeric)`
  padding: 6px 6px;
  border-radius: 4px;
`;

const Space = styled.div`
  flex: 0 0 10px;
`;

function PaddingControls({ selectedElements, onSetProperties }) {
  const padding = getCommonValue(selectedElements, 'padding') ?? '';

  const [state, setState] = useState({
    padding,
  });
  const [lockPaddingRatio, setLockPaddingRatio] = useState(true);
  useEffect(() => {
    setState({
      padding,
    });
  }, [padding]);
  const updateProperties = useCallback(() => {
    onSetProperties(state);
  }, [onSetProperties, state]);

  useEffect(() => {
    // Don't update the values when input is empty.
    if (state.padding.vertical !== '' && state.padding.horizontal !== '') {
      updateProperties();
    }
  }, [state.padding, updateProperties]);

  const handleChange = useCallback(
    (property) => (value) => {
      const unchangedProperty =
        'horizontal' === property ? 'vertical' : 'horizontal';
      const newPadding = {
        [property]:
          isNaN(value) || '' === value ? '' : dataPixels(parseInt(value)),
      };
      newPadding[unchangedProperty] =
        typeof newPadding[property] === 'number' && lockPaddingRatio
          ? dataPixels(newPadding[property])
          : padding[unchangedProperty];
      setState({ ...state, padding: newPadding });
    },
    [lockPaddingRatio, padding, state]
  );

  return (
    <Row>
      <Label>{__('Padding', 'web-stories')}</Label>
      <BoxedNumeric
        suffix={_x('H', 'The Horizontal padding', 'web-stories')}
        value={state.padding.horizontal}
        onChange={handleChange('horizontal')}
      />
      <Space />
      <Toggle
        icon={<Locked />}
        uncheckedIcon={<Unlocked />}
        isMultiple={false}
        value={lockPaddingRatio}
        onChange={setLockPaddingRatio}
      />
      <Space />
      <BoxedNumeric
        suffix={_x('V', 'The Vertical padding', 'web-stories')}
        value={state.padding.vertical}
        onChange={handleChange('vertical')}
      />
    </Row>
  );
}

PaddingControls.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default PaddingControls;
