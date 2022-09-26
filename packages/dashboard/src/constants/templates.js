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
import { __, _x, sprintf, _n } from '@googleforcreators/i18n';

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
    label: _x('DIY & Crafts', 'template vertical', 'web-stories'),
    value: TEMPLATE_CATEGORIES.DIY_CRAFTS,
  },
  {
    label: _x('Movies & TV', 'template vertical', 'web-stories'),
    value: TEMPLATE_CATEGORIES.MOVIES_TV,
  },
  {
    label: _x('Beauty & Style', 'template vertical', 'web-stories'),
    value: TEMPLATE_CATEGORIES.BEAUTY_STYLE,
  },
  {
    label: _x('Fitness & Wellbeing', 'template vertical', 'web-stories'),
    value: TEMPLATE_CATEGORIES.FITNESS_WELLBEING,
  },
  {
    label: _x('Food', 'template vertical', 'web-stories'),
    value: TEMPLATE_CATEGORIES.FOOD,
  },
  {
    label: _x('Travel', 'template vertical', 'web-stories'),
    value: TEMPLATE_CATEGORIES.TRAVEL,
  },
  {
    label: _x('Music', 'template vertical', 'web-stories'),
    value: TEMPLATE_CATEGORIES.MUSIC,
  },
  {
    label: _x('Sports', 'template vertical', 'web-stories'),
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
    label: _x('White', 'color', 'web-stories'),
    hex: '#FFFFFF',
    value: TEMPLATE_COLORS.WHITE,
  },
  {
    label: _x('Black', 'color', 'web-stories'),
    hex: '#1A1D1F',
    value: TEMPLATE_COLORS.BLACK,
  },
  {
    label: _x('Gray', 'color', 'web-stories'),
    hex: '#9AA1A9',
    value: TEMPLATE_COLORS.GRAY,
  },
  {
    label: _x('Brown', 'color', 'web-stories'),
    hex: '#974A04',
    value: TEMPLATE_COLORS.BROWN,
  },
  {
    label: _x('Red', 'color', 'web-stories'),
    hex: '#EB5757',
    value: TEMPLATE_COLORS.RED,
  },
  {
    label: _x('Orange', 'color', 'web-stories'),
    hex: '#FA902E',
    value: TEMPLATE_COLORS.ORANGE,
  },
  {
    label: _x('Yellow', 'color', 'web-stories'),
    hex: '#FAE84C',
    value: TEMPLATE_COLORS.YELLOW,
  },
  {
    label: _x('Green', 'color', 'web-stories'),
    hex: '#6AE86F',
    value: TEMPLATE_COLORS.GREEN,
  },
  {
    label: _x('Blue', 'color', 'web-stories'),
    hex: '#1374FA',
    value: TEMPLATE_COLORS.BLUE,
  },
  {
    label: _x('Pink', 'color', 'web-stories'),
    hex: '#F078F2',
    value: TEMPLATE_COLORS.PINK,
  },
  {
    label: _x('Purple', 'color', 'web-stories'),
    hex: '#AA6FE1',
    value: TEMPLATE_COLORS.PURPLE,
  },
];

export const TEMPLATES_GALLERY_STATUS = {
  ALL: 'template',
};

export const TEMPLATES_GALLERY_VIEWING_LABELS = {
  [TEMPLATES_GALLERY_STATUS.ALL]: (n) =>
    sprintf(
      /* translators: %d: number of templates in view */
      _n(
        'Viewing <strong>%d</strong> template',
        'Viewing all <strong>%d</strong> templates',
        n,
        'web-stories'
      ),
      n
    ),
};

export const TEMPLATE_SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
};

export const TEMPLATES_GALLERY_SORT_OPTIONS = {
  POPULAR: 'popular',
  RECENT: 'recent',
};

export const TEMPLATE_SORT_KEYS = {
  orderby: TEMPLATES_GALLERY_SORT_OPTIONS,
  order: TEMPLATE_SORT_DIRECTION,
};

export const DEFAULT_TEMPLATE_FILTERS = {
  filters: {
    status: TEMPLATES_GALLERY_STATUS.ALL,
  },
  sort: {
    orderby: TEMPLATES_GALLERY_SORT_OPTIONS.POPULAR,
  },
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
