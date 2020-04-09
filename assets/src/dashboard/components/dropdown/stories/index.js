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
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import Dropdown from '../';
import { DROPDOWN_TYPES } from '../../../constants';

const demoItems = [
  { value: '1', label: 'one' },
  { value: 'foo', label: 'two' },
  { value: 'bar', label: 'three' },
];

const DropdownWrapper = styled.div`
  width: 200px;
`;

const FillerContainer = styled.div`
  width: 800px;
  height: 900px;
  background-color: lightblue;
  margin-top: 20px;
`;

export default {
  title: 'Dashboard/Components/Dropdown',
  component: Dropdown,
};

export const _default = () => {
  const [value, setValue] = useState();

  return (
    <DropdownWrapper>
      <Dropdown
        ariaLabel={text('ariaLabel', 'my dropdown description')}
        items={demoItems}
        disabled={boolean('disabled')}
        value={value}
        placeholder={text('placeholder', 'Select Value')}
        onChange={(item) => {
          action(`clicked on dropdown item ${item.value}`)(item);
          setValue(item.value);
        }}
      />
      <FillerContainer />
    </DropdownWrapper>
  );
};

export const _transparent = () => {
  const [value, setValue] = useState();

  return (
    <DropdownWrapper>
      <Dropdown
        ariaLabel={text('ariaLabel', 'my dropdown description')}
        items={demoItems}
        disabled={boolean('disabled')}
        value={value}
        type={DROPDOWN_TYPES.TRANSPARENT_MENU}
        placeholder={text('placeholder', 'Select Value')}
        onChange={(item) => {
          action(`clicked on dropdown item ${item.value}`)(item);
          setValue(item.value);
        }}
      />
      <FillerContainer />
    </DropdownWrapper>
  );
};

const categoryDemoData = [
  {
    label: <span>{'All Categories'}</span>,
    value: 'all',
    selected: true,
  },
  { label: 'Arts and Crafts', value: 'arts_crafts' },
  { label: 'Beauty', value: 'beauty' },
  { label: 'Cooking', value: 'cooking' },
  { label: 'News', value: 'news' },
  { label: 'Sports', value: 'sports' },
  { label: 'News', value: 'news' },
  { label: 'UNCLICKABLE', value: false },
];

export const _panel = () => {
  const [statefulDemoData, setStatefulDemoData] = useState(categoryDemoData);

  const updateDemoDataState = (datumToUpdate) => {
    const newDemoData = statefulDemoData.map((item) => {
      if (item.value === datumToUpdate) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });

    setStatefulDemoData(newDemoData);
  };
  return (
    <DropdownWrapper>
      <Dropdown
        ariaLabel={text('ariaLabel', 'my dropdown description')}
        disabled={boolean('disabled')}
        type={DROPDOWN_TYPES.PANEL}
        placeholder={text('placeholder', 'Category')}
        items={statefulDemoData}
        onChange={(selectedValue) => {
          action(`clicked on dropdown item ${selectedValue}`)(selectedValue);
          updateDemoDataState(selectedValue);
        }}
      />
      <FillerContainer />
    </DropdownWrapper>
  );
};
