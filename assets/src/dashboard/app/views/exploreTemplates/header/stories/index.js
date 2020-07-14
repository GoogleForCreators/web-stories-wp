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
import { FlagsProvider } from 'flagged';

/**
 * Internal dependencies
 */
import { Layout } from '../../../../../components';
import {
  TEMPLATES_GALLERY_SORT_OPTIONS,
  VIEW_STYLE,
  TEMPLATES_GALLERY_STATUS,
} from '../../../../../constants';
import Header from '../index';
import formattedTemplatesArray from '../../../../../dataUtils/formattedTemplatesArray';

const filter = {
  value: TEMPLATES_GALLERY_STATUS.ALL,
};
const sort = {
  value: TEMPLATES_GALLERY_SORT_OPTIONS.POPULAR,
  set: action('set sort'),
};
const search = {
  keyword: '',
  setKeyword: action('set search'),
};
const view = {
  style: VIEW_STYLE.GRID,
  pageSize: { width: 210, height: 316 },
};
const page = {
  value: 1,
  set: action('set page number'),
  requestNextPage: action('request next page clicked'),
};

const defaultProps = {
  allPagesFetched: false,
  isLoading: false,
  page: page,
  search: search,
  templates: formattedTemplatesArray,
  sort: sort,
  filter: filter,
  view: view,
  totalTemplates: 3,
};

export default {
  title: 'Dashboard/Views/ExploreTemplates/Header',
  component: Header,
};

export const _default = () => (
  <FlagsProvider features={{ enableInProgressTemplateActions: false }}>
    <Layout.Provider>
      <Header {...defaultProps} />
    </Layout.Provider>
  </FlagsProvider>
);

export const ActiveSearch = () => (
  <FlagsProvider features={{ enableInProgressTemplateActions: true }}>
    <Layout.Provider>
      <Header
        {...defaultProps}
        search={{
          ...search,
          keyword: 'demo search',
        }}
      />
    </Layout.Provider>
  </FlagsProvider>
);
