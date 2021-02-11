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
import { useMemo } from 'react';

/**
 * Internal dependencies
 */
import { useConfig } from '../config';
import { createContext } from '../../../design-system';
import dataAdapter from './wpAdapter';
import useMediaApi from './useMediaApi';
import useStoryApi from './useStoryApi';
import useTemplateApi from './useTemplateApi';
import useUsersApi from './useUserApi';
import useSettingsApi from './useSettingsApi';

export const ApiContext = createContext({ state: {}, actions: {} });

export default function ApiProvider({ children }) {
  const { api, editStoryURL, cdnURL, encodeMarkup } = useConfig();

  const { currentUser, api: usersApi } = useUsersApi(dataAdapter, {
    currentUserApi: api.currentUser,
  });

  const { templates, api: templateApi } = useTemplateApi(dataAdapter, {
    cdnURL,
    templateApi: api.templates,
    encodeMarkup,
  });

  const { stories, api: storyApi } = useStoryApi(dataAdapter, {
    editStoryURL,
    storyApi: api.stories,
    encodeMarkup,
  });

  const { media, api: mediaApi } = useMediaApi(dataAdapter, {
    globalMediaApi: api.media,
  });

  const { settings, api: settingsApi } = useSettingsApi(dataAdapter, {
    globalStoriesSettingsApi: api.settings,
  });

  const value = useMemo(
    () => ({
      state: {
        media,
        settings,
        stories,
        templates,
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

ApiProvider.propTypes = {
  children: PropTypes.node,
};
