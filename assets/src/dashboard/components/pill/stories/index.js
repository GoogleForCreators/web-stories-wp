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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Pill, FloatingTab } from '../';

export default {
  title: 'Dashboard/Components/Pill',
  component: Pill,
};

const TEMP_EDIT_PENCIL = (
  <svg
    width="13"
    height="12"
    viewBox="0 0 13 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.2466 0.193333L11.8066 1.75333C12.0666 2.01333 12.0666 2.43333 11.8066 2.69333L10.5866 3.91333L8.08655 1.41333L9.30655 0.193333C9.43322 0.0666667 9.59988 0 9.77322 0C9.94655 0 10.1132 0.06 10.2466 0.193333ZM0 9.49833V11.9983H2.5L9.87333 4.625L7.37333 2.125L0 9.49833ZM1.94732 10.6651H1.33398V10.0517L7.37398 4.01172L7.98732 4.62505L1.94732 10.6651Z"
      fill="currentcolor"
    />
  </svg>
);

const categoryDemoData = [
  {
    label: 'All categories',
    value: 'all',
    icon: TEMP_EDIT_PENCIL,
    selected: true,
  },
  { label: 'Arts and Crafts', value: 'arts_crafts', icon: TEMP_EDIT_PENCIL },
  { label: 'Beauty', value: 'beauty', icon: TEMP_EDIT_PENCIL },
  { label: 'Cooking', value: 'cooking', icon: TEMP_EDIT_PENCIL },
  { label: 'Sports', value: 'sports', icon: TEMP_EDIT_PENCIL },
  { label: 'News', value: 'news', icon: TEMP_EDIT_PENCIL },
];

const DemoFieldSet = styled.fieldset`
  width: 550px;
  margin: 0;
  border: none;
  > label {
    margin: 0 16px 0 0;
  }
`;

const IconSpan = styled.span`
  color: purple;
  margin-right: 5px;
`;

export const _default = () => {
  return (
    <DemoFieldSet>
      {categoryDemoData.map(({ icon, label, selected, value }, index) => {
        return (
          <Pill
            key={value + index}
            inputType="checkbox"
            name="demo_checkbox"
            onClick={action('on click selected')}
            value={value}
            isSelected={boolean(`isSelected: ${index}`, selected)}
          >
            <IconSpan>{icon}</IconSpan> {text(`label: ${index}`, label)}
          </Pill>
        );
      })}
    </DemoFieldSet>
  );
};

export const _floatingTabs = () => {
  return (
    <DemoFieldSet>
      {categoryDemoData.map(({ icon, label, selected, value }, index) => {
        return (
          <FloatingTab
            key={value + index}
            inputType="checkbox"
            name="demo_checkbox"
            onClick={action('on click selected')}
            value={value}
            isSelected={boolean(`isSelected: ${index}`, selected)}
          >
            <IconSpan>{icon}</IconSpan> {text(`label: ${index}`, label)}
          </FloatingTab>
        );
      })}
    </DemoFieldSet>
  );
};

export const _radioGroup = () => {
  return (
    <DemoFieldSet>
      {categoryDemoData.map(({ label, selected, value }, index) => {
        return (
          <Pill
            key={value + index}
            inputType="radio"
            name="demo_radio"
            onClick={action('on click selected')}
            value={value}
            isSelected={boolean(`isSelected: ${index}`, selected)}
          >
            {text(`label: ${index}`, label)}
          </Pill>
        );
      })}
    </DemoFieldSet>
  );
};
