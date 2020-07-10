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
import Header from '../';
import {
  STORY_SORT_OPTIONS,
  SORT_DIRECTION,
  VIEW_STYLE,
  STORY_STATUS,
} from '../../../../../constants';
import formattedStoriesArray from '../../../../../dataUtils/formattedStoriesArray';
import { Layout } from '../../../../../components';

export default {
  title: 'Dashboard/Views/MyStories/Header',
  component: Header,
};

const filter = {
  status: 'all',
  value: STORY_STATUS.ALL,
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
  toggleStyle: action('toggle view style'),
  pageSize: { width: 309, height: 206 },
};
const totalStoriesByStatus = {
  all: 32,
  draft: 19,
  publish: 13,
};

const defaultProps = {
  filter,
  view,
  search,
  stories: formattedStoriesArray,
  sort,
  totalStoriesByStatus,
  wpListURL: 'fakeurltoWordPressList.com',
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

export const ViewingDrafts = () => (
  <Layout.Provider>
    <Header
      {...defaultProps}
      filter={{
        ...filter,
        status: 'DRAFT',
        value: STORY_STATUS.DRAFT,
      }}
    />
  </Layout.Provider>
);

export const ViewingList = () => (
  <Layout.Provider>
    <Header {...defaultProps} view={{ ...view, style: VIEW_STYLE.LIST }} />
  </Layout.Provider>
);
