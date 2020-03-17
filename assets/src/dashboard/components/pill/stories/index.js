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
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import Pill from '../';

export default {
  title: 'Dashboard/Components/Pill',
  component: Pill,
};

export const _default = () => {
  return (
    <Pill
      displayText={text('demo checkbox text')}
      inputType="checkbox"
      name="demo_checkbox"
      onClick={action('on click selected')}
      value={text('demo_value')}
      isSelected={boolean('isSelected')}
    />
  );
};

export const _radioGroup = () => {
  return (
    <legend>
      <Pill
        displayText="Left"
        inputType="radio"
        name="demo_radio"
        onClick={action('on click selected')}
        value="left"
        isSelected={boolean('isSelected', true)}
      />
      <Pill
        displayText="Right"
        inputType="radio"
        name="demo_radio"
        onClick={action('on click selected')}
        value="right"
        isSelected={boolean('isSelected')}
      />
    </legend>
  );
};
