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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Layout } from '../../../../../components';
import { VIEW_STYLE } from '../../../../../constants';
import {
  STORYBOOK_PAGE_SIZE,
  formattedTemplatesArray,
} from '../../../../../storybookUtils';
import { usePagePreviewSize } from '../../../../../utils';
import Content from '../index';

const search = {
  keyword: '',
  setKeyword: action('set search'),
};
const view = {
  style: VIEW_STYLE.GRID,
  pageSize: STORYBOOK_PAGE_SIZE,
};
const page = {
  value: 1,
  set: action('set page number'),
  requestNextPage: action('request next page clicked'),
};

const templateActions = {
  createStoryFromTemplate: action('create story from template clicked'),
  handlePreviewTemplate: action('card was clicked to show preview mode'),
};
const defaultProps = {
  allPagesFetched: false,
  isLoading: false,
  page: page,
  search: search,
  templates: formattedTemplatesArray,
  view: view,
  totalTemplates: 3,
  templateActions,
};

const StorybookLayoutContainer = styled.div`
  margin-top: 40px;
  height: 100vh;
`;

export default {
  title: 'Dashboard/Views/ExploreTemplates/Content',
  component: Content,
};
export const _default = () => {
  const { pageSize } = usePagePreviewSize({
    isGrid: true,
  });

  return (
    <Layout.Provider>
      <StorybookLayoutContainer>
        <Content {...defaultProps} view={{ ...view, pageSize }} />
      </StorybookLayoutContainer>
    </Layout.Provider>
  );
};

export const AllTemplatesFetched = () => {
  const { pageSize } = usePagePreviewSize({
    isGrid: true,
  });
  return (
    <Layout.Provider>
      <StorybookLayoutContainer>
        <Content
          {...defaultProps}
          allPagesFetched={true}
          view={{ ...view, pageSize }}
        />
      </StorybookLayoutContainer>
    </Layout.Provider>
  );
};

export const NoTemplates = () => {
  return (
    <Layout.Provider>
      <StorybookLayoutContainer>
        <Content {...defaultProps} allPagesFetched={true} totalTemplates={0} />
      </StorybookLayoutContainer>
    </Layout.Provider>
  );
};

export const NoSearchResults = () => {
  return (
    <Layout.Provider>
      <StorybookLayoutContainer>
        <Content
          {...defaultProps}
          allPagesFetched={true}
          totalTemplates={0}
          search={{ ...search, keyword: 'polar bears' }}
        />
      </StorybookLayoutContainer>
    </Layout.Provider>
  );
};
