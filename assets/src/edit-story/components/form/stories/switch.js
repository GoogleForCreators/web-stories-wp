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
import { useState } from 'react';
import { boolean, text } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import Switch from '../switch';

export default {
  title: 'Stories Editor/Components/Form/Switch',
  component: Switch,
};

export const _default = () => {
  const onLabel = text('OnLabel', 'Fit to Device');
  const offLabel = text('OffLabel', 'Do not format');
  const disabled = boolean('Disabled', false);
  const [value, setValue] = useState(true);

  return (
    <Switch
      value={value}
      onLabel={onLabel}
      offLabel={offLabel}
      onChange={setValue}
      disabled={disabled}
    />
  );
};
