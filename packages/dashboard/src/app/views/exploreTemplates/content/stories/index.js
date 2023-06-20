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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Layout } from '../../../../../components';
import { VIEW_STYLE } from '../../../../../constants';
import { formattedTemplatesArray } from '../../../../../storybookUtils';
import { usePagePreviewSize } from '../../../../../utils';
import Content from '..';

const StorybookLayoutContainer = styled.div`
  margin-top: 40px;
  height: 100vh;
`;

export default {
  title: 'Dashboard/Views/ExploreTemplates/Content',
  component: Content,
  args: {
    allPagesFetched: false,
    isLoading: false,
    pageValue: 1,
    searchKeyword: '',
    templates: formattedTemplatesArray,
    viewStyle: VIEW_STYLE.GRID,
    totalTemplates: 3,
  },
  argTypes: {
    handleDetailsToggle: { action: 'modal was toggled' },
    switchToTemplateByOffset: { action: 'switched to prev/next template' },
    set: { action: 'set page number' },
    requestNextPage: { action: 'request next page clicked' },
    setKeyword: { action: 'set search' },
    viewStyle: { options: VIEW_STYLE, control: 'radio' },
  },
  parameters: {
    controls: {
      exclude: [
        'pageValue',
        'templates',
        'page',
        'search',
        'view',
        'templateActions',
      ],
    },
  },
};

export const _default = {
  render: function Render(args) {
    const { pageSize } = usePagePreviewSize({
      isGrid: true,
    });
    const templateActions = {
      handleDetailsToggle: args.handleDetailsToggle,
      switchToTemplateByOffset: args.switchToTemplateByOffset,
    };
    const page = {
      set: args.set,
      requestNextPage: args.requestNextPage,
      value: args.pageValue,
    };
    const search = {
      setKeyword: args.setKeyword,
      keyword: args.searchKeyword,
    };
    const view = {
      pageSize,
      style: args.viewStyle,
    };

    const defaultNestedProps = {
      templateActions,
      page,
      search,
      view,
    };

    return (
      <Layout.Provider>
        <StorybookLayoutContainer>
          <Content {...args} {...defaultNestedProps} />
        </StorybookLayoutContainer>
      </Layout.Provider>
    );
  },
};

export const NoSearchResults = {
  render: _default,

  args: {
    allPagesFetched: true,
    totalTemplates: 0,
    searchKeyword: 'polar bears',
  },
};
