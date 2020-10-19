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

/**
 * Internal dependencies
 */
import { BoxedNumeric } from '../../form';
import useSetupFor from '../useSetupFor';

export function SimpleNumeric({ className, property, ...rest }) {
  const { value, min, max } = useSetupFor(property);
  return (
    <BoxedNumeric
      className={className}
      value={value}
      min={min}
      max={max}
      {...rest}
    />
  );
}

SimpleNumeric.propTypes = {
  property: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export const GrowNumeric = styled(SimpleNumeric)`
  flex-grow: 1;
`;
