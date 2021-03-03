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
import { FlagsProvider } from 'flagged';

/**
 * Internal dependencies
 */
import { Layout } from '../../../../../components';
import { VIEW_STYLE } from '../../../../../constants';
import { SnackbarProvider } from '../../../../snackbar';
import {
  formattedStoriesArray,
  formattedTemplatesArray,
  STORYBOOK_PAGE_SIZE,
} from '../../../../../storybookUtils';
import { usePagePreviewSize } from '../../../../../utils';
import Content from '../';

export default {
  title: 'Dashboard/Views/SavedTemplates/Content',
  component: Content,
};

const search = {
  keyword: '',
  setKeyword: action('set search'),
};
const view = {
  style: VIEW_STYLE.GRID,
  toggleStyle: action('toggle view style'),
  pageSize: STORYBOOK_PAGE_SIZE,
};
const page = {
  value: 1,
  set: action('set page number'),
  requestNextPage: action('request next page clicked'),
};

const actions = {
  previewTemplate: action('handle preview template selected'),
  createStoryFromTemplate: action('handle create story from template'),
};

const longerListOfSavedTemplatesAndStories = formattedStoriesArray.concat(
  formattedTemplatesArray
);

const defaultProps = {
  allPagesFetched: false,
  isLoading: false,
  page: page,
  search: search,
  templates: longerListOfSavedTemplatesAndStories,
  actions,
  view: view,
};

const StorybookLayoutContainer = styled.div`
  margin-top: 40px;
  height: 100vh;
`;
export const _default = () => {
  const { pageSize } = usePagePreviewSize({
    isGrid: true,
  });

  return (
    <FlagsProvider features={{ enableInProgressStoryActions: false }}>
      <SnackbarProvider>
        <Layout.Provider>
          <StorybookLayoutContainer>
            <Content {...defaultProps} view={{ ...view, pageSize }} />
          </StorybookLayoutContainer>
        </Layout.Provider>
      </SnackbarProvider>
    </FlagsProvider>
  );
};

export const NoSavedTemplates = () => (
  <Layout.Provider>
    <SnackbarProvider>
      <StorybookLayoutContainer>
        <Content {...defaultProps} templates={[]} />
      </StorybookLayoutContainer>
    </SnackbarProvider>
  </Layout.Provider>
);

export const AllDataFetched = () => {
  const { pageSize } = usePagePreviewSize({
    isGrid: true,
  });
  return (
    <FlagsProvider features={{ enableInProgressStoryActions: false }}>
      <SnackbarProvider>
        <Layout.Provider>
          <StorybookLayoutContainer>
            <Content
              {...defaultProps}
              allPagesFetched={true}
              view={{ ...view, pageSize }}
            />
          </StorybookLayoutContainer>
        </Layout.Provider>
      </SnackbarProvider>
    </FlagsProvider>
  );
};
