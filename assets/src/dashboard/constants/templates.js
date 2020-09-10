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

export const TEMPLATE_CATEGORIES = {
  DIY_CRAFTS: 'diy_crafts',
  MOVIES_TV: 'movies_tv',
  BEAUTY_STYLE: 'beauty_style',
  FITNESS_WELLBEING: 'fitness_wellbeing',
  FOOD: 'food',
  TRAVEL: 'travel',
  MUSIC: 'music',
  SPORTS: 'sports',
};

export const TEMPLATE_CATEGORY_ITEMS = [
  {
    label: __('DIY & Crafts', 'web-stories'),
    value: TEMPLATE_CATEGORIES.DIY_CRAFTS,
  },
  {
    label: __('Movies & TV', 'web-stories'),
    value: TEMPLATE_CATEGORIES.MOVIES_TV,
  },
  {
    label: __('Beauty & Style', 'web-stories'),
    value: TEMPLATE_CATEGORIES.BEAUTY_STYLE,
  },
  {
    label: __('Fitness & Wellbeing', 'web-stories'),
    value: TEMPLATE_CATEGORIES.FITNESS_WELLBEING,
  },
  {
    label: __('Food', 'web-stories'),
    value: TEMPLATE_CATEGORIES.FOOD,
  },
  {
    label: __('Travel', 'web-stories'),
    value: TEMPLATE_CATEGORIES.TRAVEL,
  },
  {
    label: __('Music', 'web-stories'),
    value: TEMPLATE_CATEGORIES.MUSIC,
  },
  {
    label: __('Sports', 'web-stories'),
    value: TEMPLATE_CATEGORIES.SPORTS,
  },
];

export const TEMPLATE_COLORS = {
  WHITE: 'white',
  BLACK: 'black',
  GRAY: 'gray',
  BROWN: 'brown',
  RED: 'red',
  ORANGE: 'orange',
  YELLOW: 'yellow',
  GREEN: 'green',
  BLUE: 'blue',
  PINK: 'pink',
  PURPLE: 'purple',
};

export const TEMPLATE_COLOR_ITEMS = [
  {
    label: __('White', 'web-stories'),
    hex: '#FFFFFF',
    value: TEMPLATE_COLORS.WHITE,
  },
  {
    label: __('Black', 'web-stories'),
    hex: '#1A1D1F',
    value: TEMPLATE_COLORS.BLACK,
  },
  {
    label: __('Gray', 'web-stories'),
    hex: '#9AA1A9',
    value: TEMPLATE_COLORS.GRAY,
  },
  {
    label: __('Brown', 'web-stories'),
    hex: '#974A04',
    value: TEMPLATE_COLORS.BROWN,
  },
  {
    label: __('Red', 'web-stories'),
    hex: '#EB5757',
    value: TEMPLATE_COLORS.RED,
  },
  {
    label: __('Orange', 'web-stories'),
    hex: '#FA902E',
    value: TEMPLATE_COLORS.ORANGE,
  },
  {
    label: __('Yellow', 'web-stories'),
    hex: '#FAE84C',
    value: TEMPLATE_COLORS.YELLOW,
  },
  {
    label: __('Green', 'web-stories'),
    hex: '#6AE86F',
    value: TEMPLATE_COLORS.GREEN,
  },
  {
    label: __('Blue', 'web-stories'),
    hex: '#1374FA',
    value: TEMPLATE_COLORS.BLUE,
  },
  {
    label: __('Pink', 'web-stories'),
    hex: '#F078F2',
    value: TEMPLATE_COLORS.PINK,
  },
  {
    label: __('Purple', 'web-stories'),
    hex: '#AA6FE1',
    value: TEMPLATE_COLORS.PURPLE,
  },
];

export const TEMPLATES_GALLERY_STATUS = {
  ALL: 'template',
};

export const TEMPLATES_GALLERY_VIEWING_LABELS = {
  [TEMPLATES_GALLERY_STATUS.ALL]: __('Viewing all templates', 'web-stories'),
};
export const TEMPLATES_GALLERY_SORT_OPTIONS = {
  POPULAR: 'popular',
  RECENT: 'recent',
};

export const TEMPLATES_GALLERY_SORT_MENU_ITEMS = [
  {
    label: __('Popular', 'web-stories'),
    value: TEMPLATES_GALLERY_SORT_OPTIONS.POPULAR,
  },
  {
    label: __('Recent', 'web-stories'),
    value: TEMPLATES_GALLERY_SORT_OPTIONS.RECENT,
  },
];

export const TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS = {
  template: __('See details', 'web-stories'),
};
