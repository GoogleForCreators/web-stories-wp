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
import { number } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import ColorList from '../';

export default {
  title: 'Dashboard/Components/ColorList',
  component: ColorList,
};

export const _default = () => {
  const colors = [
    { label: 'Red', color: 'red' },
    { label: 'Blue', color: 'blue' },
    { label: 'Green', color: 'green' },
    { label: 'White', color: 'white' },
  ];

  return (
    <ColorList
      colors={colors}
      size={number('Size', 50) || 0}
      spacing={number('Spacing', 10) || 10}
    />
  );
};
