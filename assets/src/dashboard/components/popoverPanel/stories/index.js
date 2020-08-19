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
import { useCallback, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { TEMPLATE_COLOR_ITEMS } from '../../../constants';
import { PILL_LABEL_TYPES } from '../../../constants/components';
import PopoverPanel from '../';

export default {
  title: 'Dashboard/Components/PopoverPanel',
  component: PopoverPanel,
};

const categoryDemoData = [
  {
    label: <span>{__('All Categories', 'web-stories')}</span>,
    value: 'all',
  },
  { label: __('Arts and Crafts', 'web-stories'), value: 'arts_crafts' },
  { label: __('Beauty', 'web-stories'), value: 'beauty', selected: true },
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

export const _default = () => {
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
    <PopoverPanel
      isOpen={boolean('isOpen', true)}
      title={text('title', 'Category')}
      items={statefulDemoData}
      onClose={(e) => action(`close button clicked`)(e)}
      onSelect={(_, selectedValue) => {
        action(`selected pill ${selectedValue}`)(selectedValue);
        updateDemoDataState(selectedValue);
      }}
    />
  );
};

export const _colorSwatchPanel = () => {
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
    <PopoverPanel
      isOpen={boolean('isOpen', true)}
      title={text('title', 'Category')}
      items={statefulDemoData}
      labelType={PILL_LABEL_TYPES.SWATCH}
      onClose={(e) => action(`close button clicked`)(e)}
      onSelect={(_, selectedValue) => {
        action(`selected pill ${selectedValue}`)(selectedValue);
        updateDemoDataState(selectedValue);
      }}
    />
  );
};
