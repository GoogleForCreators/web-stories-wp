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
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import PopoverPanel from '..';

export default {
  title: 'Dashboard/Components/PopoverPanel',
  component: PopoverPanel,
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
  { label: __('News', 'web-stories'), value: 'news' },
  { label: __('UNCLICKABLE', 'web-stories'), value: false },
];

export const _default = () => (
  <PopoverPanel
    isOpen={boolean('isOpen', true)}
    title={text('title', 'Category')}
    onClose={action('Close button selected')}
    items={categoryDemoData}
    onSelect={action('on click selected')}
  />
);
