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
import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { differenceInSeconds } from '../../date';
import { ApiContext } from '../app/api/apiProvider';
import { defaultStoriesState } from '../app/reducer/stories';
import {
  publisherLogoIds as fillerPublisherLogoIds,
  rawPublisherLogos,
} from '../dataUtils/formattedPublisherLogos';
import formattedUsersObject from '../dataUtils/formattedUsersObject';
import formattedStoriesArray from '../dataUtils/formattedStoriesArray';
import formattedTemplatesArray from '../dataUtils/formattedTemplatesArray';
import { STORY_STATUSES, STORY_SORT_OPTIONS } from '../constants/stories';

/* eslint-disable jasmine/no-unsafe-spy */
export default function ApiProviderFixture({ children }) {
  const [media, setMediaState] = useState(getMediaState());
  const [settings, setSettingsState] = useState(getSettingsState());
  const [stories, setStoriesState] = useState(getStoriesState());
  const [templates, setTemplatesState] = useState(getTemplatesState());
  const [users] = useState(formattedUsersObject);
  const [currentUser, setCurrentUser] = useState(getCurrentUserState());

  const settingsApi = useMemo(
    () => ({
      fetchSettings: () =>
        setSettingsState((currentState) => fetchSettings(currentState)),
      updateSettings: (updates) =>
        setSettingsState((currentState) =>
          updateSettings(updates, currentState)
        ),
    }),
    []
  );

  const mediaApi = useMemo(
    () => ({
      uploadMedia: jasmine.createSpy('uploadMedia'),
      fetchMediaById: (newIds) =>
        setMediaState((currentState) => fetchMediaById(newIds, currentState)),
    }),
    []
  );

  const storyApi = useMemo(
    () => ({
      duplicateStory: (story) =>
        setStoriesState((currentState) => duplicateStory(story, currentState)),
      fetchStories: (...args) =>
        setStoriesState((currentState) => fetchStories(...args, currentState)),
      clearStoryPreview: () =>
        setStoriesState((currentState) => clearStoryPreview(currentState)),
      createStoryPreview: () =>
        setStoriesState((currentState) => createStoryPreview(currentState)),
      createStoryFromTemplate: jasmine.createSpy('createStoryFromTemplate'),
      trashStory: (story) =>
        setStoriesState((currentState) => trashStory(story, currentState)),
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
      fetchExternalTemplates: () =>
        setTemplatesState((currentState) =>
          fetchExternalTemplates(currentState)
        ),
      fetchExternalTemplateById: (id) =>
        fetchExternalTemplateById(id, templates),
      fetchMyTemplates: jasmine.createSpy('fetchMyTemplates'),
      fetchMyTemplateById: (id) => fetchExternalTemplateById(id, templates),
      fetchRelatedTemplates: (currentTemplateId) =>
        fetchRelatedTemplates(currentTemplateId, templates),
      fetchSavedTemplates: jasmine.createSpy('fetchSavedTemplates'),
    }),
    [templates]
  );

  const usersApi = useMemo(
    () => ({
      fetchUsers: jasmine.createSpy('fetchUsers'),
      fetchCurrentUser: jasmine.createSpy('fetchCurrentUser'),
      toggleWebStoriesTrackingOptIn: () =>
        setCurrentUser(toggleOptInTracking(currentUser)),
    }),
    [currentUser]
  );

  const value = useMemo(
    () => ({
      state: {
        media,
        settings,
        stories,
        templates,
        users,
        currentUser,
      },
      actions: {
        mediaApi,
        settingsApi,
        storyApi,
        templateApi,
        usersApi,
      },
    }),
    [
      media,
      settings,
      stories,
      templates,
      users,
      currentUser,
      mediaApi,
      settingsApi,
      storyApi,
      templateApi,
      usersApi,
    ]
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}
/* eslint-enable jasmine/no-unsafe-spy */

ApiProviderFixture.propTypes = {
  children: PropTypes.node,
};

function getMediaState() {
  return {
    error: {},
    isLoading: false,
    newlyCreatedMediaIds: [],
    mediaById: rawPublisherLogos,
  };
}

function fetchMediaById(newIds, currentState) {
  const mediaState = { ...(currentState || getMediaState()) };
  // TODO handle adding Ids
  return mediaState;
}

function getSettingsState() {
  return {
    error: {},
    googleAnalyticsId: '',
    publisherLogoIds: [],
    activePublisherLogoId: fillerPublisherLogoIds[0],
  };
}

function getCurrentUserState() {
  return {
    data: { id: 1, meta: { web_stories_tracking_optin: true } },
    isUpdating: false,
  };
}

function fetchSettings(currentState) {
  const settingsState = { ...currentState } || getSettingsState();
  settingsState.googleAnalyticsId = 'UA-000000-2';
  settingsState.publisherLogoIds = fillerPublisherLogoIds.slice(0, 2);
  return settingsState;
}

function updateSettings(updates, currentState) {
  const {
    googleAnalyticsId,
    publisherLogoIds,
    publisherLogoIdToRemove,
    publisherLogoToMakeDefault,
  } = updates;
  if (googleAnalyticsId !== undefined) {
    return {
      ...currentState,
      googleAnalyticsId,
    };
  } else if (publisherLogoIds) {
    return {
      ...currentState,
      publisherLogoIds: [
        ...new Set([...currentState.publisherLogoIds, ...publisherLogoIds]),
      ],
    };
  } else if (publisherLogoIdToRemove) {
    return {
      ...currentState,
      publisherLogoIds: currentState.publisherLogoIds.filter(
        (logoId) => logoId !== publisherLogoIdToRemove
      ),
    };
  } else if (publisherLogoToMakeDefault) {
    return {
      ...currentState,
      activePublisherLogoId: publisherLogoToMakeDefault,
    };
  }
  return currentState;
}

function getStoriesState() {
  const copiedStories = [...formattedStoriesArray];
  copiedStories.sort((a, b) => differenceInSeconds(b.modified, a.modified)); // initial sort is desc by modified
  return {
    ...defaultStoriesState,
    stories: copiedStories.reduce((acc, curr) => {
      acc[curr.id] = curr;

      return acc;
    }, {}),
    storiesOrderById: copiedStories.map(({ id }) => id),
    totalStoriesByStatus: getTotalStoriesByStatus(copiedStories),
    totalPages: 1,
  };
}

function clearStoryPreview(currentState) {
  return {
    ...currentState,
    previewMarkup: '',
  };
}

function createStoryPreview(currentState) {
  return {
    ...currentState,
    previewMarkup: '<p>I am markup for a preview</p>',
  };
}

function fetchStories(
  {
    status = STORY_STATUSES[0].value,
    searchTerm = '',
    sortOption = STORY_SORT_OPTIONS.LAST_MODIFIED,
    sortDirection,
  },
  currentState
) {
  const storiesState = { ...currentState } || getStoriesState();
  const statuses = status.split(',');

  storiesState.storiesOrderById = Object.values(storiesState.stories)
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
          value = differenceInSeconds(a[sortOption], b[sortOption]);
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
  copy.modified = new Date();
  return {
    ...currentState,
    stories: {
      ...currentState.stories,
      [copy.id]: copy,
    },
  };
}

function duplicateStory(story, currenState) {
  const copiedState = { ...currenState };
  const copiedStory = { ...story };

  // Update fields on copy
  copiedStory.id = Math.round(Math.random() * 1000);
  copiedStory.title = copiedStory.title + ' (Copy)';
  copiedStory.created = new Date().toISOString();
  copiedStory.modified = copiedStory.created;
  copiedStory.bottomTargetAction = copiedStory.bottomTargetAction.replace(
    story.id,
    copiedStory.id
  );
  copiedStory.editStoryLink = copiedStory.editStoryLink.replace(
    story.id,
    copiedStory.id
  );

  // insert into copiedState
  copiedState.stories[copiedStory.id] = copiedStory;
  copiedState.storiesOrderById = [
    copiedStory.id,
    ...copiedState.storiesOrderById,
  ];

  // update stories by status
  copiedState.totalStoriesByStatus = getTotalStoriesByStatus(
    Object.values(copiedState.stories)
  );

  return copiedState;
}

function trashStory(story, currentState) {
  const copiedState = { ...currentState };
  // delete story from state and filter from ordered list
  delete copiedState.stories[story.id];
  copiedState.storiesOrderById = copiedState.storiesOrderById.filter(
    (id) => id !== story.id
  );

  // update story status counts
  copiedState.totalStoriesByStatus = getTotalStoriesByStatus(
    Object.values(copiedState.stories)
  );

  return copiedState;
}

function getTotalStoriesByStatus(stories = []) {
  return stories.reduce(
    (acc, curr) => {
      if (acc[curr.status] > 0) {
        acc[curr.status] = acc[curr.status] + 1;
      } else {
        acc[curr.status] = 1;
      }

      return acc;
    },
    {
      all: stories.length,
      draft: 0,
      published: 0,
    }
  );
}

function getTemplatesState() {
  const copiedTemplates = [...formattedTemplatesArray];
  return {
    allPagesFetched: true,
    error: {},
    isLoading: false,
    savedTemplates: {},
    savedTemplatesOrderById: [],
    templates: copiedTemplates.reduce((acc, curr) => {
      acc[curr.id] = curr;

      return acc;
    }, {}),
    templatesOrderById: copiedTemplates.map(({ id }) => id),
    totalTemplates: copiedTemplates.length,
    totalPages: 1,
  };
}

function fetchExternalTemplates(currentState) {
  return currentState;
}

function fetchExternalTemplateById(id, currentState) {
  return Promise.resolve(currentState.templates?.[id] ?? {});
}

function toggleOptInTracking(currentUser) {
  return {
    ...currentUser,
    data: {
      ...currentUser.data,
      meta: {
        web_stories_tracking_optin: !currentUser.data.meta
          .web_stories_tracking_optin,
      },
    },
  };
}

function fetchRelatedTemplates(currentTemplateId, currentState) {
  if (!currentState.templates || !currentTemplateId) {
    return [];
  }

  return currentState.templatesOrderById
    .filter((id) => id !== currentTemplateId) // Filter out the current/active template
    .sort(() => 0.5 - Math.random()) // Randomly sort the array of ids
    .map((id) => currentState.templates[id]) // Map the ids to templates
    .slice(0, Math.floor(Math.random() * 5) + 1); // Return between 1 and 5 templates
}
