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
import { useState } from '@googleforcreators/react';
import { __, _x } from '@googleforcreators/i18n';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import FilterToggle from '../filterToggle';
import Row from '../../row';
import { dummyImage } from '../../../devTools/dummyData';

const StyledRow = styled(Row)`
  width: 300px;
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  padding: 20px;
  button {
    margin-right: 10px;
  }
`;

export default {
  title: 'Stories Editor/Components/Form/FilterToggle',
  component: FilterToggle,
  parameters: {
    backgrounds: {
      default: 'Dark',
    },
  },
};

export const _default = () => {
  const filters = [
    {
      value: 'a',
      filter: {
        type: 'radial',
        size: { w: 0.8, h: 0.5 },
        stops: [
          { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0 },
          { color: { r: 0, g: 0, b: 0, a: 0.7 }, position: 1 },
        ],
        alpha: 0.6,
      },
      label: __('Radial', 'web-stories'),
      helper: __('This is the best option', 'web-stories'),
      isToggled: true,
    },
    {
      value: 'b',
      filter: {
        type: 'linear',
        rotation: 0,
        stops: [
          { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0 },
          { color: { r: 0, g: 0, b: 0, a: 0.7 }, position: 1 },
        ],
        alpha: 0.9,
      },
      label: __('Linear', 'web-stories'),
      helper: __('Also a good option', 'web-stories'),
    },
    {
      value: 'c',
      filter: null,
      label: _x('None', 'filter', 'web-stories'),
    },
  ];
  const [value, setValue] = useState('a');

  return (
    <StyledRow>
      {filters.map(({ value: toggleValue, ...rest }) => {
        return (
          <FilterToggle
            {...rest}
            key={toggleValue}
            isToggled={toggleValue === value}
            onClick={() => setValue(toggleValue)}
          >
            <img src={dummyImage} alt={rest.label} />
          </FilterToggle>
        );
      })}
    </StyledRow>
  );
};
