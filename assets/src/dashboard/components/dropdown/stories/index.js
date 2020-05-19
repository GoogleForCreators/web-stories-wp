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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { useCallback, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import Dropdown from '../';
import { DROPDOWN_TYPES, TEMPLATE_COLOR_ITEMS } from '../../../constants';

const demoItems = [
  { value: '1', label: __('one', 'web-stories') },
  { value: 'foo', label: __('two', 'web-stories') },
  { value: 'bar', label: __('three', 'web-stories') },
];

const DropdownWrapper = styled.div`
  width: 200px;
  margin: 20px 50px;
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

const categoryDemoData = [
  {
    label: <span>{__('All Categories', 'web-stories')}</span>,
    value: 'all',
    selected: true,
  },
  { label: __('Arts and Crafts', 'web-stories'), value: 'arts_crafts' },
  { label: __('Beauty', 'web-stories'), value: 'beauty' },
  { label: __('Cooking', 'web-stories'), value: 'cooking' },
  { label: __('News', 'web-stories'), value: 'news' },
  { label: __('Sports', 'web-stories'), value: 'sports' },
  { label: __('News', 'web-stories'), value: 'news_2' },
  {
    label: __('UNCLICKABLE', 'web-stories'),
    value: 'unclickable',
    disabled: true,
  },
];

export const _panel = () => {
  const [statefulDemoData, setStatefulDemoData] = useState(categoryDemoData);

  const updateDemoDataState = useCallback(
    (dataToUpdate) => {
      const newDemoData = statefulDemoData.map((item) => {
        if (item.value === dataToUpdate) {
          return { ...item, selected: !item.selected };
        }
        return item;
      });

      setStatefulDemoData(newDemoData);
    },
    [statefulDemoData]
  );

  return (
    <DropdownWrapper>
      <Dropdown
        ariaLabel={text('ariaLabel', 'my semantic label')}
        disabled={boolean('disabled')}
        type={DROPDOWN_TYPES.PANEL}
        placeholder={text('placeholder', 'My dropdown for categories')}
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

export const _colorPanel = () => {
  const [statefulDemoData, setStatefulDemoData] = useState(
    TEMPLATE_COLOR_ITEMS
  );

  const updateDemoDataState = useCallback(
    (dataToUpdate) => {
      const newDemoData = statefulDemoData.map((item) => {
        if (item.value === dataToUpdate) {
          return { ...item, selected: !item.selected };
        }
        return item;
      });

      setStatefulDemoData(newDemoData);
    },
    [statefulDemoData]
  );

  return (
    <DropdownWrapper>
      <Dropdown
        ariaLabel={text('ariaLabel', 'choose colors to filter on')}
        disabled={boolean('disabled')}
        type={DROPDOWN_TYPES.COLOR_PANEL}
        placeholder={text('placeholder', 'My dropdown for colors')}
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
