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

/**
 * Internal dependencies
 */
import {
  STORY_SORT_OPTIONS,
  SORT_DIRECTION,
  VIEW_STYLE,
} from '../../../../../constants';
import formattedTemplatesArray from '../../../../../dataUtils/formattedTemplatesArray';
import { Layout } from '../../../../../components';
import Header from '../';

export default {
  title: 'Dashboard/Views/SavedTemplates/Header',
  component: Header,
};

const filter = {
  status: 'bookmarked, current_user',
  value: 'bookmarked, current_user',
  set: action('set filter'),
};
const sort = {
  value: STORY_SORT_OPTIONS.NAME,
  set: action('set sort'),
  direction: SORT_DIRECTION.ASC,
  setDirection: action('set sort direction'),
};
const search = {
  keyword: '',
  setKeyword: action('set search'),
};
const view = {
  style: VIEW_STYLE.GRID,
  toggleStyle: () => {},
  pageSize: { width: 309, height: 206 },
};

const defaultProps = {
  filter,
  view,
  search,
  templates: formattedTemplatesArray,
  sort,
};

export const _default = () => (
  <Layout.Provider>
    <Header {...defaultProps} />
  </Layout.Provider>
);

export const ActiveSearch = () => (
  <Layout.Provider>
    <Header
      {...defaultProps}
      search={{
        ...search,
        keyword: 'demo search',
      }}
    />
  </Layout.Provider>
);
