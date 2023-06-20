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
 * Internal dependencies
 */
import Header from '..';
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
  args: {
    status: 'all',
    statusValue: STORY_STATUS.ALL,
    value: STORY_SORT_OPTIONS.NAME,
    direction: SORT_DIRECTION.ASC,
    keyword: '',
    style: VIEW_STYLE.GRID,
    all: 32,
    draft: 19,
    publish: 13,
  },
  argTypes: {
    setFilter: { action: 'set filter' },
    setSort: { action: 'set sort' },
    setDirection: { action: 'set sort direction' },
    setKeyword: { action: 'set search' },
    toggleStyle: { action: 'toggle view style' },
    statusValue: { options: STORY_STATUS, control: 'select' },
    value: {
      options: STORY_SORT_OPTIONS,
      control: 'radio',
      name: 'Story sort options',
    },
    direction: { options: SORT_DIRECTION, control: 'radio' },
    style: { options: VIEW_STYLE, control: 'radio' },
  },
  parameters: {
    controls: {
      include: [
        'statusValue',
        'Story sort options',
        'direction',
        'style',
        'draft',
        'publish',
        'setSort',
        'toggleStyle',
        'keyword',
      ],
    },
  },
};

export const _default = {
  render: function Render(args) {
    const filter = {
      status: args.status,
      value: args.statusValue,
      set: args.setFilter,
    };
    const sort = {
      value: args.value,
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
      pageSize: { width: 309, height: 206 },
    };
    const totalStoriesByStatus = {
      all: args.all,
      draft: args.draft,
      publish: args.publish,
    };

    const defaultProps = {
      filter,
      view,
      search,
      stories: formattedStoriesArray,
      sort,
      totalStoriesByStatus,
    };
    return (
      <Layout.Provider>
        <Header {...args} {...defaultProps} />
      </Layout.Provider>
    );
  },
};
