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
import Header from '..';
import formattedTemplatesArray from '../../../../../dataUtils/formattedTemplatesArray';

export default {
  title: 'Dashboard/Views/ExploreTemplates/Header',
  component: Header,
  args: {
    style: VIEW_STYLE.GRID,
    sortValue: TEMPLATES_GALLERY_SORT_OPTIONS.POPULAR,
    filterValue: TEMPLATES_GALLERY_STATUS.ALL,
    keyword: '',
    enableInProgressTemplateActions: true,
  },
  argTypes: {
    style: { options: VIEW_STYLE, control: 'radio' },
    sortValue: { options: TEMPLATES_GALLERY_SORT_OPTIONS, control: 'radio' },
    filterValue: { options: TEMPLATES_GALLERY_STATUS, control: 'radio' },
    setSort: { action: 'set Sort' },
    setKeyword: { action: 'set keyword' },
    setPage: { action: 'set page' },
    requestNextPage: { action: 'request next page clicked' },
  },
  parameters: {
    controls: {
      include: ['setKeyword'],
      hideNoControlsWarning: true,
    },
  },
};

export const _default = (args) => {
  const filter = {
    value: args.filterValue,
  };
  const sort = {
    value: args.sortValue,
    set: args.setSort,
  };
  const search = {
    keyword: args.keyword,
    setKeyword: args.setKeyword,
  };
  const view = {
    style: args.style,
    pageSize: { width: 210, height: 316 },
  };
  const page = {
    value: 1,
    set: args.setPage,
    requestNextPage: args.requestNextPage,
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
  return (
    <FlagsProvider features={args.enableInProgressTemplateActions}>
      <Layout.Provider>
        <Header {...args} {...defaultProps} />
      </Layout.Provider>
    </FlagsProvider>
  );
};
export const ActiveSearch = _default.bind({});
ActiveSearch.args = {
  keyword: 'demo search',
};
