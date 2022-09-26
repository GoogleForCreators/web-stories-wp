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
import { SnackbarProvider } from '@googleforcreators/design-system';
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
import { formattedStoriesArray } from '../../../../../storybookUtils';
import { usePagePreviewSize } from '../../../../../utils';
import Content from '..';

// Prevents storybook from shouting a bunch of console warnings about duplicate ids
function forceUniqueIds(stories) {
  return stories.map((story, index) => {
    const id = Math.floor(Math.random() * 500 * index);
    return { ...story, id };
  });
}
const longerListOfStories = forceUniqueIds(
  formattedStoriesArray
    .concat(formattedStoriesArray)
    .concat(formattedStoriesArray)
);

export default {
  title: 'Dashboard/Views/MyStories/Content',
  component: Content,
  args: {
    filterStatus: 'all',
    statusValue: STORY_STATUS.ALL,
    sortValue: STORY_SORT_OPTIONS.NAME,
    direction: SORT_DIRECTION.ASC,
    keyword: '',
    style: VIEW_STYLE.GRID,
    stories: longerListOfStories,
    allPagesFetched: false,
    thumbnailMode: false,
    isGrid: true,
    isLoading: false,
    canViewDefaultTemplates: true,
  },
  argTypes: {
    setFilter: { action: 'set filter' },
    setSort: { action: 'set sort' },
    setDirection: { action: 'set sort direction' },
    setKeyword: { action: 'set search' },
    toggleStyle: { action: 'toggle view style' },
    statusValue: { options: STORY_STATUS, control: 'select' },
    sortValue: {
      options: STORY_SORT_OPTIONS,
      control: 'radio',
      name: 'Story sort options',
    },
    direction: { options: SORT_DIRECTION, control: 'radio' },
    style: { options: VIEW_STYLE, control: 'radio' },
    setPage: { action: 'set page number' },
    requestNextPage: { action: 'request next page clicked' },
    duplicateStory: { action: 'duplicate story clicked' },
    trashStory: { action: 'trash story clicked' },
    updateStory: { action: 'update story clicked' },
  },
  parameters: {
    controls: {
      include: [
        'style',
        'requestNextPage',
        'duplicateStory',
        'updateStory',
        'trashStory',
        'isGrid',
        'isThumbnailMode',
        'isLoading',
        'Story sort options',
        'direction',
        'allPagesFetched',
        'statusValue',
        'canViewDefaultTemplates',
      ],
    },
  },
};

const StorybookLayoutContainer = styled.div`
  margin-top: 40px;
  height: 100vh;
`;
export const _default = (args) => {
  const { pageSize } = usePagePreviewSize({
    isGrid: args.isGrid,
    thumbnailMode: args.thumbnailMode,
  });
  const filter = {
    status: args.filterStatus,
    value: args.statusValue,
    set: args.setFilter,
  };
  const sort = {
    value: args.sortValue,
    direction: args.direction,
    set: args.setSort,
    setDirection: args.setDirection,
  };
  const search = {
    keyword: args.keyword,
    setKeyword: args.setKeyword,
  };
  const view = {
    style: args.style,
    toggleStyle: args.toggleStyle,
    pageSize,
  };
  const page = {
    value: 1,
    set: args.setPage,
    requestNextPage: args.requestNextPage,
  };
  const storyActions = {
    duplicateStory: args.duplicateStory,
    trashStory: args.trashStory,
    updateStory: args.updateStory,
  };

  const defaultProps = {
    allPagesFetched: args.allPagesFetched,
    filter: filter,
    isLoading: args.isLoading,
    page: page,
    search: search,
    sort: sort,
    stories: args.stories,
    storyActions: storyActions,
    view: view,
  };
  return (
    <SnackbarProvider>
      <Layout.Provider>
        <StorybookLayoutContainer>
          <Content {...args} {...defaultProps} />
        </StorybookLayoutContainer>
      </Layout.Provider>
    </SnackbarProvider>
  );
};

export const NoStories = _default.bind({});
NoStories.args = {
  stories: [],
};
export const NoSearchResult = _default.bind({});
NoSearchResult.args = {
  stories: [],
  keyword: 'koalas',
};
