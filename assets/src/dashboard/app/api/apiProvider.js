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
import { createContext, useMemo } from 'react';

/**
 * Internal dependencies
 */
import { useConfig } from '../config';
import dataAdapter from './wpAdapter';
import useFontApi from './useFontApi';
import useMediaApi from './useMediaApi';
import useStoryApi from './useStoryApi';
import useTemplateApi from './useTemplateApi';
import useUsersApi from './useUserApi';
import useSettingsApi from './useSettingsApi';

export const ApiContext = createContext({ state: {}, actions: {} });

export default function ApiProvider({ children }) {
  const { api, editStoryURL, assetsURL } = useConfig();

  const { users, api: usersApi } = useUsersApi(dataAdapter, {
    userApi: api.users,
  });

  const { templates, api: templateApi } = useTemplateApi(dataAdapter, {
    assetsURL,
    templateApi: api.templates,
  });

  const { stories, api: storyApi } = useStoryApi(dataAdapter, {
    editStoryURL,
    storyApi: api.stories,
  });

  const { api: fontApi } = useFontApi(dataAdapter, { fontApi: api.fonts });

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
        users,
      },
      actions: {
        mediaApi,
        settingsApi,
        storyApi,
        templateApi,
        fontApi,
        usersApi,
      },
    }),
    [
      media,
      settings,
      stories,
      templates,
      users,
      mediaApi,
      settingsApi,
      storyApi,
      templateApi,
      fontApi,
      usersApi,
    ]
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

ApiProvider.propTypes = {
  children: PropTypes.node,
};
