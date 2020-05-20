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
import { Layout } from '../../../../../components';
import {
  STORY_SORT_OPTIONS,
  SORT_DIRECTION,
  VIEW_STYLE,
  STORY_STATUS,
} from '../../../../../constants';
import formattedStoriesArray from '../../../../../storybookUtils/formattedStoriesArray';
import formattedUsersObject from '../../../../../storybookUtils/formattedUsersObject';
import Content from '../';

export default {
  title: 'Dashboard/Components/myStories/Content',
  component: Content,
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
  pageSize: { width: 300, height: 255 },
};
const page = {
  value: 1,
  set: action('set page number'),
  requestNextPage: action('request next page clicked'),
};
const tags = {};
const categories = {};

const defaultProps = {
  allPagesFetched: false,
  categories: categories,
  filter: filter,
  isLoading: false,
  page: page,
  search: search,
  sort: sort,
  stories: formattedStoriesArray,
  storyActions: {
    createTemplateFromStory: action('create template from story clicked'),
    duplicateStory: action('duplicate story clicked'),
    trashStory: action('trash story clicked'),
    updateStory: action('update story clicked'),
  },
  tags: tags,
  users: formattedUsersObject,
  view: view,
};
export const _default = () => (
  <Layout.Provider>
    <Content {...defaultProps} />
  </Layout.Provider>
);

export const NoStories = () => (
  <Layout.Provider>
    <Content {...defaultProps} stories={[]} />
  </Layout.Provider>
);

export const AllDataFetched = () => (
  <Layout.Provider>
    <Content {...defaultProps} allPagesFetched={true} />
  </Layout.Provider>
);

export const AllDataFetchedAsList = () => (
  <Layout.Provider>
    <Content
      {...defaultProps}
      allPagesFetched={true}
      view={{
        ...view,
        style: VIEW_STYLE.LIST,
      }}
    />
  </Layout.Provider>
);
