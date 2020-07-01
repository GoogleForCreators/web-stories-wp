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
import PropTypes from 'prop-types';
import moment from 'moment';

/**
 * Internal dependencies
 */
import { useMemo, useState } from 'react';
import { ApiContext } from '../app/api/apiProvider';
import { defaultStoriesState } from '../app/reducer/stories';
import { defaultTemplatesState } from '../app/reducer/templates';
import formattedUsersObject from '../storybookUtils/formattedUsersObject';
import formattedStoriesArray from '../storybookUtils/formattedStoriesArray';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../edit-story/app/font/defaultFonts';
import { STORY_STATUSES, STORY_SORT_OPTIONS } from '../constants/stories';

/* eslint-disable jasmine/no-unsafe-spy */
export default function ApiProviderFixture({ children }) {
  const [stories, setStoriesState] = useState(getStoriesState());
  const [templates] = useState(defaultTemplatesState);
  const [users] = useState(formattedUsersObject);

  const storyApi = useMemo(
    () => ({
      duplicateStory: jasmine.createSpy('duplicateStory'),
      fetchStories: (...args) =>
        setStoriesState((currenState) => fetchStories(...args, currenState)),
      createStoryFromTemplate: jasmine.createSpy('createStoryFromTemplate'),
      trashStory: jasmine.createSpy('trashStory'),
      updateStory: (story) =>
        setStoriesState((currentState) => updateStory(story, currentState)),
    }),
    []
  );

  const templateApi = useMemo(
    () => ({
      bookmarkTemplateById: jasmine.createSpy('bookmarkTemplateById'),
      createTemplateFromStory: jasmine.createSpy('createTemplateFromStory'),
      fetchBookmarkedTemplates: jasmine.createSpy('fetchBookmarkedTemplates'),
      fetchExternalTemplates: jasmine.createSpy('fetchExternalTemplates'),
      fetchExternalTemplateById: jasmine.createSpy('fetchExternalTemplateById'),
      fetchMyTemplates: jasmine.createSpy('fetchMyTemplates'),
      fetchMyTemplateById: jasmine.createSpy('fetchMyTemplateById'),
      fetchRelatedTemplates: jasmine.createSpy('fetchRelatedTemplates'),
      fetchSavedTemplates: jasmine.createSpy('fetchSavedTemplates'),
    }),
    []
  );

  const usersApi = useMemo(
    () => ({
      fetchUsers: jasmine.createSpy('fetchUsers'),
    }),
    []
  );

  const fontApi = useMemo(
    () => ({
      getAllFonts: () => {
        return Promise.resolve(
          [TEXT_ELEMENT_DEFAULT_FONT].map((font) => ({
            name: font.family,
            value: font.family,
            ...font,
          }))
        );
      },
    }),
    []
  );

  const value = useMemo(
    () => ({
      state: {
        stories,
        templates,
        users,
      },
      actions: {
        storyApi,
        templateApi,
        fontApi,
        usersApi,
      },
    }),
    [stories, templates, users, usersApi, storyApi, templateApi, fontApi]
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}
/* eslint-enable jasmine/no-unsafe-spy */

ApiProviderFixture.propTypes = {
  children: PropTypes.node,
};

function getStoriesState() {
  const copiedStories = [...formattedStoriesArray];
  copiedStories.sort((a, b) => b.modified.diff(a.modified)); // initial sort is desc by modified
  return {
    ...defaultStoriesState,
    stories: copiedStories.reduce((acc, curr) => {
      acc[curr.id] = curr;

      return acc;
    }, {}),
    storiesOrderById: copiedStories.map(({ id }) => id),
    totalStoriesByStatus: copiedStories.reduce(
      (acc, curr) => {
        if (acc[curr.status] > 0) {
          acc[curr.status] = acc[curr.status] + 1;
        } else {
          acc[curr.status] = 1;
        }

        return acc;
      },
      {
        all: copiedStories.length,
        draft: 0,
        published: 0,
      }
    ),
    totalPages: 1,
  };
}

function fetchStories(
  {
    status = STORY_STATUSES[0].value,
    searchTerm = '',
    sortOption = STORY_SORT_OPTIONS.LAST_MODIFIED,
    sortDirection,
  },
  currentStoriesState
) {
  const storiesState = { ...currentStoriesState } || getStoriesState();
  const statuses = status.split(',');

  storiesState.storiesOrderById = formattedStoriesArray
    .filter(
      ({ status: storyStatus, title }) =>
        statuses.includes(storyStatus) && title.includes(searchTerm)
    )
    .sort((a, b) => {
      let value;
      switch (sortOption) {
        case STORY_SORT_OPTIONS.DATE_CREATED: {
          value = new Date(a.created).getTime() - new Date(b.created).getTime();
          break;
        }
        case STORY_SORT_OPTIONS.LAST_MODIFIED: {
          value = a[sortOption].diff(b[sortOption]);
          break;
        }
        case STORY_SORT_OPTIONS.NAME: {
          value = a[sortOption].localeCompare(b[sortOption]);
          break;
        }
        case STORY_SORT_OPTIONS.CREATED_BY: {
          value = formattedUsersObject[a.author].name.localeCompare(
            formattedUsersObject[b.author].name
          );
          break;
        }
        default: {
          value = 0;
          break;
        }
      }

      const shouldSortDescending =
        (sortDirection && sortDirection === 'desc') ||
        (!sortDirection && sortOption === STORY_SORT_OPTIONS.LAST_MODIFIED);

      return shouldSortDescending ? value * -1 : value;
    })
    .map(({ id }) => id);
  return storiesState;
}

function updateStory(story, currentState) {
  const copy = { ...story };
  copy.title = copy.title.raw;
  copy.modified = moment(new Date(), 'MM-DD-YYYY');
  return {
    ...currentState,
    stories: {
      ...currentState.stories,
      [copy.id]: copy,
    },
  };
}
