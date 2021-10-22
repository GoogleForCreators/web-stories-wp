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
import { useMemo, useState } from '@web-stories-wp/react';
import PropTypes from 'prop-types';
import { differenceInSeconds } from '@web-stories-wp/date';

/**
 * Internal dependencies
 */
import { ApiContext } from '../app/api/apiProvider';
import { defaultStoriesState } from '../app/reducer/stories';
import formattedStoriesArray from '../dataUtils/formattedStoriesArray';
import formattedTemplatesArray from '../dataUtils/formattedTemplatesArray';
import { STORY_STATUSES, STORY_SORT_OPTIONS } from '../constants/stories';
import { groupTemplatesByTag } from '../testUtils';

/* eslint-disable jasmine/no-unsafe-spy */
export default function ApiProviderFixture({ children }) {
  const [media] = useState(getMediaState());
  const [settings, setSettingsState] = useState(getSettingsState());
  const [stories, setStoriesState] = useState(getStoriesState());
  const [templates, setTemplatesState] = useState(getTemplatesState());
  const [currentUser, setCurrentUser] = useState(getCurrentUserState());
  const [publisherLogos, setPublisherLogosState] = useState(
    getPublisherLogosState()
  );

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
    }),
    []
  );

  const storyApi = useMemo(
    () => ({
      duplicateStory: (story) =>
        setStoriesState((currentState) => duplicateStory(story, currentState)),
      fetchStories: (...args) =>
        setStoriesState((currentState) => fetchStories(...args, currentState)),
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
      fetchExternalTemplates: () =>
        setTemplatesState((currentState) =>
          fetchExternalTemplates(currentState)
        ),
      fetchExternalTemplateById: (id) =>
        fetchExternalTemplateById(id, templates),
    }),
    [templates]
  );

  const usersApi = useMemo(
    () => ({
      toggleWebStoriesTrackingOptIn: () =>
        setCurrentUser(toggleOptInTracking(currentUser)),
    }),
    [currentUser]
  );

  const pagesApi = useMemo(
    () => ({
      searchPages: jasmine.createSpy('searchPages'),
      getPageById: jasmine.createSpy('getPageById'),
    }),
    []
  );

  const publisherLogosApi = useMemo(
    () => ({
      fetchPublisherLogos: () =>
        setPublisherLogosState((currentState) =>
          fetchPublisherLogos(currentState)
        ),
      addPublisherLogo: (publisherLogoId) =>
        setPublisherLogosState((currentState) =>
          addPublisherLogo(publisherLogoId, currentState)
        ),
      removePublisherLogo: (publisherLogoId) =>
        setPublisherLogosState((currentState) =>
          removePublisherLogo(publisherLogoId, currentState)
        ),
      setPublisherLogoAsDefault: (publisherLogoId) =>
        setPublisherLogosState((currentState) =>
          setPublisherLogoAsDefault(publisherLogoId, currentState)
        ),
    }),
    []
  );

  const value = useMemo(
    () => ({
      state: {
        media,
        settings,
        stories,
        templates,
        currentUser,
        publisherLogos,
      },
      actions: {
        mediaApi,
        settingsApi,
        storyApi,
        templateApi,
        usersApi,
        pagesApi,
        publisherLogosApi,
      },
    }),
    [
      media,
      settings,
      stories,
      templates,
      currentUser,
      mediaApi,
      settingsApi,
      storyApi,
      templateApi,
      usersApi,
      pagesApi,
      publisherLogos,
      publisherLogosApi,
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
  };
}

function getSettingsState() {
  return {
    error: {},
    settingSaved: false,
    googleAnalyticsId: '',
    usingLegacyAnalytics: false,
    adSensePublisherId: '',
    adSenseSlotId: '',
    adManagerSlotId: '',
    adNetwork: 'none',
    archive: 'default',
    archivePageId: 0,
  };
}

function getCurrentUserState() {
  return {
    data: { id: 1, meta: { webStoriesTrackingOptin: true } },
    isUpdating: false,
  };
}

function fetchSettings(currentState) {
  const settingsState = currentState ? { ...currentState } : getSettingsState();
  settingsState.googleAnalyticsId = 'UA-000000-2';
  return settingsState;
}

function updateSettings(updates, currentState) {
  const { googleAnalyticsId } = updates;
  currentState.settingSaved = true;

  if (googleAnalyticsId !== undefined) {
    return {
      ...currentState,
      googleAnalyticsId,
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

function fetchStories(
  {
    status = STORY_STATUSES[0].value,
    searchTerm = '',
    sortOption = STORY_SORT_OPTIONS.LAST_MODIFIED,
    sortDirection,
  },
  currentState
) {
  const storiesState = currentState ? { ...currentState } : getStoriesState();
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
          value = a.author.name.localeCompare(b.author.name);
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
  copy.content = copy.content?.raw;
  copy.modified = new Date();
  return {
    ...currentState,
    stories: {
      ...currentState.stories,
      [copy.id]: copy,
    },
  };
}

function duplicateStory(story, currentState) {
  const copiedState = { ...currentState };
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
      publish: 0,
      private: 0,
      future: 0,
    }
  );
}

function getTemplatesState() {
  const copiedTemplates = [...formattedTemplatesArray];
  return {
    allPagesFetched: true,
    error: {},
    isLoading: false,
    templates: copiedTemplates.reduce((acc, curr) => {
      acc[curr.id] = curr;

      return acc;
    }, {}),
    templatesByTag: groupTemplatesByTag(copiedTemplates),
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
        webStoriesTrackingOptin: !currentUser.data.meta.webStoriesTrackingOptin,
      },
    },
  };
}

function getPublisherLogosState() {
  return {
    error: {},
    isLoading: false,
    publisherLogos: [],
    settingSaved: false,
  };
}

function fetchPublisherLogos(currentState) {
  return {
    ...currentState,
    isLoading: true,
    settingSaved: false,
    publisherLogos: [
      {
        id: 577,
        src: 'https://picsum.photos/96',
        title: 'dummy image 1',
        active: true,
      },
      {
        id: 584,
        src: 'https://picsum.photos/97',
        title: 'dummy image 2',
        active: false,
      },
      {
        id: 582,
        src: 'https://picsum.photos/98',
        title: 'dummy image 3',
        active: false,
      },
      {
        id: 581,
        src: 'https://picsum.photos/99',
        title: 'dummy image 4',
        active: false,
      },
    ],
  };
}

function addPublisherLogo(publisherLogoId, currentState) {
  // todo: eventually support uploading new publisher logos.
  return {
    ...currentState,
    isLoading: false,
    settingSaved: true,
  };
}
function removePublisherLogo(publisherLogoId, currentState) {
  const wasDefault = currentState.publisherLogos.some(
    ({ id, active }) => id === publisherLogoId && active
  );

  const newPublisherLogos = [...currentState.publisherLogos]
    .filter(({ id }) => id !== publisherLogoId)
    .map((publisherLogo, index) => {
      publisherLogo.active = wasDefault ? 0 === index : publisherLogo.active;
      return publisherLogo;
    });

  return {
    ...currentState,
    isLoading: false,
    settingSaved: true,
    publisherLogos: newPublisherLogos,
  };
}

function setPublisherLogoAsDefault(publisherLogoId, currentState) {
  const newPublisherLogos = [...currentState.publisherLogos].map(
    (publisherLogo) => {
      publisherLogo.active = publisherLogo.id === publisherLogoId;
      return publisherLogo;
    }
  );

  return {
    ...currentState,
    isLoading: false,
    settingSaved: true,
    publisherLogos: newPublisherLogos,
  };
}
