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
import React, { useState } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import RadioGroup from '../radioGroup';

export default {
  title: 'Stories Editor/Components/Form/RadioGroup',
  component: RadioGroup,
  parameters: {
    backgrounds: {
      default: 'Dark',
    },
  },
};

export const _default = () => {
  const options = [
    {
      value: 'a',
      name: __('Option A', 'web-stories'),
      helper: __('This is the best option', 'web-stories'),
    },
    {
      value: 'b',
      name: __('Option B', 'web-stories'),
      helper: __('Also a good option', 'web-stories'),
    },
    {
      value: 'c',
      name: __('Option C without description', 'web-stories'),
    },
  ];
  const [value, setValue] = useState('a');

  return (
    <RadioGroup
      options={options}
      onChange={(evt) => setValue(evt.target.value)}
      value={value}
    />
  );
};
